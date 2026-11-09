import { NextRequest } from 'next/server';
import { faker } from '@faker-js/faker';

export type Room = {
  id: number;
  name: string;
  code: string;

  // Room information
  floor: number;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Family';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';

  // Capacity
  capacity: number;
  beds: number;
  area: number;
  // Pricing
  price: number;
  discount: number;
  // Customer
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  // Management
  manager: string;
  description: string;
  amenities: string[];
  // Status
  isActive: boolean;
  isFeatured: boolean;
  // Dates
  checkInDate: string | null;
  checkOutDate: string | null;
  createdAt: string;
  updatedAt: string;
  // Images
  thumbnail: string;
};

type SortDirection = 'asc' | 'desc';

const roomTypes: Room['type'][] = ['Standard', 'Deluxe', 'Suite', 'Family'];

const roomStatuses: Room['status'][] = [
  'available',
  'occupied',
  'maintenance',
  'reserved',
];

const amenitiesList = [
  'Wifi',
  'TV',
  'Air Conditioner',
  'Mini Bar',
  'Bathtub',
  'Balcony',
  'Ocean View',
  'Room Service',
  'Safe Box',
  'Hair Dryer',
  'Swimming Pool',
  'Breakfast',
  'Gym',
  'Parking',
];

const TOTAL_ROOMS = 3000;

faker.seed(123);

const mockRooms: Room[] = Array.from({ length: TOTAL_ROOMS }, (_, index) => {
  const roomNumber = 101 + index;
  const status = faker.helpers.arrayElement(roomStatuses);
  const isOccupied = status === 'occupied' || status === 'reserved';
  const checkInDate = isOccupied ? faker.date.recent({ days: 10 }) : null;
  const checkOutDate = isOccupied ? faker.date.soon({ days: 10 }) : null;
  const createdAt = faker.date.past({
    years: 2,
  });

  const updatedAt = faker.date.recent({
    days: 30,
  });

  return {
    id: index + 1,

    name: `Room ${roomNumber}`,
    code: `ROOM-${roomNumber}`,

    floor: Math.floor(index % 15) + 1,
    type: faker.helpers.arrayElement(roomTypes),
    status,

    capacity: faker.number.int({
      min: 1,
      max: 6,
    }),

    beds: faker.number.int({
      min: 1,
      max: 3,
    }),

    area: faker.number.int({
      min: 20,
      max: 100,
    }),

    price: faker.number.int({
      min: 300000,
      max: 5000000,
    }),

    discount: faker.number.int({
      min: 0,
      max: 30,
    }),

    customerName: isOccupied ? faker.person.fullName() : null,

    customerEmail: isOccupied ? faker.internet.email() : null,

    customerPhone: isOccupied ? faker.phone.number() : null,

    manager: faker.person.fullName(),

    description: faker.lorem.paragraph(),

    amenities: faker.helpers.arrayElements(amenitiesList, {
      min: 2,
      max: 6,
    }),

    isActive: faker.datatype.boolean({
      probability: 0.9,
    }),

    isFeatured: faker.datatype.boolean({
      probability: 0.3,
    }),

    checkInDate: checkInDate?.toISOString() ?? null,

    checkOutDate: checkOutDate?.toISOString() ?? null,

    createdAt: createdAt.toISOString(),

    updatedAt: updatedAt.toISOString(),

    thumbnail: faker.image.url(),
  };
});

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function compareValues(a: unknown, b: unknown): number {
  // Null / undefined
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  // Number
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // Boolean
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }

  // Date / String
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  // Query parameters
  const search = searchParams.get('search')?.trim() || '';
  const status = searchParams.get('status') || '';
  const type = searchParams.get('type') || '';
  const field = searchParams.get('field') || '';
  const direction = searchParams.get('direction') || 'asc';
  const floor = searchParams.get('floor') || '';
  const capacity = searchParams.get('capacity') || '';
  const isActive = searchParams.get('isActive') || '';
  const perPage = Math.max(1, Number(searchParams.get('perPage')) || 10);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  // Clone data
  let rooms: Room[] = [...mockRooms];

  if (status) {
    rooms = rooms.filter((room) => room.status === status);
  }

  if (type) {
    rooms = rooms.filter((room) => room.type === type);
  }

  if (floor) {
    rooms = rooms.filter((room) => room.floor === Number(floor));
  }
  if (capacity) {
    rooms = rooms.filter((room) => room.capacity === Number(capacity));
  }
  if (isActive !== '') {
    rooms = rooms.filter((room) => room.isActive === (isActive === 'true'));
  }

  if (search) {
    const keyword = search.toLowerCase();

    rooms = rooms.filter((room) => {
      const searchableFields = [
        room.name,
        room.code,
        room.type,
        room.status,
        room.customerName,
        room.customerEmail,
        room.customerPhone,
        room.manager,
        room.description,
        ...room.amenities,
      ];

      return searchableFields.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(keyword),
      );
    });
  }

  const allowedSortFields = Object.keys(mockRooms[0] ?? {}) as (keyof Room)[];

  if (field && allowedSortFields.includes(field as keyof Room)) {
    const sortField = field as keyof Room;

    rooms.sort((a, b) => {
      const result = compareValues(a[sortField], b[sortField]);

      return direction === 'desc' ? -result : result;
    });
  }

  const total = rooms.length;

  const totalPage = Math.ceil(total / perPage);

  const startIndex = (page - 1) * perPage;

  const data = rooms.slice(startIndex, startIndex + perPage);

  // Simulate API delay
  await wait(500);

  return Response.json({
    data,
    total,
    totalPage,
    currentPage: page,
    perPage,
  });
}
