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
import React, { useMemo } from 'react'
import {
    LoggedDashboardSpasId,
    LoggedDashboardSpasIdEdit,
} from '@/routes/index'
import { DType } from './type'

type Promised<T> = T | Promise<T>

type ColumnOptions = {
    onRowDelete?: (props: Row<DType>) => Promised<void>
    useLoaderOnRowDelete?: boolean
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
                            if (options?.useLoaderOnRowDelete) {
                                setIsLoading(true)
                            }
                            Promise.all(
                                rows.map((row) => options?.onRowDelete?.(row))
                            )
                            setActionsDropdownIsOpen(false)
                            if (options?.useLoaderOnRowDelete) {
                                setIsLoading(false)
                            }
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
    const spa = row.original

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
                    <DropdownMenuItem>
                        <LoggedDashboardSpasId.Link
                            spaId={spa.id.toString()}
                            className="w-full"
                        >
                            Details
                        </LoggedDashboardSpasId.Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LoggedDashboardSpasIdEdit.Link
                            spaId={spa.id.toString()}
                            className="w-full"
                        >
                            Edit
                        </LoggedDashboardSpasIdEdit.Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        onClick={async (e) => {
                            e.preventDefault()
                            if (options?.useLoaderOnRowDelete) {
                                setIsLoading(true)
                            }
                            await options?.onRowDelete?.(row)
                            setActionsDropdownIsOpen(false)
                            if (options?.useLoaderOnRowDelete) {
                                setIsLoading(false)
                            }
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
