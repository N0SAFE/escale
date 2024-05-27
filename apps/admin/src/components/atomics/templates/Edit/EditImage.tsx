'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Loader from '@/components/atomics/atoms/Loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Image, UpdateImage } from '@/types/index'
import ApiImage from '@/components/atomics/atoms/ApiImage'

type EditImageProps<T extends Image> = {
    isLoading?: boolean
    isUpdating?: boolean
    onEdit?: (data: UpdateImage) => void
    onDelete?: (id: T) => void
    defaultValue: T
}

export default function EditImage<T extends Image>({
    isUpdating,
    isLoading,
    onEdit,
    onDelete,
    defaultValue,
}: EditImageProps<T>) {
    const [imageState, setImageState] = useState<UpdateImage>()

    useEffect(() => {
        setImageState({
            name: defaultValue?.file?.name,
            alt: defaultValue?.alt,
        })
    }, [defaultValue])

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex min-h-full flex-col justify-between gap-16">
            <div className="flex w-full gap-4 lg:gap-16">
                <div className="flex w-full flex-col">
                    <Label htmlFor="name">name</Label>
                    <Input
                        value={imageState?.name}
                        onChange={(e) =>
                            setImageState({
                                ...imageState!,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="flex w-full flex-col">
                    <Label htmlFor="alt">alt</Label>
                    <Input
                        value={imageState?.alt}
                        onChange={(e) =>
                            setImageState({
                                ...imageState!,
                                alt: e.target.value,
                            })
                        }
                    />
                </div>
                <ApiImage
                    path={defaultValue?.path!}
                    alt={imageState?.alt!}
                    width={100}
                    height={100}
                />
            </div>
            <div className="flex justify-between">
                <Button
                    className="relative"
                    onClick={() => onDelete?.(defaultValue)}
                    variant={'destructive'}
                >
                    <span>Delete</span>
                </Button>
                <Button
                    className="relative"
                    onClick={() => onEdit?.(imageState!)}
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
    )
}
