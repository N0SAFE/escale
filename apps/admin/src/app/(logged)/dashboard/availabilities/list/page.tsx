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
import { Availability, UpdateAvailability } from '@/types/model/Availability'
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
} from '@/actions/Availability'
import { toast } from 'sonner'
import { DateTime } from 'luxon'
import { Input } from '@/components/ui/input'
import Loader from '@/components/atomics/atoms/Loader'
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
import { availabilitiesAccessor, DType } from '../utils'
import ProgressBar from '@/components/atomics/atoms/ProgressBar'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'
import { spaAccessor } from '../utils'
import ViewSheet from '@/components/atomics/templates/ViewSheet'
import EditSheet from '@/components/atomics/templates/EditSheet'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import useTableHooks from '@/hooks/useTableHooks'
import ViewAvailability from '@/components/atomics/templates/View/ViewAvailbility'
import EditAvailability from '@/components/atomics/templates/Edit/EditAvailability'

type ListViewProps = {}

export default function AvailabilityListView({}: ListViewProps) {
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
    const availabilityEditMutation = useMutation({
        mutationFn: async ({
            id,
            updatedAvailability,
        }: {
            id: number
            updatedAvailability: UpdateAvailability
        }) => {
            if (!updatedAvailability) {
                return
            }
            return await updateAvailability(id, {
                startAt: updatedAvailability.startAt,
                endAt: updatedAvailability.endAt,
                spaId: updatedAvailability.spaId,
                monPrice: updatedAvailability.monPrice,
                tuePrice: updatedAvailability.tuePrice,
                wedPrice: updatedAvailability.wedPrice,
                thuPrice: updatedAvailability.thuPrice,
                friPrice: updatedAvailability.friPrice,
                satPrice: updatedAvailability.satPrice,
                sunPrice: updatedAvailability.sunPrice,
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
        mutationFn: async (availabilities: Availability[]) => {
            await Promise.all(
                availabilities.map(async (a) => {
                    await deleteAvailability(a.id)
                    incrementDeleteContext()
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability deleted')
            tableRef.current?.resetRowSelection()
            setIsDeleteDialogOpen(false)
            setIsEditSheetOpen(false)
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
    const [isEditing, setIsEditing] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [selectedAvailabilities, setSelectedAvailabilities] =
        React.useState<DType[]>()

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
                        notFound="no reservations found"
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
                        return <ViewAvailability value={item} />
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
                            <EditAvailability
                                isUpdating={availabilityEditMutation.isPending}
                                onEdit={(updatedAvailability) =>
                                    availabilityEditMutation.mutate({
                                        id: item.id,
                                        updatedAvailability,
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
                        await availabilityDeleteMutation.mutateAsync(items!)
                        setIsEditSheetOpen(false)
                    }}
                    deleteContext={deleteContext}
                    isLoading={availabilityDeleteMutation.isPending}
                    onCancel={(e, items) => setIsDeleteDialogOpen(false)}
                />
            </div>
        </div>
    )
}
