'use client';

import { Table as AngelTable } from '@crong964/angel-table';

import '@crong964/angel-table/style.css';
import { Room } from './api/route';

const statusMap: Record<Room['status'], { label: string; className: string }> =
  {
    available: {
      label: 'Available',
      className:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    occupied: {
      label: 'Occupied',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    maintenance: {
      label: 'Under Maintenance',
      className:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    reserved: {
      label: 'Reserved',
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
  };

export default function JJJ() {
  return (
    <AngelTable
      {...{
        setup: {
          url: '/api',
          mode: 'dark',
          viewDefault: 'card',
          showColumns: true,
          typePagination: 'numbered',
        },

        columns: [
          {
            field: 'check_field',
            title: 'Select',
          },
          {
            title: 'ID',
            field: 'id',
            width: '70px',
          },
          {
            title: 'Room Image',
            field: 'thumbnail',
            render(row: any) {
              return (
                <img
                  src={row.thumbnail}
                  alt={row.name}
                  className='h-12 w-16 rounded-lg object-cover'
                />
              );
            },
          },
          {
            title: 'Room Name',
            field: 'name',
            sort: true,
          },
          {
            title: 'Room Code',
            field: 'code',
            sort: true,
          },
          {
            title: 'Floor',
            field: 'floor',
            sort: true,
          },
          {
            title: 'Room Type',
            field: 'type',
          },
          {
            title: 'Status',
            field: 'status',
            sort: true,
            render(row: any) {
              const status = statusMap[row.status as Room['status']];
              return (
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              );
            },
          },
          {
            title: 'Capacity',
            field: 'capacity',
            sort: true,
            render(row: any) {
              return `${row.capacity} guests`;
            },
          },
          {
            title: 'Number of Beds',
            field: 'beds',
            sort: true,
          },
          {
            title: 'Area',
            field: 'area',
            sort: true,
            render(row: any) {
              return `${row.area} m²`;
            },
          },
          {
            title: 'Room Price',
            field: 'price',
            sort: true,
            render(row: any) {
              return (
                <span className='font-semibold text-blue-600 dark:text-blue-400'>
                  {row.price.toLocaleString('en-US')} VND
                </span>
              );
            },
          },
          {
            title: 'Discount',
            field: 'discount',
            render(row: any) {
              return (
                <span className={row.discount > 0 ? 'text-red-500' : ''}>
                  {row.discount}%
                </span>
              );
            },
            show: false,
          },
          {
            title: 'Customer',
            field: 'customerName',
            render(row: any) {
              return (
                row.customerName || (
                  <span className='text-gray-400'>No customer</span>
                )
              );
            },
            show: false,
          },
          {
            title: 'Customer Email',
            field: 'customerEmail',
            show: false,
          },
          {
            title: 'Phone Number',
            field: 'customerPhone',
            show: false,
          },
          {
            title: 'Manager',
            field: 'manager',
            show: false,
          },
          {
            title: 'Amenities',
            field: 'amenities',
            show: false,
            render(row: any) {
              return (
                <div className='flex max-w-64 flex-wrap gap-1'>
                  {row.amenities.map((item: any) => (
                    <span
                      key={item}
                      className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    >
                      {item}
                    </span>
                  ))}
                </div>
              );
            },
          },
          {
            title: 'Description',
            field: 'description',
            render(row: any) {
              return (
                <span
                  className='block max-w-56 truncate'
                  title={row.description}
                >
                  {row.description}
                </span>
              );
            },
          },
          {
            title: 'Check-in Date',
            field: 'checkInDate',
            render(row: any) {
              return row.checkInDate
                ? new Date(row.checkInDate).toLocaleDateString('en-US')
                : '-';
            },
            show: false,
          },
          {
            title: 'Check-out Date',
            field: 'checkOutDate',
            render(row: any) {
              return row.checkOutDate
                ? new Date(row.checkOutDate).toLocaleDateString('en-US')
                : '-';
            },
            show: false,
          },
          {
            title: 'Featured',
            field: 'isFeatured',
            render(row: any) {
              return row.isFeatured ? (
                <span className='text-yellow-500'>★ Featured</span>
              ) : (
                <span className='text-gray-400'>No</span>
              );
            },
            show: false,
          },
          {
            title: 'Active',
            field: 'isActive',
            render(row: any) {
              return (
                <span
                  className={row.isActive ? 'text-green-600' : 'text-red-500'}
                >
                  {row.isActive ? 'Active' : 'Inactive'}
                </span>
              );
            },
            show: false,
          },
          {
            title: 'Created At',
            field: 'createdAt',
            render(row: any) {
              return new Date(row.createdAt).toLocaleString('en-US');
            },
            show: false,
          },
          {
            title: 'Updated At',
            field: 'updatedAt',
            render(row: any) {
              return new Date(row.updatedAt).toLocaleString('en-US');
            },
            show: false,
          },
          {
            title: 'Actions',
            field: 'action_field',
            className: 'text-center',
            render(row: any) {
              return (
                <div className='flex items-center justify-center gap-3'>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Add:', row);
                    }}
                    className='text-green-600 hover:text-green-700'
                  >
                    Add
                  </button>

                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit:', row);
                    }}
                    className='text-blue-600 hover:text-blue-700'
                  >
                    Edit
                  </button>

                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Delete:', row);
                    }}
                    className='text-red-600 hover:text-red-700'
                  >
                    Delete
                  </button>
                </div>
              );
            },
            show: false,
          },
        ],

        className: 'p-2',

        selector: [
          {
            field: 'type',
            title: 'Room Type',
            options: [
              { value: 'Standard', title: 'Standard' },
              { value: 'Deluxe', title: 'Deluxe' },
              { value: 'Suite', title: 'Suite' },
              { value: 'Family', title: 'Family' },
            ],
          },
          {
            field: 'status',
            title: 'Room Status',
            options: [
              { value: 'available', title: 'Available' },
              { value: 'occupied', title: 'Occupied' },
              { value: 'maintenance', title: 'Under Maintenance' },
              { value: 'reserved', title: 'Reserved' },
            ],
          },
          {
            field: 'floor',
            title: 'Floor',
            options: Array.from({ length: 15 }, (_, i) => ({
              value: String(i + 1),
              title: `Floor ${i + 1}`,
            })),
          },
          {
            field: 'capacity',
            title: 'Capacity',
            options: Array.from({ length: 6 }, (_, i) => ({
              value: String(i + 1),
              title: `${i + 1} Guests`,
            })),
          },
          {
            field: 'isActive',
            title: 'Activity Status',
            options: [
              { value: 'true', title: 'Active' },
              { value: 'false', title: 'Inactive' },
            ],
          },
        ],
      }}
    />
  );
}
