'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
    CreateService as CreateServiceType,
    UpdateService,
} from '@/types/model/Service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'
import { ColumnOptions, useColumns } from './columns'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import { DataTable } from '@/components/atomics/organisms/DataTable/index'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import { DType, servicesAccessor } from './utils'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import useTableHooks from '@/hooks/useTableHooks'
import useTableRef from '@/hooks/useTableRef'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import ViewSheet from '@/components/atomics/templates/ViewSheet'
import EditSheet from '@/components/atomics/templates/EditSheet'
import CreateService from '@/components/atomics/templates/Create/CreateService'
import ViewService from '@/components/atomics/templates/View/ViewService'
import EditService from '@/components/atomics/templates/Edit/EditService'
import { updateService, createService, deleteService } from '@/actions/Service'

export default function Services() {
    const {
        data: services,
        error,
        isFetched,
        refetch,
    } = useQuery({
        queryKey: ['services'],
        queryFn: servicesAccessor,
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
            tableRef.current?.resetRowSelection()
            setIsCreateDialogOpen(false)
            await refetch()
        },
    })
    const serviceEditMutation = useMutation({
        mutationFn: async ({
            updatedService,
            id,
        }: {
            updatedService: UpdateService
            id: number
        }) => {
            return await updateService(id, {
                label: updatedService?.label,
                description: updatedService?.description,
                imageId: updatedService?.imageId,
            })
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('Service updated')
            await refetch()
        },
    })
    const serviceDeleteMutation = useMutation({
        mutationFn: async (services: DType[]) => {
            let count = 0
            setDeleteContext({
                of: services.length,
                out: 0,
            })
            await Promise.all(
                services.map(async (s) => {
                    await deleteService(s.id)
                    count++
                    setDeleteContext({
                        out: services.length,
                        of: count,
                    })
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('service deleted')
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
    } = useTableHooks<DType>()

    const columnsOptions: ColumnOptions = {
        onRowDelete: triggerToDelete,
        onRowEdit: triggerToEdit,
        onRowView: triggerToView,
    }

    const columns = useColumns(columnsOptions)

    return (
        <div className="h-full w-full">
            <div className="flex h-full flex-col gap-4">
                <DataTableProvider columns={columns} data={services ?? []}>
                    <div className="flex justify-end">
                        <div className="flex gap-2">
                            <DataTableViewOptions className="h-full" />
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        isLoading={!isFetched}
                        notFound="no spas found"
                    />
                    <DataTablePagination />
                </DataTableProvider>
                <CreateDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <CreateService
                        isLoading={serviceCreateMutation.isPending}
                        onCreate={(data) => serviceCreateMutation.mutate(data)}
                    />
                </CreateDialog>
                <ViewSheet
                    open={isViewSheetOpen}
                    onOpenChange={setIsViewSheetOpen}
                    items={selectedToView ?? []}
                    isLoading={false}
                    label={(item) => `View ${item?.label}`}
                >
                    {(item) => {
                        return <ViewService value={item} />
                    }}
                </ViewSheet>
                <EditSheet
                    open={isEditSheetOpen}
                    onOpenChange={setIsEditSheetOpen}
                    items={selectedToEdit ?? []}
                    isLoading={false}
                    label={(item) => `Edit ${item?.label}`}
                >
                    {(item) => {
                        return (
                            <EditService
                                defaultValue={item}
                                isUpdating={serviceEditMutation.isPending}
                                onEdit={(updatedService) =>
                                    serviceEditMutation.mutate({
                                        id: item.id,
                                        updatedService,
                                    })
                                }
                                onDelete={async (image) =>
                                    await triggerToDelete([image])
                                }
                            />
                        )
                    }}
                </EditSheet>
                <DeleteDialog
                    items={selectedToDelete! || []}
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onDelete={async (e, items) => {
                        await serviceDeleteMutation.mutateAsync(items!)
                        setIsEditSheetOpen(false)
                    }}
                    deleteContext={deleteContext}
                    isLoading={serviceDeleteMutation.isPending}
                    onCancel={(e, items) => setIsDeleteDialogOpen(false)}
                />
            </div>
        </div>
    )
}
