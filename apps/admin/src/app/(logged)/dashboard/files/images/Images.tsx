'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { createImage, deleteImage, updateImage } from '@/actions/Image'
import {
    CreateImage as CreateImageType,
    Image,
    UpdateImage,
} from '@/types/index'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ColumnOptions, useColumns } from './columns'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import { DataTable } from '@/components/atomics/organisms/DataTable'
import { imagesAccessor, DType } from './utils'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import EditSheet from '@/components/atomics/templates/EditSheet'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import CreateImage from '@/components/atomics/templates/Create/CreateImage'
import EditImage from '@/components/atomics/templates/Edit/EditImage'
import ViewSheet from '@/components/atomics/templates/ViewSheet'
import ViewImage from '@/components/atomics/templates/View/ViewImage'
import useTableHooks from '@/hooks/useTableHooks'
import useTableRef from '@/hooks/useTableRef'

export default function Images() {
    const {
        data: images,
        error,
        isFetched,
        refetch,
    } = useQuery({
        queryKey: ['images'],
        queryFn: imagesAccessor,
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
            setIsCreateDialogOpen(false)
            await refetch()
        },
    })
    const imageEditMutation = useMutation({
        mutationFn: async ({
            updatedImage,
            id,
        }: {
            updatedImage: UpdateImage
            id: number
        }) => {
            return await updateImage(id, updatedImage)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('Service updated')
            await refetch()
        },
    })
    const imageDeleteMutation = useMutation({
        mutationFn: async (images: Image[]) => {
            let count = 0
            setDeleteContext({
                of: images.length,
                out: 0,
            })
            await Promise.all(
                images.map(async (i) => {
                    await deleteImage(i.id)
                    count++
                    setDeleteContext({
                        of: images.length,
                        out: count,
                    })
                })
            )
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
        <div className="h-full w-full overflow-hidden">
            <div className="flex h-full flex-col gap-4">
                <DataTableProvider
                    columns={columns}
                    data={images ?? []}
                    tableRef={tableRef}
                >
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
                        notFound="no images found"
                    />
                    <DataTablePagination />
                </DataTableProvider>
                <CreateDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <CreateImage
                        isLoading={imageCreateMutation.isPending}
                        onCreate={(data) => imageCreateMutation.mutate(data)}
                    />
                </CreateDialog>
                <ViewSheet
                    open={isViewSheetOpen}
                    onOpenChange={setIsViewSheetOpen}
                    items={selectedToView ?? []}
                    isLoading={false}
                    label={(item) => `View ${item?.file?.name}`}
                >
                    {(item) => {
                        return <ViewImage value={item} />
                    }}
                </ViewSheet>
                <EditSheet
                    open={isEditSheetOpen}
                    onOpenChange={setIsEditSheetOpen}
                    items={selectedToEdit ?? []}
                    isLoading={false}
                    label={(item) => `Edit ${item?.file?.name}`}
                >
                    {(item) => {
                        return (
                            <EditImage
                                defaultValue={item}
                                isUpdating={imageEditMutation.isPending}
                                onEdit={(updatedImage) =>
                                    imageEditMutation.mutate({
                                        id: item.id,
                                        updatedImage,
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
                        await imageDeleteMutation.mutateAsync(items!)
                        setIsEditSheetOpen(false)
                    }}
                    deleteContext={deleteContext}
                    isLoading={imageDeleteMutation.isPending}
                    onCancel={(e, items) => setIsDeleteDialogOpen(false)}
                />
            </div>
        </div>
    )
}
