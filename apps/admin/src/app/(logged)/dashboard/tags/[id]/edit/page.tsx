'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getImage } from '../../actions'
import Loader from '@/components/atomics/atoms/Loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateImage } from '../../actions'
import { toast } from 'sonner'
import { UpdateImage } from '@/types/index'
import ApiImage from '@/components/atomics/atoms/ApiImage'

export default function ServiceEdit() {
    const params = useParams<{ id: string }>()
    const { data: image, isFetched } = useQuery({
        queryKey: ['service', +params.id],
        queryFn: async () => getImage(+params.id),
    })
    const [imageState, setImageState] = useState<UpdateImage>()
    const serviceMutation = useMutation({
        mutationFn: async (imageState: UpdateImage) => {
            return await updateImage(+params.id, imageState)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: (data) => {
            toast.success('Service updated')
        },
    })

    useEffect(() => {
        setImageState({
            name: image?.file?.name,
            alt: image?.alt,
        })
    }, [image])

    if (!isFetched) {
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
                        defaultValue={image?.file?.name}
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
                        defaultValue={image?.alt}
                        onChange={(e) =>
                            setImageState({
                                ...imageState!,
                                alt: e.target.value,
                            })
                        }
                    />
                </div>
                <ApiImage
                    path={image?.path!}
                    alt={imageState?.alt!}
                    width={100}
                    height={100}
                />
            </div>
            <div className="flex justify-end">
                <Button onClick={() => serviceMutation.mutate(imageState!)}>
                    Save
                </Button>
            </div>
        </div>
    )
}
