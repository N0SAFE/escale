import { DataTableColumnHeader } from '@/components/atomics/organisms/DataTable/DataTableColumnHeader'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { DType } from './utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createAttachmentUrl } from '@/hooks/useAttachmentUrl'
import { ActionsCellRow } from '@/components/atomics/organisms/DataTable/ActionsCellRow'
import { ActionsCellHeader } from '@/components/atomics/organisms/DataTable/ActionsCellHeader'
import { Promisable } from '@/types/utils'

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
            accessorKey: 'avatar',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Avatar" />
            },
            cell: ({ row }) => {
                return (
                    <Avatar>
                        <AvatarImage
                            src={
                                createAttachmentUrl(row.original?.avatar?.path)!
                            }
                        />
                        <AvatarFallback>
                            {row.original.username
                                ?.split(' ')
                                .map((w) => w?.[0])
                                .filter((c) => !!c)
                                .join('')
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )
            },
        },
        {
            accessorKey: 'email',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Email" />
            },
            cell: ({ row }) => <div>{row.original.email}</div>,
        },
        {
            accessorKey: 'roles',
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Roles" />
            },
            cell: ({ row }) => (
                <div className="lowercase">
                    {row.original.roles?.map((r) => {
                        return (
                            <Badge key={r.label} variant="outline">
                                {r.label}
                            </Badge>
                        )
                    })}
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
