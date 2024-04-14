'use client'

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
    Table as TableType,
    TableMeta,
    TableOptions,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import React from 'react'
import Loader from '../../atoms/Loader'
import { Button } from '../../../ui/button'
import { DataTablePagination } from './DataTablePagination'
import { DataTableViewOptions } from './DataTableViewOptions'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue>
    extends React.ComponentProps<typeof Table> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[] | undefined
    isLoading?: boolean
    notFound?: React.ReactNode
    tableRef?: React.RefObject<TableType<TData>>
    usePagination?: boolean
    meta?: TableMeta<TData>
    tableOptions?: TableOptions<TData>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    notFound,
    tableRef,
    usePagination = true,
    className,
    divClassname,
    meta,
    tableOptions,
    ...props
}: DataTableProps<TData, TValue>) {
    console.log('render DataTable')
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        ...tableOptions, // can override the above
        data: data ?? [],
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            ...tableOptions?.state,
        },
    })

    React.useImperativeHandle(tableRef, () => table, [table])

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md border">
                <Table
                    className={cn(
                        'rounded-md border-border w-full h-10 overflow-clip relative ',
                        className
                    )}
                    divClassname={cn(
                        'max-h-screen overflow-y-auto',
                        divClassname
                    )}
                >
                    <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <span className="flex items-center justify-center">
                                        <Loader />
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {notFound ? (
                                        typeof notFound == 'string' ? (
                                            <span className="flex items-center justify-center">
                                                {notFound}
                                            </span>
                                        ) : (
                                            notFound
                                        )
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {usePagination && <DataTablePagination table={table} />}
        </div>
    )
}
