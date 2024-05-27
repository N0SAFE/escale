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
import {
    CreateReservation as CreateReservationType,
    Reservation,
    UpdateReservation,
} from '@/types/model/Reservation'
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
import { ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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
    deleteReservation,
    getReservations,
    getClosestReservations,
    updateReservation,
    createReservation,
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
import Loader from '@/components/atomics/atoms/Loader'
import { DType, reservationsAccessor, spaAccessor } from '../utils'
import { ColumnOptions, useColumns } from './columns'
import useTableHooks from '@/hooks/useTableHooks'
import useTableRef from '@/hooks/useTableRef'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'
import { DataTable } from '@/components/atomics/organisms/DataTable/index'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import ViewSheet from '@/components/atomics/templates/ViewSheet'
import EditSheet from '@/components/atomics/templates/EditSheet'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import ViewReservation from '@/components/atomics/templates/View/ViewReservation'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import EditReservation from '@/components/atomics/templates/Edit/EditReservation'
import CreateReservation from '@/components/atomics/templates/Create/CreateReservation'

export default function AvailabilityListView() {
    const {
        data: spas,
        isFetched: isSpaFetched,
        isError,
    } = useQuery({
        queryKey: ['spas'],
        queryFn: async () => {
            return await spaAccessor()
        },
    })
    const {
        data: reservations,
        error,
        isFetched,
        refetch,
    } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: ['reservations'],
        queryFn: async () => await reservationsAccessor(),
    })
    const reservationEditMutation = useMutation({
        mutationFn: async ({
            updatedReservation,
            id,
        }: {
            updatedReservation: UpdateReservation
            id: number
        }) => {
            return await updateReservation(id, updatedReservation)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('Reservation updated')
            await refetch()
        },
    })
    const reservationDeleteMutation = useMutation({
        mutationFn: async (reservations: Reservation[]) => {
            await Promise.all(
                reservations.map(async (r) => {
                    await deleteReservation(r.id)
                    incrementDeleteContext()
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('reservation deleted')
            tableRef.current?.resetRowSelection()
            setIsDeleteDialogOpen(false)
            setIsEditSheetOpen(false)
            await refetch()
        },
    })

    const tableRef = useTableRef<DType>()

    const {
        deleteContext,
        isCreateDialogOpen,
        isDeleteDialogOpen,
        isEditSheetOpen,
        isViewSheetOpen,
        selectedToDelete,
        selectedToEdit,
        selectedToView,
        setDeleteContext,
        setIsCreateDialogOpen,
        setIsDeleteDialogOpen,
        setIsEditSheetOpen,
        setIsViewSheetOpen,
        triggerToDelete,
        triggerToEdit,
        triggerToView,
        incrementDeleteContext,
    } = useTableHooks<DType>()

    const columnsOptions: ColumnOptions = {
        onRowDelete: triggerToDelete,
        onRowEdit: triggerToEdit,
        onRowView: triggerToView,
    }

    const columns = useColumns(columnsOptions)

    return (
        <div className="h-full w-full overflow-hidden">
            <div className="flex h-full flex-col gap-4">
                <DataTableProvider
                    columns={columns}
                    data={reservations ?? []}
                    tableRef={tableRef}
                >
                    <div className="flex justify-end">
                        <div className="flex gap-2">
                            <DataTableViewOptions className="h-full" />
                        </div>
                    </div>
                    <DataTable
                        isLoading={!isFetched}
                        notFound="no availabilities found"
                    />
                    <DataTablePagination />
                </DataTableProvider>
                <ViewSheet
                    open={isViewSheetOpen}
                    onOpenChange={setIsViewSheetOpen}
                    items={selectedToView ?? []}
                    isLoading={false}
                    label={(item) => `View ${item?.id}`}
                >
                    {(item) => {
                        return <ViewReservation value={item} />
                    }}
                </ViewSheet>
                <EditSheet
                    open={isEditSheetOpen}
                    onOpenChange={setIsEditSheetOpen}
                    items={selectedToEdit ?? []}
                    isLoading={false}
                    label={(item) => `Edit ${item?.id}`}
                >
                    {(item) => {
                        return (
                            <EditReservation
                                isUpdating={reservationEditMutation.isPending}
                                onEdit={(updatedReservation) =>
                                    reservationEditMutation.mutate({
                                        id: item.id,
                                        updatedReservation,
                                    })
                                }
                                onDelete={async (reservation: DType) =>
                                    await triggerToDelete([reservation])
                                }
                                state={{
                                    spas: spas!,
                                }}
                                defaultValue={item}
                            />
                        )
                    }}
                </EditSheet>
                <DeleteDialog
                    items={selectedToDelete! || []}
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onDelete={async (e, items) => {
                        await reservationDeleteMutation.mutateAsync(items!)
                        setIsEditSheetOpen(false)
                    }}
                    deleteContext={deleteContext}
                    isLoading={reservationDeleteMutation.isPending}
                    onCancel={(e, items) => setIsDeleteDialogOpen(false)}
                />
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
                        <div className="absolute flex items-center justify-center">
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
