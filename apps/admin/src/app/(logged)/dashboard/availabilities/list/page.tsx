'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Availability, Spa, UpdateAvailability } from '@/types/index'
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
} from '@tanstack/react-table'
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import React from 'react'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import {
    deleteAvailability,
    getAvailabilities,
    getClosestAvailabilities,
    updateAvailability,
} from '../actions'
import { toast } from 'sonner'
import { DateTime } from 'luxon'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import AvailabilityEdit from '@/components/atomics/templates/AvailabillityEdit'
import Loader from '@/components/atomics/atoms/Loader'
import { useAvailabilityContext } from '../layout'

const columns: ColumnDef<Availability>[] = [
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
        header: 'Start at',
        cell: ({ row }) => (
            <div className="capitalize">{row.original.startAt}</div>
        ),
    },
    {
        accessorKey: 'endAt',
        header: 'End at',
        cell: ({ row }) => (
            <div className="capitalize">{row.original.endAt}</div>
        ),
    },
    {
        accessorKey: 'spa',
        header: 'Spa',
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
        header: () => <div className="text-right">actions</div>,
        cell: ({ row, table }) => {
            const availability = row.original

            const { setSelectedAvailabilityToDelete } = table.options.meta as {
                setSelectedAvailabilityToDelete: (image: Availability) => void
            }
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
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
                                <SheetTrigger className="w-full text-left">
                                    Edit
                                </SheetTrigger>
                            </DropdownMenuItem>
                            <AlertDialogTrigger
                                asChild
                                className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                            >
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSelectedAvailabilityToDelete(
                                            availability
                                        )
                                    }
                                >
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

type ListViewProps = {}

export default function AvailabilityListView({}: ListViewProps) {
    const { spas } = useAvailabilityContext()
    const availabilityUpdateMutation = useMutation({
        mutationFn: async ({
            id,
            availability,
        }: {
            id: number
            availability: UpdateAvailability
        }) => {
            if (!availability) {
                return
            }
            return await updateAvailability(id, availability)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability updated')
            await refetch()
        },
    })
    const availabilityDeleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await deleteAvailability(id)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability deleted')
            setSheetIsOpen(false)
            // setIsDeleteDialogOpen(false)
            await refetch()
        },
    })
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [sheetIsOpen, setSheetIsOpen] = React.useState<false | number>(false)
    const [updatedAvailability, setUpdatedAvailability] = React.useState<{
        id: number
        availability: UpdateAvailability
    }>()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedAvailabilityToDelete, setSelectedAvailabilityToDelete] =
        React.useState<Availability>()

    const {
        data: availabilities,
        error,
        isFetched,
        refetch,
    } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: ['availabilities'],
        queryFn: async () =>
            await getAvailabilities({
                groups: ['availabilities:spa'],
            }),
    })

    const table = useReactTable({
        data: availabilities ?? [],
        columns,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, value, addMeta) => {
            value = value.toLowerCase()
            // check if the value is YYYY-MM-DD
            if (!value.match(/\d{4}-\d{2}-\d{2}/)) {
                return true
            }

            const dateTime = DateTime.fromISO(value)
            const startAtDateTime = DateTime.fromISO(row.original.startAt)
            const endAtDateTime = DateTime.fromISO(row.original.endAt)

            if (!dateTime.isValid) {
                return true
            }
            if (dateTime < startAtDateTime || dateTime > endAtDateTime) {
                return false
            }
            return true
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        meta: {
            setSelectedAvailabilityToDelete,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Filter availabilities..."
                    value={globalFilter ?? ''}
                    onChange={(event) =>
                        setGlobalFilter(String(event.target.value))
                    }
                    className="max-w-sm"
                />
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns{' '}
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
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
                        <AlertDialog
                            open={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                        >
                            {isFetched ? (
                                table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <Sheet
                                            key={row.id}
                                            open={
                                                sheetIsOpen === row.original.id
                                            }
                                            onOpenChange={() =>
                                                setSheetIsOpen(
                                                    sheetIsOpen ===
                                                        row.original.id
                                                        ? false
                                                        : row.original.id
                                                )
                                            }
                                        >
                                            <TableRow
                                                data-state={
                                                    row.getIsSelected() &&
                                                    'selected'
                                                }
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                            <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] h-screen flex flex-col justify-between">
                                                <div>
                                                    <SheetHeader>
                                                        <SheetTitle>
                                                            Edit profile{' '}
                                                            {row.original?.id}
                                                        </SheetTitle>
                                                        <SheetDescription>
                                                            Make changes to your
                                                            profile here. Click
                                                            save when
                                                            you&apos;re done.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <AvailabilityEdit
                                                        spas={spas?.data}
                                                        isSpaLoading={
                                                            spas.isLoading
                                                        }
                                                        selectedSpa={
                                                            updatedAvailability
                                                                ?.availability
                                                                ?.spa
                                                                ? spas?.data?.find(
                                                                      (s) =>
                                                                          s.id ===
                                                                          updatedAvailability
                                                                              ?.availability
                                                                              ?.spa
                                                                  )
                                                                : undefined
                                                        }
                                                        getClostestAvailabilities={async (
                                                            date: string
                                                        ) =>
                                                            (
                                                                await getClosestAvailabilities(
                                                                    date
                                                                )
                                                            )?.data!
                                                        }
                                                        defaultValues={
                                                            row.original
                                                        }
                                                        onChange={(data) => {
                                                            setUpdatedAvailability(
                                                                {
                                                                    id: data.id!,
                                                                    availability:
                                                                        data.availability,
                                                                }
                                                            )
                                                        }}
                                                    />
                                                </div>
                                                <SheetFooter className="flex sm:justify-between gap-4">
                                                    <Button
                                                        onClick={() => {
                                                            availabilityDeleteMutation.mutate(
                                                                updatedAvailability?.id!
                                                            )
                                                        }}
                                                        variant={'destructive'}
                                                    >
                                                        {availabilityDeleteMutation.isPending ? (
                                                            <div className="relative">
                                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                                    <Loader size="4" />
                                                                </div>
                                                                <span className="invisible">
                                                                    Delete
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            'Delete'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            availabilityUpdateMutation.mutate(
                                                                updatedAvailability!
                                                            )
                                                        }}
                                                        className="relative"
                                                    >
                                                        {availabilityUpdateMutation.isPending ? (
                                                            <div className="relative">
                                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                                    <Loader size="4" />
                                                                </div>
                                                                <span className="invisible">
                                                                    Save change
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            'Save change'
                                                        )}
                                                    </Button>
                                                </SheetFooter>
                                            </SheetContent>
                                        </Sheet>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            <span className="flex items-center justify-center">
                                                <span>
                                                    no availability found
                                                </span>
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
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
                            )}
                            <AlertDialogContent>
                                <DeleteImage
                                    onDelete={() =>
                                        availabilityDeleteMutation.mutate(
                                            selectedAvailabilityToDelete?.id!
                                        )
                                    }
                                    isLoading={
                                        availabilityDeleteMutation.isPending
                                    }
                                    onCancel={() =>
                                        setIsDeleteDialogOpen(false)
                                    }
                                />
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

type DeleteImageProps = {
    isLoading?: boolean
    onDelete?: () => void
    onCancel?: () => void
}

function DeleteImage({ isLoading, onDelete, onCancel }: DeleteImageProps) {
    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the image and remove the data associated from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <Button variant={'outline'} onClick={onCancel}>
                    Cancel
                </Button>
                <Button disabled={isLoading} onClick={onDelete}>
                    <span className={isLoading ? 'invisible' : 'visible'}>
                        Continue
                    </span>
                    {isLoading ? (
                        <div className="flex items-center justify-center absolute">
                            <Loader size={'4'} />
                        </div>
                    ) : (
                        ''
                    )}
                </Button>
            </AlertDialogFooter>
        </>
    )
}
