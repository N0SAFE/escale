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
    Row,
    SortingState,
    Table,
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
import React, { MouseEventHandler } from 'react'
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
import AvailabilityEdit from '@/components/atomics/templates/Edit/AvailabillityEdit'
import Loader from '@/components/atomics/atoms/Loader'
import { useAvailabilityContext } from '../layout'
import { DataTable } from '@/components/atomics/organisms/DataTable'
import { useColumns, ColumnOptions } from './columns'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { availabilitiesAccessor, DType } from './utils'
import ProgressBar from '@/components/atomics/atoms/ProgressBar'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'

type ListViewProps = {}

export default function AvailabilityListView({}: ListViewProps) {
    const { spas } = useAvailabilityContext()
    const availabilityUpdateMutation = useMutation({
        mutationFn: async ({
            id,
            availability,
        }: {
            id: number
            availability: DType
        }) => {
            if (!availability) {
                return
            }
            return await updateAvailability(id, {
                startAt: availability.startAt,
                endAt: availability.endAt,
                spa: availability.spa.id,
                monPrice: availability.monPrice,
                tuePrice: availability.tuePrice,
                wedPrice: availability.wedPrice,
                thuPrice: availability.thuPrice,
                friPrice: availability.friPrice,
                satPrice: availability.satPrice,
                sunPrice: availability.sunPrice,
            })
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability updated')
            tableRef.current?.resetRowSelection()
            await refetch()
        },
    })
    const availabilityDeleteMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            let count = 0
            setDeleteContext({
                numberOfSelectedRows: deleteContext?.numberOfSelectedRows!,
                numberOfDeletedRows: 0,
            })
            await Promise.all(
                ids.map(async (i) => {
                    await deleteAvailability(i)
                    count++
                    setDeleteContext({
                        numberOfSelectedRows:
                            deleteContext?.numberOfSelectedRows!,
                        numberOfDeletedRows: count,
                    })
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability deleted')
            tableRef.current?.resetRowSelection()
            await refetch()
        },
    })

    const {
        data: availabilities,
        error,
        isFetched,
        refetch,
    } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: ['availabilities'],
        queryFn: async () => await availabilitiesAccessor(),
    })

    const tableRef = React.useRef<Table<DType>>(null)

    const [updatedAvailability, setUpdatedAvailability] =
        React.useState<DType>()
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
                    tableRef={tableRef}
                    columns={columns}
                    data={availabilities ?? []}
                >
                    <div className="flex justify-end">
                        <div className="flex gap-2">
                            <DataTableViewOptions className="h-full" />
                        </div>
                    </div>
                    <DataTable
                        isLoading={!isFetched}
                        notFound="no spas found"
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
                            <AvailabilityEdit
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
                            />
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
                                    await availabilityUpdateMutation.mutateAsync(
                                        {
                                            id: updatedAvailability?.id!,
                                            availability: updatedAvailability!,
                                        }
                                    )
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
                                await availabilityDeleteMutation.mutateAsync(
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
    onDelete?: MouseEventHandler<HTMLButtonElement>
    onCancel?: MouseEventHandler<HTMLButtonElement>
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
                    label="users"
                />
            )}
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
