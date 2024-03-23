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
import { createSpa, deleteSpa, getSpas } from './actions'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/loader'
import Link from 'next/link'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    CreateSpa as CreateSpaType,
    Spa,
    SpaImage as SpaImageType,
} from '@/types/index'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Combobox from '@/components/Combobox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Reorder } from 'framer-motion'
import { getImages, getServices } from '../actions'
import ApiImage from '@/components/ApiImage'
import { Card } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

const columns: ColumnDef<Spa>[] = [
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
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Title
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('title')}</div>
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
        id: 'actions',
        enableHiding: false,
        header: 'Actions',
        cell: ({ row, table, ...rest }) => {
            const spa = row.original

            const { setSelectedSpaToDelete } = table.options.meta as {
                setSelectedSpaToDelete: (spa: Spa) => void
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
                                href={`/dashboard/spas/${spa.id}`}
                            >
                                Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link
                                className="w-full"
                                href={`/dashboard/spas/${spa.id}/edit`}
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <AlertDialogTrigger
                            asChild
                            className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        >
                            <DropdownMenuItem
                                onClick={() => setSelectedSpaToDelete(spa)}
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

export default function SpasTable() {
    const {
        data: spas,
        error,
        isFetched,
        refetch,
    } = useQuery({
        queryKey: ['spas'],
        queryFn: async () => getSpas(),
    })
    const spaCreateMutation = useMutation({
        mutationFn: async (spa?: CreateSpaType) => {
            return await createSpa(spa!)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('spa created')
            setOpen(false)
            await refetch()
        },
    })
    const spaDeleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await deleteSpa(id)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('spa deleted')
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
    const [selectedSpaToDelete, setSelectedSpaToDelete] = React.useState<Spa>()
    const [isDeletDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const table = useReactTable({
        data: spas ?? [],
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
            setSelectedSpaToDelete,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Filter spas..."
                    value={
                        (table
                            .getColumn('title')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('title')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
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
                                <DialogTitle>Create spa</DialogTitle>
                                <DialogDescription>
                                    create a new spa and add it to the list
                                </DialogDescription>
                            </DialogHeader>
                            <CreateSpa
                                onSubmit={spaCreateMutation.mutate}
                                isLoading={spaCreateMutation.isPending}
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
                                                no spas found
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
                                <DeleteSpa
                                    onDelete={() =>
                                        spaDeleteMutation.mutate(
                                            selectedSpaToDelete?.id!
                                        )
                                    }
                                    isLoading={spaDeleteMutation.isPending}
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

function DeleteSpa({ isLoading, onDelete, onCancel }: DeleteImageProps) {
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

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false })

type CreateSpaProps = {
    isLoading?: boolean
    onSubmit?: (data?: CreateSpaType) => void
}

function CreateSpa({ isLoading, onSubmit }: CreateSpaProps) {
    const { data: images, isFetched: isImagesFetched } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })
    const { data: services, isFetched: isServicesFetched } = useQuery({
        queryKey: ['services'],
        queryFn: async () => getServices(),
    })
    const fileSelectItems = React.useMemo(
        () =>
            images?.map((image) => {
                return {
                    component: (
                        <span>
                            <ApiImage
                                identifier={image.id}
                                width={50}
                                height={50}
                                alt={'test'}
                            />
                        </span>
                    ),
                    label: image.file.name,
                    value: image.id,
                }
            }),
        [images]
    )
    const serviceSelectItems = React.useMemo(
        () =>
            services?.map((service) => {
                return {
                    label: service.label,
                    value: service.id,
                }
            }),
        [services]
    )
    const onImageSelect = (ids: number[]) => {
        let maxOrder = Math.max(
            0,
            ...(spaState?.spaImages?.map((i) => i.order) || [])
        )
        const newSpaImages = ids.map((id, index) => {
            const exist = spaState?.spaImages?.find((i) => i.image.id === id)
            if (exist) {
                return exist
            }
            maxOrder++
            return {
                order: maxOrder,
                image: images?.find((i) => i.id === id)!,
            } as SpaImageType
        })

        setSpaState({ ...spaState!, spaImages: newSpaImages })
    }

    const handleReorder = function (spaImages: SpaImageType[]) {
        const newSpaImages = spaImages.map((item, index) => {
            item.order = index + 1
            return item
        })
        setSpaState({ ...spaState!, spaImages: newSpaImages })
    }
    const [spaState, setSpaState] = React.useState<CreateSpaType>({
        title: '',
        description: '',
        location: '',
        googleMapsLink: '',
        spaImages: [],
        services: [],
    })
    console.log(isLoading)
    return (
        <div>
            <div className="grid gap-4 grid-cols-2">
                <div className="grid gap-4 py-4  w-full">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={spaState.title}
                            className="col-span-3"
                            onChange={(e) =>
                                setSpaState({
                                    ...spaState,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            location
                        </Label>
                        <Input
                            id="location"
                            value={spaState.location}
                            className="col-span-3"
                            onChange={(e) =>
                                setSpaState({
                                    ...spaState,
                                    location: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="google_maps_link"
                            className="text-right"
                        >
                            google maps link
                        </Label>
                        <Input
                            id="google_maps_link"
                            value={spaState.googleMapsLink}
                            className="col-span-3"
                            onChange={(e) =>
                                setSpaState({
                                    ...spaState,
                                    googleMapsLink: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Select images
                        </Label>
                        <div className="w-full col-span-3 border rounded-md p-4">
                            <Combobox
                                className="w-full"
                                multiple
                                items={images?.map((image) => {
                                    return {
                                        label: image.file.name,
                                        value: image,
                                    }
                                })}
                                isLoading={!isImagesFetched}
                                defaultPreviewText="Select an image..."
                                defaultSearchText="Search for an image..."
                                value={spaState?.spaImages?.map((i) => i.image)}
                                onSelect={(images) =>
                                    onImageSelect(
                                        images.map(function (i) {
                                            return i.id
                                        })
                                    )
                                }
                                keepOpen
                                onRender={(val) => {
                                    return (
                                        <span>
                                            <ApiImage
                                                identifier={val.id}
                                                width={50}
                                                height={50}
                                                alt={'test'}
                                            />
                                        </span>
                                    )
                                }}
                            />
                            <ScrollArea className="h-96">
                                <Reorder.Group
                                    axis="y"
                                    values={spaState?.spaImages || []}
                                    onReorder={handleReorder}
                                    layoutScroll
                                >
                                    {spaState?.spaImages?.map((item, index) => (
                                        <Reorder.Item
                                            value={item}
                                            key={item.id}
                                        >
                                            <div
                                                data-id={index}
                                                style={{ cursor: 'grab' }}
                                            >
                                                <Card className="flex items-center justify-between w-full p-4">
                                                    <div className="flex items-center gap-4">
                                                        <ApiImage
                                                            identifier={
                                                                item.image.id
                                                            }
                                                            width={50}
                                                            height={50}
                                                            alt={
                                                                item.image.file
                                                                    .name
                                                            }
                                                        />
                                                        <span className="overflow-hidden text-ellipsis">
                                                            {
                                                                item.image.file
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </Card>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="w-full items-center gap-1.5">
                        <Label htmlFor="description">Description</Label>
                        <div className="overflow-y-auto max-h-96">
                            <Editor
                                onReady={(editor) => {
                                    console.log('ready')
                                    // setIsLoading(false);
                                }}
                                data={spaState?.description}
                                onChange={(event, editor) => {
                                    setSpaState({
                                        ...spaState,
                                        description: editor.getData(),
                                    })
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="location">Services</Label>
                        <Combobox
                            multiple
                            items={services?.map((service) => {
                                return {
                                    label: service.label,
                                    value: service,
                                }
                            })}
                            isLoading={!isServicesFetched}
                            defaultPreviewText="Select an sercice..."
                            defaultSearchText="Search for a sercice..."
                            value={spaState?.services}
                            onSelect={(sers) =>
                                setSpaState({
                                    ...spaState,
                                    services: sers.map(
                                        (service) =>
                                            services?.find(
                                                (subs) => subs.id === service.id
                                            )!
                                    ),
                                })
                            }
                            keepOpen
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button
                    className="relative"
                    onClick={() => onSubmit?.(spaState)}
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
