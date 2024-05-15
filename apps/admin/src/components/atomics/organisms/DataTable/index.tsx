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
import React, { CSSProperties, useEffect } from 'react'
import Loader from '@/components/atomics/atoms/Loader'
import { DataTablePagination } from './DataTablePagination'
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
import For from '@/components/atomics/atoms/For'
import { useDataTableContext } from './DataTableContext'

interface DataTableProps<TData extends { uuid: UniqueIdentifier }, TValue>
    extends React.ComponentProps<typeof Table> {
    tableClassName?: string
    isLoading?: boolean
    notFound?: React.ReactNode
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
    isLoading,
    notFound,
    tableClassName,
    className,
    divClassname,
    useDragabble,
    rowIsDraggable,
    onReorder,
    useId,
    ...props
}: DataTableProps<TData, TValue>) {
    const { table } = useDataTableContext(
        'DataTable has to be render inside a DataTableProvider'
    )

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () =>
            table?.options?.data?.map((data) => data.uuid) ??
            ([] as UniqueIdentifier[]),
        [table?.options?.data]
    )

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onReorder}
            sensors={sensors}
        >
            <div
                className={cn(
                    'flex flex-col gap-4 overflow-hidden justify-between h-full',
                    className
                )}
            >
                <div className="rounded-md border overflow-hidden border-border">
                    <Table
                        className={cn(
                            'w-full h-10 overflow-clip relative',
                            tableClassName
                        )}
                        divClassname={cn(
                            'max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent',
                            divClassname
                        )}
                    >
                        <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary z-10">
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
                                        colSpan={table.options.columns.length}
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
                                    <For each={table.getRowModel().rows}>
                                        {(row) => (
                                            <DraggableRow
                                                key={row.id}
                                                row={row}
                                                rowIsDraggable={
                                                    useDragabble
                                                        ? rowIsDraggable
                                                        : false
                                                }
                                            />
                                        )}
                                    </For>
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={table.options.columns.length}
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
            </div>
        </DndContext>
    )
}
