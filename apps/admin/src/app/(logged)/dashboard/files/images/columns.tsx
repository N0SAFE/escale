import { DataTableColumnHeader } from '@/components/atomics/organisms/DataTable/DataTableColumnHeader'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { DType } from './utils'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { ActionsCellRow } from '@/components/atomics/organisms/DataTable/ActionsCellRow'
import { ActionsCellHeader } from '@/components/atomics/organisms/DataTable/ActionsCellHeader'
import { Promisable } from '@/types/utils'

export type ColumnOptions = {
    onRowDelete?: (rows: DType[]) => Promisable<void>
    onRowEdit?: (rows: DType[]) => Promisable<void>
    onRowView?: (rows: DType[]) => Promisable<void>
}

type Size = `${number}b` | `${number}kb` | `${number}mb` | `${number}gb`

function fromBytes(bytes: number): Size {
    const units = ['b', 'kb', 'mb', 'gb']
    let value = bytes
    let unit = 0
    while (value > 1024) {
        value /= 1024
        unit++
    }
    return `${value.toFixed()}${units[unit]}` as Size
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
            accessorKey: 'image',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Image" />
            },
            cell: ({ row }) => (
                <ApiImage
                    className="h-auto w-auto"
                    path={row.original.path}
                    width={50}
                    height={50}
                    alt={row.original.alt}
                />
            ),
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Name" />
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.original.file.name}</div>
            ),
        },
        {
            accessorKey: 'size',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Size" />
            },
            cell: ({ row }) => (
                <div className="lowercase">
                    {fromBytes(row.original.file.size)}
                </div>
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
