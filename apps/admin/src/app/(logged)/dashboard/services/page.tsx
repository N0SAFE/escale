'use client'

import * as React from 'react'
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

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
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { createService, deleteService, getServices } from './actions'
import {
    CreateService as CreateServiceType,
    Image as ImageType,
    Service,
} from '@/types/index'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/loader'
import Link from 'next/link'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'
import Combobox from '@/components/Combobox'
import { Label } from '@/components/ui/label'
import { getImages } from '../actions'
import ApiImage from '@/components/ApiImage'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

const columns: ColumnDef<Service>[] = [
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
        accessorKey: 'label',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Label
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('label')}</div>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue('description')}</div>
        ),
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => (
            <ApiImage
                identifier={row.original.image?.id!}
                width={50}
                height={50}
                alt={row.getValue<ImageType>('image')?.alt}
            />
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        header: 'Actions',
        cell: ({ row, table }) => {
            const service = row.original

            const { setSelectedServiceToDelete } = table.options.meta as {
                setSelectedServiceToDelete: (service: Service) => void
            }

            return (
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
                            <Link
                                className="w-full"
                                href={`/dashboard/services/${service.id}`}
                            >
                                Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link
                                className="w-full"
                                href={`/dashboard/services/${service.id}/edit`}
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <AlertDialogTrigger
                            asChild
                            className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        >
                            <DropdownMenuItem
                                onClick={() =>
                                    setSelectedServiceToDelete(service)
                                }
                            >
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function ServicesTable() {
    const { data, error, isFetched, refetch } = useQuery({
        queryKey: ['services'],
        queryFn: async () => getServices(),
    })
    const serviceCreateMutation = useMutation({
        mutationFn: async (service?: CreateServiceType) => {
            return await createService(service!)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('service created')
            setOpen(false)
            await refetch()
        },
    })
    const serviceDeleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await deleteService(id)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('service deleted')
            setIsDeleteDialogOpen(false)
            await refetch()
        },
    })
    const [open, setOpen] = React.useState(false)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedServiceToDelete, setSelectedServiceToDelete] =
        React.useState<Service>()
    const [isDeletDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    console.log({ data, error, isFetched })

    const table = useReactTable({
        data: data ?? [],
        columns,
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
        },
        meta: {
            setSelectedServiceToDelete,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Filter services..."
                    value={
                        (table
                            .getColumn('label')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('label')
                            ?.setFilterValue(event.target.value)
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
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">+</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>Create service</DialogTitle>
                                <DialogDescription>
                                    create a new service and add it to the list
                                </DialogDescription>
                            </DialogHeader>
                            <CreateService
                                onSubmit={serviceCreateMutation.mutate}
                                isLoading={serviceCreateMutation.isPending}
                            />
                        </DialogContent>
                    </Dialog>
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
                            open={isDeletDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                        >
                            {isFetched ? (
                                table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
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
                                            <span className="flex items-center justify-center">
                                                no services found
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
                                            <Loader></Loader>
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                            <AlertDialogContent>
                                <DeleteService
                                    onDelete={() =>
                                        serviceDeleteMutation.mutate(
                                            selectedServiceToDelete?.id!
                                        )
                                    }
                                    isLoading={serviceDeleteMutation.isPending}
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

type DeleteServiceProps = {
    isLoading?: boolean
    onDelete?: () => void
    onCancel?: () => void
}

function DeleteService({ isLoading, onDelete, onCancel }: DeleteServiceProps) {
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

type CreateSpaProps = {
    isLoading?: boolean
    onSubmit?: (data?: CreateServiceType) => void
}

function CreateService({ isLoading, onSubmit }: CreateSpaProps) {
    const { data: images, isFetched: isImagesFetched } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })
    const fileSelectItems = React.useMemo(
        () =>
            images?.map((image) => {
                return {
                    label: image.file.name,
                    value: image,
                }
            }),
        [images]
    )

    const [serviceState, setServiceState] = React.useState<CreateServiceType>({
        label: '',
        description: '',
        image: null,
    })
    console.log(isLoading)
    return (
        <div>
            <div className="grid gap-4 py-4  w-full">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Label
                    </Label>
                    <Input
                        id="label"
                        value={serviceState.label}
                        className="col-span-3"
                        onChange={(e) =>
                            setServiceState({
                                ...serviceState,
                                label: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        description
                    </Label>
                    <Input
                        id="description"
                        value={serviceState.description}
                        className="col-span-3"
                        onChange={(e) =>
                            setServiceState({
                                ...serviceState,
                                description: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                        image
                    </Label>
                    <Combobox
                        onRender={(image) => (
                            <div>
                                <ApiImage
                                    identifier={image.id}
                                    width={50}
                                    height={50}
                                    alt={'test'}
                                />
                            </div>
                        )}
                        className="col-span-3"
                        items={fileSelectItems || []}
                        isLoading={!isImagesFetched}
                        defaultPreviewText="Select an image..."
                        value={serviceState?.image || undefined}
                        onSelect={(image) =>
                            setServiceState({
                                ...serviceState!,
                                image: image
                                    ? images?.find((i) => image.id === i.id)!
                                    : null,
                            })
                        }
                    />
                </div>
            </div>
            <DialogFooter>
                <Button
                    className="relative"
                    onClick={() => onSubmit?.(serviceState)}
                    disabled={isLoading}
                >
                    <span className={isLoading ? 'invisible' : 'visible'}>
                        Save change
                    </span>
                    {isLoading ? (
                        <div className="flex items-center justify-center absolute">
                            <Loader size={'4'} />
                        </div>
                    ) : (
                        ''
                    )}
                </Button>
            </DialogFooter>
        </div>
    )
}
