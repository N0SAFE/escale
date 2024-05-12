'use client'

import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SpaImage as SpaImageType, UpdateSpa } from '@/types/index'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUser, updateUser } from '@/actions/Users/index'
import { UpdateUser } from '@/types/model/User'
import { useParams } from '@/routes/hooks'
import { LoggedDashboardUsersIdEdit } from '@/routes/index'

export default function SpasEdit() {
    const [userState, setUserState] = useState<UpdateUser>()

    const params = useParams(LoggedDashboardUsersIdEdit)
    const { data: userData, isFetched: isUserFetched } = useQuery({
        queryKey: ['user', +params.userId],
        queryFn: async () => getUser(+params.userId),
    })
    const userMutation = useMutation({
        mutationFn: async (spaState: UpdateUser) => {
            return await updateUser(+params.userId, userState)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: (data) => {
            toast.success('user updated')
        },
    })

    useEffect(() => {
        setUserState(userData)
    }, [userData])

    return (
        <>
            <div
                className={cn(
                    'w-full h-full flex items-center justify-center',
                    !isUserFetched ? '' : 'hidden'
                )}
            >
                <Loader />
            </div>
            <div
                className={cn('w-full h-full', !isUserFetched ? 'hidden' : '')}
            >
                <Tabs
                    defaultValue="account"
                    className="w-[inherit] flex flex-col items-center h-full"
                >
                    <TabsList className="w-fit">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="availabilities">
                            Availabilities
                        </TabsTrigger>
                        <TabsTrigger value="reservations">
                            Reservations
                        </TabsTrigger>
                    </TabsList>
                    <div className="w-[inherit] pt-8 h-full">
                        <TabsContent
                            value="account"
                            className="flex items-center justify-between flex-col h-full"
                        >
                            <ScrollArea className="w-full h-full">
                                <div className="flex gap-4 justify-between w-full px-8">
                                    <div className="flex flex-col gap-4">
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="username">
                                                Username
                                            </Label>
                                            <Input
                                                value={userState?.username}
                                                onChange={(e) =>
                                                    setUserState({
                                                        ...userState,
                                                        username:
                                                            e.target.value,
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
                            </ScrollArea>
                            <div className="flex justify-end w-full">
                                <Button
                                    onClick={() =>
                                        userMutation.mutate(userState!)
                                    }
                                >
                                    Save
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="availabilities">
                            Change availabilities here.
                        </TabsContent>
                        <TabsContent value="reservations">
                            Change reservations here.
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </>
    )
}
