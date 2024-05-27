'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spa, UpdateSpa } from '@/types/model/Spa'
import Relations, { SpaImage as SpaImageType } from '@/types/model/SpaImage'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import Combobox from '@/components/atomics/molecules/Combobox'
import { Reorder } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getServices } from '@/actions/Service/index'
import { getImages } from '@/actions/Image/index'
import dynamic from 'next/dynamic'

const LazyEditor = dynamic(() => import('@/components/atomics/atoms/Editor'), {
    ssr: false,
})

type EditSpaProps<T extends Spa> = {
    isLoading?: boolean
    isUpdating?: boolean
    onEdit?: (data: UpdateSpa) => void
    onDelete?: (id: T) => void
    defaultValue: T
}

export default function EditSpa<T extends Spa>({
    isUpdating,
    isLoading,
    onEdit,
    onDelete,
    defaultValue,
}: EditSpaProps<T>) {
    const [isEditorLoading, setIsEditorLoading] = useState(true)
    const [spaState, setSpaState] = useState<UpdateSpa>()

    const { data: services, isFetched: isServicesFetched } = useQuery({
        queryKey: ['services'],
        queryFn: async () => getServices(),
    })

    const { data: images, isFetched: isImagesFetched } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })

    useEffect(() => {
        setSpaState(defaultValue)
    }, [defaultValue])

    const renderItem = (item: SpaImageType<[typeof Relations.image]>) => (
        <Card className="flex w-full items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <ApiImage
                    path={item.image.path}
                    width={50}
                    height={50}
                    alt={item.image.file.name}
                />
                <span>{item.image.file.name}</span>
            </div>
        </Card>
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

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div
                className={cn(
                    'flex h-full w-full items-center justify-center overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary',
                    isEditorLoading ? '' : 'hidden'
                )}
            >
                <Loader />
            </div>
            <div
                className={cn(
                    'flex min-h-full flex-col justify-between gap-16',
                    isEditorLoading ? 'hidden' : ''
                )}
            >
                <div className="flex w-full flex-col justify-between gap-4 px-8 @md:flex-row ">
                    <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                value={spaState?.title}
                                onChange={(e) =>
                                    setSpaState({
                                        ...spaState,
                                        title: e.target.value,
                                    })
                                }
                                id="title"
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5 overflow-auto">
                            <Label htmlFor="description">Description</Label>
                            <LazyEditor
                                onReady={() => setIsEditorLoading(false)}
                                data={spaState?.description}
                                onChange={(event, editor) => {
                                    setSpaState({
                                        ...spaState,
                                        description: editor.getData(),
                                    })
                                }}
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
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
                                                    (subs) =>
                                                        subs.id === service.id
                                                )!
                                        ),
                                    })
                                }
                                keepOpen
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <div className="flex w-full flex-col">
                            <Label htmlFor="description">description</Label>
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
                                            key={item.id}
                                        >
                                            <div
                                                data-id={index}
                                                style={{
                                                    cursor: 'grab',
                                                }}
                                            >
                                                {renderItem(item)}
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-between">
                    <Button
                        className="relative"
                        onClick={() => onDelete?.(defaultValue)}
                        variant={'destructive'}
                    >
                        <span>Delete</span>
                    </Button>
                    <Button
                        className="relative"
                        onClick={() => onEdit?.(spaState!)}
                        disabled={isUpdating}
                    >
                        <span className={isUpdating ? 'invisible' : 'visible'}>
                            Save change
                        </span>
                        {isUpdating ? (
                            <div className="absolute flex items-center justify-center">
                                <Loader size={'4'} />
                            </div>
                        ) : (
                            ''
                        )}
                    </Button>
                </div>
            </div>
        </>
    )
}
