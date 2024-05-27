import { UpdateUser, User } from '@/types/model/User'
import { useEffect, useState } from 'react'
import Loader from '@/components/atomics/atoms/Loader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type EditUserProps<T extends User> = {
    isLoading?: boolean
    isUpdating?: boolean
    onEdit?: (data: UpdateUser) => void
    onDelete?: (id: T) => void
    defaultValue: T
}

export default function EditUser<T extends User>({
    isUpdating,
    isLoading,
    onEdit,
    onDelete,
    defaultValue,
}: EditUserProps<T>) {
    const [userState, setUserState] = useState<UpdateUser>()

    useEffect(() => {
        setUserState(defaultValue)
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
            <div className="flex w-full justify-between gap-4 px-8">
                <div className="flex flex-col gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            value={userState?.username}
                            onChange={(e) =>
                                setUserState({
                                    ...userState,
                                    username: e.target.value,
                                })
                            }
                            id="username"
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={userState?.email}
                            onChange={(e) =>
                                setUserState({
                                    ...userState,
                                    email: e.target.value,
                                })
                            }
                            id="email"
                        />
                    </div>
                </div>
                <div>
                    {/* <div className="flex flex-col w-full">
                                            <Label htmlFor="description">
                                                description
                                            </Label>
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
                                                value={spaState?.spaImages?.map(
                                                    (i) => i.image
                                                )}
                                                onSelect={(images) =>
                                                    onImageSelect(
                                                        images.map(function (
                                                            i
                                                        ) {
                                                            return i.id
                                                        })
                                                    )
                                                }
                                                keepOpen
                                                onRender={(val) => {
                                                    return (
                                                        <span>
                                                            <ApiImage
                                                                identifier={
                                                                    val.id
                                                                }
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
                                                    values={
                                                        spaState?.spaImages ||
                                                        []
                                                    }
                                                    onReorder={handleReorder}
                                                    layoutScroll
                                                >
                                                    {spaState?.spaImages?.map(
                                                        (item, index) => (
                                                            <Reorder.Item
                                                                value={item}
                                                                key={item.id}
                                                            >
                                                                <div
                                                                    data-id={
                                                                        index
                                                                    }
                                                                    style={{
                                                                        cursor: 'grab',
                                                                    }}
                                                                >
                                                                    {renderItem(
                                                                        item
                                                                    )}
                                                                </div>
                                                            </Reorder.Item>
                                                        )
                                                    )}
                                                </Reorder.Group>
                                            </ScrollArea>
                                        </div> */}
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
                    onClick={() => onEdit?.(userState!)}
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
