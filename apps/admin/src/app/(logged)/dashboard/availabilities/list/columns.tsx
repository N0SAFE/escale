import { DataTableColumnHeader } from '@/components/atomics/organisms/DataTable/DataTableColumnHeader'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import { DType } from '../utils'
import { Promisable } from '@/types/utils'
import { ActionsCellRow } from '@/components/atomics/organisms/DataTable/ActionsCellRow'
import { ActionsCellHeader } from '@/components/atomics/organisms/DataTable/ActionsCellHeader'

export type ColumnOptions = {
    onRowDelete?: (rows: DType[]) => Promisable<void>
    onRowEdit?: (rows: DType[]) => Promisable<void>
    onRowView?: (rows: DType[]) => Promisable<void>
}

export const useColumns = (options?: ColumnOptions) => {
    const columns: ColumnDef<DType>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value: boolean) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value: boolean) =>
                        row.toggleSelected(!!value)
                    }
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'startAt',
            header: ({ column }) => {
                return (
                    <DataTableColumnHeader column={column} title="Start at" />
                )
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.original.startAt}</div>
            ),
        },
        {
            accessorKey: 'endAt',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="End at" />
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.original.endAt}</div>
            ),
        },
        {
            accessorKey: 'spa',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Spa" />
            },
            cell: ({ row }) =>
                row.original?.spa?.id ? (
                    <Link
                        href={`../spa/${row.original.spa.title}`}
                        className="lowercase"
                    >
                        {row.original.spa.title}
                    </Link>
                ) : (
                    <div className="lowercase">none</div>
                ),
        },
        {
            id: 'actions',
            enableHiding: false,
            header: ({ table }) => {
                if (
                    table.getIsSomeRowsSelected() ||
                    table.getIsAllRowsSelected()
                ) {
                    return (
                        <ActionsCellHeader
                            rows={table.getSelectedRowModel().rows}
                            options={options}
                        />
                    )
                }
                return null
            },
            cell: (cellContext): React.ReactNode => {
                return (
                    <ActionsCellRow row={cellContext.row} options={options} />
                )
            },
        },
    ]
    return columns
}
