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
    Row,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import React, { CSSProperties, use } from 'react'
import Loader from '../../atoms/Loader'
import { Button } from '../../../ui/button'
import { DataTablePagination } from './DataTablePagination'
import { DataTableViewOptions } from './DataTableViewOptions'
import { cn } from '@/lib/utils'
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

interface DataTableProps<TData extends { uuid: UniqueIdentifier }, TValue>
    extends React.ComponentProps<typeof Table> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[] | undefined
    isLoading?: boolean
    notFound?: React.ReactNode
    tableRef?: React.RefObject<TableType<TData>>
    usePagination?: boolean
    meta?: TableMeta<TData>
    tableOptions?: TableOptions<TData>
    useDragabble?: boolean
    rowIsDraggable?: boolean
    onReorder?: (event: DragEndEvent) => void
    useId?: (data: TData) => UniqueIdentifier
}

function DraggableRow<TData extends { uuid: UniqueIdentifier }>({
    row,
    rowIsDraggable,
}: {
    row: Row<TData>
    rowIsDraggable?: boolean
}) {
    const {
        transform,
        transition,
        setNodeRef,
        isDragging,
        attributes,
        listeners,
    } = useSortable({
        id: row.original.uuid,
    })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    }
    return (
        // connect row ref to dnd-kit, apply important styles
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && 'selected'}
            {...(rowIsDraggable
                ? {
                      ...attributes,
                      ...listeners,
                  }
                : {})}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function DataTable<TData extends { uuid: UniqueIdentifier }, TValue>({
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
    useDragabble,
    rowIsDraggable,
    onReorder,
    useId,
    ...props
}: DataTableProps<TData, TValue>) {
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

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map((data) => data.uuid) ?? ([] as UniqueIdentifier[]),
        [data]
    )

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onReorder}
            sensors={sensors}
        >
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
                                                          header.column
                                                              .columnDef.header,
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
                                <SortableContext
                                    items={useDragabble ? dataIds : []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table.getRowModel().rows.map((row) => (
                                        <DraggableRow
                                            key={row.id}
                                            row={row}
                                            rowIsDraggable={
                                                useDragabble
                                                    ? rowIsDraggable
                                                    : false
                                            }
                                        />
                                    ))}
                                </SortableContext>
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
        </DndContext>
    )
}
