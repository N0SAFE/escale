'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreateSpa as CreateSpaType, UpdateSpa } from '@/types/model/Spa'
import { toast } from 'sonner'
import { ColumnOptions, useColumns } from './columns'
import { DataTable } from '@/components/atomics/organisms/DataTable'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import { spasAccessor, DType } from './utils'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'
import useTableHooks from '@/hooks/useTableHooks'
import useTableRef from '@/hooks/useTableRef'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import ViewSheet from '@/components/atomics/templates/ViewSheet'
import EditSheet from '@/components/atomics/templates/EditSheet'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import ViewSpa from '@/components/atomics/templates/View/ViewSpa'
import EditSpa from '@/components/atomics/templates/Edit/EditSpa'
import { updateSpa, createSpa, deleteSpa } from '@/actions/Spa/index'
import CreateSpa from '@/components/atomics/templates/Create/CreateSpa'

export default function SpasTable() {
    const {
        data: spas,
        isFetched,
        refetch,
    } = useQuery({
        queryKey: ['spas'],
        queryFn: async () =>
            (await spasAccessor().then((spas) =>
                spas.map((s) => ({ ...s, uuid: s.id }))
            )) as DType[],
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
            tableRef.current?.resetRowSelection()
            setIsCreateDialogOpen(false)
            await refetch()
        },
    })
    const spaEditMutation = useMutation({
        mutationFn: async ({
            updatedSpa,
            id,
        }: {
            updatedSpa: UpdateSpa
            id: number
        }) => {
            return await updateSpa(id, updatedSpa)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('spa updated')
            await refetch()
        },
    })
    const spaDeleteMutation = useMutation({
        mutationFn: async (spas: DType[]) => {
            let count = 0
            setDeleteContext({
                of: spas.length,
                out: 0,
            })
            await Promise.all(
                spas.map(async (s) => {
                    await deleteSpa(s.id)
                    count++
                    setDeleteContext({
                        of: spas.length,
                        out: count,
                    })
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('spa deleted')
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
                <DataTableProvider
                    columns={columns}
                    data={spas ?? []}
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
                        notFound="no spas found"
                    />
                    <DataTablePagination />
                </DataTableProvider>
                <CreateDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <CreateSpa
                        isLoading={spaCreateMutation.isPending}
                        onCreate={(data) => spaCreateMutation.mutate(data)}
                    />
                </CreateDialog>
                <ViewSheet
                    open={isViewSheetOpen}
                    onOpenChange={setIsViewSheetOpen}
                    items={selectedToView ?? []}
                    isLoading={false}
                    label={(item) => `View ${item?.title}`}
                >
                    {(item) => {
                        return <ViewSpa value={item} />
                    }}
                </ViewSheet>
                <EditSheet
                    open={isEditSheetOpen}
                    onOpenChange={setIsEditSheetOpen}
                    items={selectedToEdit ?? []}
                    isLoading={false}
                    label={(item) => `Edit ${item?.title}`}
                >
                    {(item) => {
                        return (
                            <EditSpa
                                defaultValue={item}
                                isUpdating={spaEditMutation.isPending}
                                onEdit={(updatedSpa) =>
                                    spaEditMutation.mutate({
                                        id: item.id,
                                        updatedSpa,
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
                        await spaDeleteMutation.mutateAsync(items!)
                        setIsEditSheetOpen(false)
                    }}
                    deleteContext={deleteContext}
                    isLoading={spaDeleteMutation.isPending}
                    onCancel={(e, items) => setIsDeleteDialogOpen(false)}
                />
            </div>
        </div>
    )
}

// type DeleteImageProps = {
//     isLoading?: boolean
//     onDelete?: () => void
//     onCancel?: () => void
//     deleteContext?: {
//         numberOfSelectedRows: number
//         numberOfDeletedRows: number
//     }
// }

// function DeleteSpa({
//     isLoading,
//     onDelete,
//     onCancel,
//     deleteContext,
// }: DeleteImageProps) {
//     return (
//         <>
//             <AlertDialogHeader>
//                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                     This action cannot be undone. This will permanently delete
//                     the image and remove the data associated from our servers.
//                 </AlertDialogDescription>
//             </AlertDialogHeader>
//             {isLoading && deleteContext && (
//                 <ProgressBar
//                     out={deleteContext.numberOfDeletedRows}
//                     of={deleteContext.numberOfSelectedRows}
//                     label="users"
//                 />
//             )}
//             <AlertDialogFooter>
//                 <Button variant={'outline'} onClick={onCancel}>
//                     Cancel
//                 </Button>
//                 <Button disabled={isLoading} onClick={onDelete}>
//                     <span className={isLoading ? 'invisible' : 'visible'}>
//                         Continue
//                     </span>
//                     {isLoading ? (
//                         <div className="flex items-center justify-center absolute">
//                             <Loader size={'4'} />
//                         </div>
//                     ) : (
//                         ''
//                     )}
//                 </Button>
//             </AlertDialogFooter>
//         </>
//     )
// }

// const Editor = dynamic(() => import('@/components/atomics/atoms/Editor'), {
//     ssr: false,
// })

// type CreateSpaProps = {
//     isLoading?: boolean
//     onCreate?: (data?: CreateSpaType) => void
// }

// function CreateSpa({ isLoading, onCreate }: CreateSpaProps) {
//     const { data: images, isFetched: isImagesFetched } = useQuery({
//         queryKey: ['images'],
//         queryFn: async () => getImages(),
//     })
//     const { data: services, isFetched: isServicesFetched } = useQuery({
//         queryKey: ['services'],
//         queryFn: async () => getServices(),
//     })
//     const fileSelectItems = React.useMemo(
//         () =>
//             images?.map((image) => {
//                 return {
//                     component: (
//                         <span>
//                             <ApiImage
//                                 path={image.path}
//                                 width={50}
//                                 height={50}
//                                 alt={'test'}
//                             />
//                         </span>
//                     ),
//                     label: image.file.name,
//                     value: image.id,
//                 }
//             }),
//         [images]
//     )
//     const serviceSelectItems = React.useMemo(
//         () =>
//             services?.map((service) => {
//                 return {
//                     label: service.label,
//                     value: service.id,
//                 }
//             }),
//         [services]
//     )
//     const onImageSelect = (ids: number[]) => {
//         let maxOrder = Math.max(
//             0,
//             ...(spaState?.spaImages?.map((i) => i.order) || [])
//         )
//         const newSpaImages = ids.map((id, index) => {
//             const exist = spaState?.spaImages?.find((i) => i.image.id === id)
//             if (exist) {
//                 return exist
//             }
//             maxOrder++
//             return {
//                 order: maxOrder,
//                 image: images?.find((i) => i.id === id)!,
//             } as SpaImageType
//         })

//         setSpaState({ ...spaState!, spaImages: newSpaImages })
//     }

//     const handleReorder = function (spaImages: SpaImageType[]) {
//         const newSpaImages = spaImages.map((item, index) => {
//             item.order = index + 1
//             return item
//         })
//         setSpaState({ ...spaState!, spaImages: newSpaImages })
//     }
//     const [spaState, setSpaState] = React.useState<CreateSpaType>({
//         title: '',
//         description: '',
//         location: '',
//         googleMapsLink: '',
//         spaImages: [],
//         services: [],
//     })
//     return (
//         <div>
//             <div className="grid gap-4 grid-cols-2">
//                 <div className="grid gap-4 py-4  w-full">
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="name" className="text-right">
//                             Title
//                         </Label>
//                         <Input
//                             id="title"
//                             value={spaState.title}
//                             className="col-span-3"
//                             onChange={(e) =>
//                                 setSpaState({
//                                     ...spaState,
//                                     title: e.target.value,
//                                 })
//                             }
//                         />
//                     </div>
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="description" className="text-right">
//                             location
//                         </Label>
//                         <Input
//                             id="location"
//                             value={spaState.location}
//                             className="col-span-3"
//                             onChange={(e) =>
//                                 setSpaState({
//                                     ...spaState,
//                                     location: e.target.value,
//                                 })
//                             }
//                         />
//                     </div>
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label
//                             htmlFor="google_maps_link"
//                             className="text-right"
//                         >
//                             google maps link
//                         </Label>
//                         <Input
//                             id="google_maps_link"
//                             value={spaState.googleMapsLink}
//                             className="col-span-3"
//                             onChange={(e) =>
//                                 setSpaState({
//                                     ...spaState,
//                                     googleMapsLink: e.target.value,
//                                 })
//                             }
//                         />
//                     </div>
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="description" className="text-right">
//                             Select images
//                         </Label>
//                         <div className="w-full col-span-3 border rounded-md p-4">
//                             <Combobox
//                                 className="w-full"
//                                 multiple
//                                 items={images?.map((image) => {
//                                     return {
//                                         label: image.file.name,
//                                         value: image,
//                                     }
//                                 })}
//                                 isLoading={!isImagesFetched}
//                                 defaultPreviewText="Select an image..."
//                                 defaultSearchText="Search for an image..."
//                                 value={spaState?.spaImages?.map((i) => i.image)}
//                                 onSelect={(images) =>
//                                     onImageSelect(
//                                         images.map(function (i) {
//                                             return i.id
//                                         })
//                                     )
//                                 }
//                                 keepOpen
//                                 onRender={(val) => {
//                                     return (
//                                         <span>
//                                             <ApiImage
//                                                 path={val.path}
//                                                 width={50}
//                                                 height={50}
//                                                 alt={'test'}
//                                             />
//                                         </span>
//                                     )
//                                 }}
//                             />
//                             <ScrollArea className="h-96">
//                                 <Reorder.Group
//                                     axis="y"
//                                     values={spaState?.spaImages || []}
//                                     onReorder={handleReorder}
//                                     layoutScroll
//                                 >
//                                     {spaState?.spaImages?.map((item, index) => (
//                                         <Reorder.Item
//                                             value={item}
//                                             key={item.id}
//                                         >
//                                             <div
//                                                 data-id={index}
//                                                 style={{ cursor: 'grab' }}
//                                             >
//                                                 <Card className="flex items-center justify-between w-full p-4">
//                                                     <div className="flex items-center gap-4">
//                                                         <ApiImage
//                                                             path={
//                                                                 item.image.path
//                                                             }
//                                                             width={50}
//                                                             height={50}
//                                                             alt={
//                                                                 item.image.file
//                                                                     .name
//                                                             }
//                                                         />
//                                                         <span className="overflow-hidden text-ellipsis">
//                                                             {
//                                                                 item.image.file
//                                                                     .name
//                                                             }
//                                                         </span>
//                                                     </div>
//                                                 </Card>
//                                             </div>
//                                         </Reorder.Item>
//                                     ))}
//                                 </Reorder.Group>
//                             </ScrollArea>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <div className="w-full items-center gap-1.5">
//                         <Label htmlFor="description">Description</Label>
//                         <div className="overflow-y-auto max-h-96">
//                             <Editor
//                                 data={spaState?.description}
//                                 onChange={(event, editor) => {
//                                     setSpaState({
//                                         ...spaState,
//                                         description: editor.getData(),
//                                     })
//                                 }}
//                             />
//                         </div>
//                     </div>
//                     <div className="grid w-full max-w-sm items-center gap-1.5">
//                         <Label htmlFor="location">Services</Label>
//                         <Combobox
//                             multiple
//                             items={services?.map((service) => {
//                                 return {
//                                     label: service.label,
//                                     value: service,
//                                 }
//                             })}
//                             isLoading={!isServicesFetched}
//                             defaultPreviewText="Select an sercice..."
//                             defaultSearchText="Search for a sercice..."
//                             value={spaState?.services}
//                             onSelect={(sers) =>
//                                 setSpaState({
//                                     ...spaState,
//                                     services: sers.map(
//                                         (service) =>
//                                             services?.find(
//                                                 (subs) => subs.id === service.id
//                                             )!
//                                     ),
//                                 })
//                             }
//                             keepOpen
//                         />
//                     </div>
//                 </div>
//             </div>
//             <DialogFooter>
//                 <Button
//                     className="relative"
//                     onClick={() => onCreate?.(spaState)}
//                     disabled={isLoading}
//                 >
//                     <span className={isLoading ? 'invisible' : 'visible'}>
//                         Save change
//                     </span>
//                     {isLoading ? (
//                         <div className="flex items-center justify-center absolute">
//                             <Loader size={'4'} />
//                         </div>
//                     ) : (
//                         ''
//                     )}
//                 </Button>
//             </DialogFooter>
//         </div>
//     )
// }
