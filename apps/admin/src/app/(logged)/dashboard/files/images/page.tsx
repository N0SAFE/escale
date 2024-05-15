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
    Table,
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
import { createImage, deleteImage, getImages } from './actions'
import {
    CreateImage as CreateImageType,
    Image as ImageType,
} from '@/types/index'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
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
import Image from 'next/image'
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
import { Label } from '@/components/ui/label'
import FileInput from '@/components/atomics/atoms/FileInput'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { ColumnOptions, useColumns } from './columns'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import { DataTable } from '@/components/atomics/organisms/DataTable'
import { imagesAccessor, DType } from './utils'
import { Progress } from '@/components/ui/progress'
import ProgressBar from '@/components/atomics/atoms/ProgressBar'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'

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

const columns: ColumnDef<ImageType>[] = [
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
        header: 'Image',
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
        header: ({ column, table }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.original.file.name}</div>
        ),
    },
    {
        accessorKey: 'size',
        header: 'Size',
        cell: ({ row }) => (
            <div className="lowercase">{fromBytes(row.original.file.size)}</div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        header: 'Actions',
        cell: ({ row, table }) => {
            const spa = row.original

            const { setSelectedImageToDelete } = table.options.meta as {
                setSelectedImageToDelete: (image: ImageType) => void
            }

            return (
                <>
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
                                    href={`/dashboard/images/${spa.id}`}
                                >
                                    Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link
                                    className="w-full"
                                    href={`/dashboard/images/${spa.id}/edit`}
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
                                        setSelectedImageToDelete(spa)
                                    }
                                >
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]

export default function ServicesTable() {
    const {
        data: images,
        error,
        isFetched,
        refetch,
    } = useQuery({
        queryKey: ['images'],
        queryFn: async () => imagesAccessor(),
    })
    const imageCreateMutation = useMutation({
        mutationFn: async (service?: CreateImageType) => {
            const formData = new FormData()
            formData.append('alt', service?.alt!)
            formData.append('image', service?.file!)
            return await createImage(formData!)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('image created')
            tableRef.current?.resetRowSelection()
            await refetch()
        },
    })
    const imageDeleteMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            let count = 0
            setDeleteContext({
                numberOfSelectedRows: ids.length,
                numberOfDeletedRows: 0,
            })
            await Promise.all(
                ids.map(async (i) => {
                    await deleteImage(i)
                    count++
                    setDeleteContext({
                        numberOfSelectedRows: ids.length,
                        numberOfDeletedRows: count,
                    })
                })
            )
            setIsDeleteDialogOpen(false)
            setIsEditSheetOpen(false)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('image deleted')
            tableRef.current?.resetRowSelection()
            setIsDeleteDialogOpen(false)
            setIsEditSheetOpen(false)
            await refetch()
        },
    })

    const tableRef = React.useRef<Table<DType>>(null)

    const [deleteContext, setDeleteContext] = React.useState<{
        numberOfSelectedRows: number
        numberOfDeletedRows: number
    }>()
    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false)
    const [selectedAvailabilities, setSelectedAvailabilities] =
        React.useState<DType[]>()

    const columnsOptions: ColumnOptions = {
        onRowDelete: async (availability) => {
            setSelectedAvailabilities([availability])
            setIsDeleteDialogOpen(true)
        },
        onMultipleRowDelete: async (availabilities) => {
            setSelectedAvailabilities(availabilities)
            setIsDeleteDialogOpen(true)
        },
        onRowEdit: async (availability) => {
            setSelectedAvailabilities([availability])
            setIsEditSheetOpen(true)
        },
    }

    const columns = useColumns(columnsOptions)

    return (
        <div className="w-full h-full overflow-hidden">
            <div className="flex flex-col gap-4 h-full">
                <DataTableProvider
                    columns={columns}
                    data={images ?? []}
                    tableRef={tableRef}
                >
                    <div className="flex justify-end">
                        <div className="flex gap-2">
                            <DataTableViewOptions className="h-full" />
                        </div>
                    </div>
                    <DataTable
                        isLoading={!isFetched}
                        notFound="no images found"
                    />
                    <DataTablePagination />
                </DataTableProvider>
                <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                    <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] flex flex-col justify-between">
                        <div className="overflow-auto scrollbar-none">
                            <SheetHeader>
                                <SheetTitle>
                                    Edit profile{' '}
                                    {selectedAvailabilities?.[0]?.id}
                                </SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click
                                    save when you&apos;re done.
                                </SheetDescription>
                            </SheetHeader>
                            {/* <AvailabilityEdit
                                spas={spas.data}
                                isSpaLoading={spas.isLoading}
                                selectedSpa={
                                    selectedAvailabilities?.[0]?.spa
                                        ? spas?.data?.find(
                                              (s) =>
                                                  s.id ===
                                                  selectedAvailabilities?.[0]
                                                      ?.spa?.id
                                          )
                                        : undefined
                                }
                                getClostestAvailabilities={async (
                                    date: string
                                ) =>
                                    (await getClosestAvailabilities(date))
                                        ?.data!
                                }
                                defaultValues={selectedAvailabilities?.[0]!}
                                onChange={(data) => {
                                    setUpdatedAvailability(data)
                                }}
                            /> */}
                        </div>
                        <SheetFooter className="flex sm:justify-between gap-4">
                            <Button
                                onClick={async (e) => {
                                    e.preventDefault()
                                    setIsDeleting(true)
                                    await columnsOptions?.onRowDelete?.(
                                        selectedAvailabilities?.[0]!
                                    )
                                    setIsDeleting(false)
                                }}
                                variant={'destructive'}
                            >
                                {isDeleting ? (
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
                                onClick={async (e) => {
                                    e.preventDefault()
                                    setIsEditing(true)
                                    // await availabilityUpdateMutation.mutateAsync(
                                    //     {
                                    //         id: updatedAvailability?.id!,
                                    //         availability: updatedAvailability!,
                                    //     }
                                    // )
                                    setIsEditing(false)
                                }}
                                className="relative"
                            >
                                {isEditing ? (
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
                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <DeleteImage
                            onDelete={async (e) => {
                                e.preventDefault()
                                setIsDeleting(true)
                                await imageDeleteMutation.mutateAsync(
                                    selectedAvailabilities?.map((a) => a.id) ??
                                        []
                                )
                                setIsDeleting(false)
                            }}
                            isLoading={isDeleting}
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            deleteContext={deleteContext}
                        />
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

type DeleteImageProps = {
    isLoading?: boolean
    onDelete?: React.MouseEventHandler<HTMLButtonElement>
    onCancel?: React.MouseEventHandler<HTMLButtonElement>
    deleteContext?: {
        numberOfSelectedRows: number
        numberOfDeletedRows: number
    }
}

function DeleteImage({
    isLoading,
    onDelete,
    onCancel,
    deleteContext,
}: DeleteImageProps) {
    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the image and remove the data associated from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            {isLoading && deleteContext && (
                <ProgressBar
                    out={deleteContext.numberOfDeletedRows}
                    of={deleteContext.numberOfSelectedRows}
                    label="images"
                />
            )}
            <AlertDialogFooter>
                <Button
                    variant={'outline'}
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button disabled={isLoading} onClick={onDelete}>
                    <span className={isLoading ? 'invisible' : 'visible'}>
                        Continue
                    </span>
                    {isLoading && (
                        <div className="flex items-center justify-center absolute">
                            <Loader size={'4'} />
                        </div>
                    )}
                </Button>
            </AlertDialogFooter>
        </>
    )
}

type CreateImageProps = {
    isLoading?: boolean
    onSubmit?: (data?: CreateImageType) => void
}

function CreateImage({ isLoading, onSubmit }: CreateImageProps) {
    const { data: images, isFetched: isImagesFetched } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })

    const [imageState, setImageState] = React.useState<CreateImageType>({
        alt: '',
    })
    return (
        <div>
            <div className="grid gap-4 py-4  w-full">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alt" className="text-right">
                        alt
                    </Label>
                    <Input
                        id="alt"
                        value={imageState.alt}
                        className="col-span-3"
                        onChange={(e) =>
                            setImageState({
                                ...imageState,
                                alt: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right">
                        file
                    </Label>
                    <FileInput
                        onUpload={(files) =>
                            setImageState({
                                ...imageState,
                                file: files?.[0]!,
                                name: imageState.name
                                    ? imageState.name
                                    : files?.[0]
                                    ? files?.[0].name
                                    : imageState.name,
                            })
                        }
                        className="col-span-3 w-full"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        name
                    </Label>
                    <Input
                        id="name"
                        value={imageState.name}
                        className="col-span-3"
                        onChange={(e) =>
                            setImageState({
                                ...imageState,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
            </div>
            <DialogFooter>
                <Button
                    className="relative"
                    onClick={() => onSubmit?.(imageState)}
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
