"use client"

import { Restaurant } from '@/models'
import {
  Column,
  ColumnFiltersState,
  Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Select from 'react-select';

const columnHelper = createColumnHelper<Restaurant>();

const columns = [
  columnHelper.accessor('name', {
    header: () => <span>Restaurant</span>,
    cell: props => <Link href={`/restaurants/${props.row.original.id}`} target='_blank'>{props.getValue()}</Link>,
    enableColumnFilter: false
  }),
  // columnHelper.accessor('location.address', {
  //   header: () => <span>Address</span>,
  //   cell: props => <Link href={`https://google.com/maps?daddr=${props.row.original.location.coordinates[0]},${props.row.original.location.coordinates[1]}&saddr=My+Location`} target='_blank'>{props.getValue()}</Link>,
  //   enableColumnFilter: false
  // }),
  columnHelper.accessor('cuisines', {
    header: () => <span>Cuisines</span>,
    cell: props => <div>{props.getValue().map((cuisine) => (<span key={cuisine.toLowerCase()}>{cuisine}</span>))}</div>,
    filterFn: (row, columnId, values) => {
      if (values.length === 0) {
        return true;
      }

      for (const value of values) {
        if (row.original.cuisines.includes(value)) {
          return true;
        }
      }

      return false;
    }
  }),
  columnHelper.accessor('neighborhoods', {
    header: () => <span>Neighborhoods</span>,
    cell: props => <div>{props.getValue().map((neighborhood) => (<span key={neighborhood.toLowerCase()}>{neighborhood}</span>))}</div>,
    filterFn: (row, columnId, values) => {
      if (values.length === 0) {
        return true;
      }

      for (const value of values) {
        if (row.original.neighborhoods.includes(value)) {
          return true;
        }
      }

      return false;
    }
  }),
  columnHelper.accessor((row => [!!row.lunch, !!row.brunch, !!row.dinner]), {
    id: 'meals',
    header: () => <span>Meals</span>,
    cell: props => (
      <div>
        {props.getValue()[0] ? <span>L</span> : null}
        {props.getValue()[1] ? <span>B</span> : null}
        {props.getValue()[2] ? <span>D</span> : null}
      </div>
    ),
    enableColumnFilter: false
  }),
  columnHelper.accessor('url', {
    header: () => <span>Page</span>,
    cell: props => <Link href={props.getValue()} target='_blank'>Page</Link>,
    enableColumnFilter: false
  }),
  columnHelper.accessor('location.coordinates', {
    header: () => <span>Directions</span>,
    cell: props => <Link href={`https://google.com/maps?daddr=${props.getValue()[0]},${props.getValue()[1]}&saddr=My+Location`} target='_blank'>Directions</Link>,
    enableColumnFilter: false
  }),
]

interface RestaurantTableProps {
  restaurants: Restaurant[];
  cuisines: string[];
  neighborhoods: string[];
}

function MultiSelectFilter({
  column,
  values,
}: {
  column: Column<Restaurant, any>
  values: string[]
}) {
  const options = values.map(value => ({
    value: value,
    label: value
  }));
  return (
    <div>
       <Select
          isMulti
          name={column.id}
          options={options}
          onChange={values => column.setFilterValue(values.map(value => value.label))}
        />
    </div>
  )
}

export function RestaurantTable({ restaurants, cuisines, neighborhoods }: RestaurantTableProps) {
  const [data, setData] = React.useState(() => [...restaurants]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const renderFilter = (column: Column<Restaurant, any>, table: Table<Restaurant>) => {
    if (!column.getCanFilter()) {
      return null;
    }

    if (["cuisines", "neighborhoods"].includes(column.id)) {
      return (<MultiSelectFilter column={column} values={column.id === "cuisines" ? cuisines : neighborhoods}/>)
    } else {
      return null;
    }
  }

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {renderFilter(header.column, table)}
                      </>
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
