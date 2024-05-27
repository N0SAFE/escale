import { CreateService as CreateServiceType } from '@/types/model/Service'
import Loader from '../../atoms/Loader'
import { Button } from '@/components/ui/button'
import Combobox from '../../molecules/Combobox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React from 'react'
import ApiImage from '../../atoms/ApiImage'
import { getImages } from '@/actions/Image/index'
import { useQuery } from '@tanstack/react-query'

type CreateSpaProps = {
    isLoading?: boolean
    onCreate?: (data?: CreateServiceType) => void
}

export default function CreateService({ isLoading, onCreate }: CreateSpaProps) {
    const { data: images, isFetched: isImagesFetched } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })
    const fileSelectItems = React.useMemo(
        () =>
            images?.map((image) => {
                return {
                    label: image.file.name,
                    value: image,
                }
            }),
        [images]
    )

    const [serviceState, setServiceState] = React.useState<CreateServiceType>({
        label: '',
        description: '',
        imageId: -1,
    })
    return (
        <div>
            <div className="grid w-full gap-4  py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Label
                    </Label>
                    <Input
                        id="label"
                        value={serviceState.label}
                        className="col-span-3"
                        onChange={(e) =>
                            setServiceState({
                                ...serviceState,
                                label: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        description
                    </Label>
                    <Input
                        id="description"
                        value={serviceState.description}
                        className="col-span-3"
                        onChange={(e) =>
                            setServiceState({
                                ...serviceState,
                                description: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                        image
                    </Label>
                    <Combobox
                        onRender={(image) => (
                            <div>
                                <ApiImage
                                    path={image.path}
                                    width={50}
                                    height={50}
                                    alt={'test'}
                                />
                            </div>
                        )}
                        className="col-span-3"
                        items={fileSelectItems || []}
                        isLoading={!isImagesFetched}
                        defaultPreviewText="Select an image..."
                        value={
                            serviceState?.imageId
                                ? { id: serviceState?.imageId }
                                : undefined
                        }
                        onSelect={(image) =>
                            setServiceState({
                                ...serviceState!,
                                imageId: images?.find((i) => image?.id === i.id)
                                    ?.id!,
                            })
                        }
                    />
                </div>
            </div>
            <Button
                className="relative"
                onClick={() => onCreate?.(serviceState)}
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
