'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSpa, deleteSpa, getSpas } from './actions'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import {
    AlertDialog,
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
import Combobox from '@/components/atomics/molecules/Combobox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Reorder } from 'framer-motion'
import { getImages, getServices } from '../actions'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { Card } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useColumns } from './columns'
import { DataTable } from '@/components/atomics/organisms/DataTable/index'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'

export default function SpasTable() {
    const {
        data: spas,
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
            setIsCreateDialogOpen(false)
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

    const tableRef = React.useRef<Table<Spa>>(null)

    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [isDeletDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [selectedSpaToDelete, setSelectedSpaToDelete] = React.useState<Spa>()

    const columns = useColumns({
        onRowDelete: async ({ row }) => {
            setSelectedSpaToDelete(row.original)
            setIsDeleteDialogOpen(true)
        },
        useLoaderOnRowDelete: true,
    })

    return (
        <div className="w-full">
            <AlertDialog
                open={isDeletDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <DeleteSpa
                        onDelete={() =>
                            spaDeleteMutation.mutate(selectedSpaToDelete?.id!)
                        }
                        isLoading={spaDeleteMutation.isPending}
                        onCancel={() => setIsDeleteDialogOpen(false)}
                    />
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                    <div className="flex gap-2">
                        <DataTableViewOptions
                            className="h-full"
                            table={
                                tableRef.current === null
                                    ? undefined
                                    : tableRef.current
                            }
                        />
                        <Dialog
                            open={isCreateDialogOpen}
                            onOpenChange={setIsCreateDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline">+</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                    <DialogTitle>Create service</DialogTitle>
                                    <DialogDescription>
                                        create a new service and add it to the
                                        list
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
                <DataTable
                    columns={columns}
                    data={spas ?? []}
                    isLoading={!isFetched}
                    notFound="no spas found"
                    tableRef={tableRef}
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

const Editor = dynamic(() => import('@/components/atomics/atoms/Editor'), {
    ssr: false,
})

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
