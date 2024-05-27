import { getImages } from '@/actions/Image/index'
import { getServices } from '@/actions/Service/index'
import { CreateSpa as CreateSpaType } from '@/types/model/Spa'
import Relations, { SpaImage as SpaImageType } from '@/types/model/SpaImage'
import React from 'react'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { useQuery } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Combobox from '../../molecules/Combobox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Reorder } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Loader from '../../atoms/Loader'
import dynamic from 'next/dynamic'

const LazyEditor = dynamic(() => import('@/components/atomics/atoms/Editor'), {
    ssr: false,
})

type CreateSpaProps = {
    isLoading?: boolean
    onCreate?: (data?: CreateSpaType) => void
}

export default function CreateSpa({ isLoading, onCreate }: CreateSpaProps) {
    const { data: images, isFetched: isImagesFetched } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })
    const { data: services, isFetched: isServicesFetched } = useQuery({
        queryKey: ['services'],
        queryFn: async () => getServices(),
    })

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
            } as SpaImageType<[typeof Relations.image]>
        })

        setSpaState({ ...spaState!, spaImages: newSpaImages })
    }

    const handleReorder = function (
        spaImages: SpaImageType<[typeof Relations.image]>[]
    ) {
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
    return (
        <div className="flex flex-col overflow-y-auto @container ">
            <div className="flex w-full flex-col gap-4 py-4 @md:flex-row">
                <div className="grid w-full gap-4 overflow-auto py-4 @md:flex-1">
                    <div className="gap-4">
                        <Label htmlFor="name" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={spaState.title}
                            onChange={(e) =>
                                setSpaState({
                                    ...spaState,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="gap-4">
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
                    <div className="gap-4">
                        <Label
                            htmlFor="google_maps_link"
                            className="text-right"
                        >
                            google maps link
                        </Label>
                        <Input
                            id="google_maps_link"
                            value={spaState.googleMapsLink}
                            onChange={(e) =>
                                setSpaState({
                                    ...spaState,
                                    googleMapsLink: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="gap-4">
                        <Label htmlFor="description" className="text-right">
                            Select images
                        </Label>
                        <div className="w-full rounded-md border p-4">
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
                                                path={val.path}
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
                                            key={item.image.id}
                                        >
                                            <div
                                                data-id={index}
                                                style={{ cursor: 'grab' }}
                                            >
                                                <Card className="flex w-full items-center justify-between p-4">
                                                    <div className="flex items-center gap-4">
                                                        <ApiImage
                                                            path={
                                                                item.image.path
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
                <div className="flex flex-col gap-2 overflow-auto @md:flex-1">
                    <div className="w-full items-center gap-1.5 overflow-x-auto">
                        <Label htmlFor="description">Description</Label>
                        <div className="max-h-96 overflow-y-auto">
                            <LazyEditor
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
            <Button
                className="relative"
                onClick={() => onCreate?.(spaState)}
                disabled={isLoading}
            >
                <span className={isLoading ? 'invisible' : 'visible'}>
                    Save change
                </span>
                {isLoading ? (
                    <div className="absolute flex items-center justify-center">
                        <Loader size={'4'} />
                    </div>
                ) : (
                    ''
                )}
            </Button>
        </div>
    )
}
