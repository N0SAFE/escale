import { DataTableColumnHeader } from '@/components/atomics/organisms/DataTable/DataTableColumnHeader'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { DType } from './utils'
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
            accessorKey: 'title',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Title" />
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('title')}</div>
            ),
        },
        {
            accessorKey: 'description',
            header: ({ column }) => {
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Description"
                    />
                )
            },
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue('description')}</div>
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
