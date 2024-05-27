'use client'

import { useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Relations, { Service, UpdateService } from '@/types/model/Service'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { useMemo } from 'react'
import Combobox from '@/components/atomics/molecules/Combobox'
import { createImage, deleteImage, getImages } from '@/actions/Image/index'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Upload } from 'lucide-react'
import FileSelector from '../../molecules/FileSelector'
import { Image as ImageType } from '@/types/model/Image'

type EditServiceProps<T extends Service<[typeof Relations.image]>> = {
    isLoading?: boolean
    isUpdating?: boolean
    onEdit?: (data: UpdateService) => void
    onDelete?: (id: T) => void
    defaultValue: T
}

export default function EditService<
    T extends Service<[typeof Relations.image]>,
>({
    isLoading,
    isUpdating,
    onEdit,
    onDelete,
    defaultValue,
}: EditServiceProps<T>) {
    const {
        data: images,
        isFetched: isImagesFetched,
        refetch: refetchImage,
    } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })
    const [serviceState, setServiceState] = useState(defaultValue)

    useEffect(() => {
        setServiceState(defaultValue)
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
                    <Label htmlFor="label">label</Label>
                    <Input
                        value={serviceState?.label}
                        onChange={(e) =>
                            setServiceState({
                                ...serviceState!,
                                label: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="flex w-full flex-col">
                    <Label htmlFor="description">description</Label>
                    <Input
                        value={serviceState?.description}
                        onChange={(e) =>
                            setServiceState({
                                ...serviceState!,
                                description: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="flex w-full flex-col">
                    <Label htmlFor="description">Image</Label>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full gap-2"
                                variant="outline"
                                size="sm"
                            >
                                {serviceState?.image?.file?.name ? (
                                    <span>
                                        {serviceState?.image?.file?.name}
                                    </span>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        <span>Upload</span>
                                    </>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <FileSelector
                                defaultSelectedFileId={defaultValue?.imageId}
                                files={images as ImageType[]}
                                renderFile={(image) => {
                                    return (
                                        <ApiImage
                                            alt="Product image"
                                            className="h-full w-full object-contain"
                                            path={image.path}
                                            width={400}
                                            height={400}
                                        />
                                    )
                                }}
                                renderFileList={(image) => {
                                    return (
                                        <ApiImage
                                            alt="Product image"
                                            className="h-16 w-16 rounded-md object-none"
                                            path={image.path}
                                            width="200"
                                            height="200"
                                        />
                                    )
                                }}
                                onFileSelect={(image: ImageType) => {
                                    setServiceState({
                                        ...serviceState!,
                                        imageId: image.id,
                                        image: image,
                                    })
                                }}
                                onFileUpload={async (file) => {
                                    const formData = new FormData()
                                    formData.append('alt', 'alt')
                                    formData.append('image', file)
                                    const data = createImage(formData)
                                    await refetchImage()
                                    return data
                                }}
                                onFileDelete={async (image) => {
                                    deleteImage(image.id)
                                    await refetchImage()
                                }}
                            />
                        </DialogContent>
                    </Dialog>
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
                    onClick={() => onEdit?.(serviceState!)}
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
