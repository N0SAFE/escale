import { DataTableColumnHeader } from '@/components/atomics/organisms/DataTable/DataTableColumnHeader'
import Loader from '@/components/atomics/atoms/Loader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { CellContext, ColumnDef, Row } from '@tanstack/react-table'
import Link from 'next/link'
import React, { MouseEventHandler, useMemo } from 'react'
import {
    LoggedDashboardSpasId,
    LoggedDashboardSpasIdEdit,
} from '@/routes/index'
import { DType } from './utils'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import AvailabilityEdit from '@/components/atomics/templates/Edit/AvailabillityEdit'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { availabilitiesAccessor } from './utils'
import { useAvailabilityContext } from '../layout'
import { getClosestAvailabilities } from '../actions'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Promised<T> = T | Promise<T>

export type ColumnOptions = {
    onRowDelete?: (row: DType) => Promised<void>
    onRowEdit?: (row: DType) => Promised<void>
    onMultipleRowDelete?: (props: DType[]) => Promised<void>
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

type ActionsCellHeaderProps = {
    rows: Row<DType>[]
    options?: ColumnOptions
}

const ActionsCellHeader = ({ rows, options }: ActionsCellHeaderProps) => {
    const spas = rows.map((row) => row.original)

    const [isLoading, setIsLoading] = React.useState(false)
    const [actionsDropdownIsOpen, setActionsDropdownIsOpen] =
        React.useState(false)

    return (
        <div className="flex justify-end">
            <DropdownMenu
                open={actionsDropdownIsOpen}
                onOpenChange={setActionsDropdownIsOpen}
            >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        onClick={async (e) => {
                            e.preventDefault()
                            options?.onMultipleRowDelete?.(
                                rows.map((row) => row.original)
                            )
                            setActionsDropdownIsOpen(false)
                        }}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center w-full">
                                <Loader size="4" />
                            </div>
                        ) : (
                            'Delete'
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
type ActionsCellRowProps = {
    row: Row<DType>
    options?: ColumnOptions
}
const ActionsCellRow = ({ row, options }: ActionsCellRowProps) => {
    const availability = row.original

    const [actionsDropdownIsOpen, setActionsDropdownIsOpen] =
        React.useState(false)

    return (
        <div className="flex justify-end">
            <DropdownMenu
                open={actionsDropdownIsOpen}
                onOpenChange={setActionsDropdownIsOpen}
            >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LoggedDashboardSpasId.Link
                            spaId={availability.id.toString()}
                            className="w-full"
                        >
                            Details
                        </LoggedDashboardSpasId.Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={async (e) => {
                            options?.onRowEdit?.(row.original)
                        }}
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        onClick={async (e) => {
                            options?.onRowDelete?.(row.original)
                        }}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
