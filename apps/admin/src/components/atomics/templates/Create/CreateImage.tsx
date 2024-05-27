import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateImage as CreateImageType } from '@/types/index'
import React from 'react'
import FileInput from '@/components/atomics/atoms/FileInput'
import { Button } from '@/components/ui/button'
import Loader from '@/components/atomics/atoms/Loader'

type CreateImageProps = {
    isLoading?: boolean
    onCreate?: (data: CreateImageType) => void
}

export default function CreateImage({ isLoading, onCreate }: CreateImageProps) {
    const [imageState, setImageState] = React.useState<CreateImageType>({
        alt: '',
    })

    return (
        <div>
            <div className="grid w-full gap-4  py-4">
                <div className="flex items-center gap-4">
                    <Label htmlFor="alt" className="text-right">
                        alt
                    </Label>
                    <Input
                        id="alt"
                        value={imageState.alt}
                        onChange={(e) =>
                            setImageState({
                                ...imageState,
                                alt: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Label htmlFor="file" className="text-right">
                        file
                    </Label>
                    <FileInput
                        onUpload={(files) =>
                            setImageState({
                                ...imageState,
                                file: files?.[0]!,
                                name: imageState.name
                                    ? imageState.name
                                    : files?.[0]
                                      ? files?.[0].name
                                      : imageState.name,
                            })
                        }
                        className="w-full"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        name
                    </Label>
                    <Input
                        id="name"
                        value={imageState.name}
                        onChange={(e) =>
                            setImageState({
                                ...imageState,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
            </div>
            <Button
                className="relative"
                onClick={() => onCreate?.(imageState)}
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
