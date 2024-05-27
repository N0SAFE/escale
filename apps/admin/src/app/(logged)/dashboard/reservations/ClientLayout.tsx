'use client'

import Loader from '@/components/atomics/atoms/Loader'
import React, { Suspense } from 'react'
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import CreateReservation from '@/components/atomics/templates/Create/CreateReservation'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { createReservation } from './actions'
import { toast } from 'sonner'
import { querySpaId, spaAccessor } from './utils'
import { CreateReservation as CreateReservationType } from '@/types/model/Reservation'
import { parseAsInteger, useQueryState } from 'nuqs'
import { Button } from '@/components/ui/button'

export default function ClientLayout({
    children,
}: React.PropsWithChildren<{}>) {
    const queryClient = new QueryClient()
    const pathname = usePathname()
    const selectedTab = pathname.split('/').pop()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [selectedSpaId] = useQueryState(querySpaId, parseAsInteger)
    const {
        data: spas,
        isFetched: isSpaFetched,
        isError,
    } = useQuery({
        queryKey: ['spas'],
        queryFn: async () => {
            return await spaAccessor()
        },
    })
    const reservationCreateMutation = useMutation({
        mutationFn: async (reservation?: CreateReservationType) => {
            if (!reservation) {
                return
            }
            if (!reservation.startAt || !reservation.endAt) {
                throw new Error('startAt and endAt are required')
            }
            if (reservation.spaId === -1) {
                throw new Error('spa is required')
            }
            console.log(reservation)
            return await createReservation(reservation)
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: async (data) => {
            toast.success('reservation created')
            setIsCreateDialogOpen(false)
            queryClient.invalidateQueries({
                queryKey: ['reservations'],
            })
        },
    })
    return (
        <div className="flex h-[-webkit-fill-available] flex-col gap-4">
            <Tabs
                className="flex w-full justify-between"
                value={selectedTab || 'calendar'}
            >
                <Button variant="outline" className="invisible">
                    +
                </Button>
                <TabsList className="w-fit">
                    <Link href="/dashboard/reservations/calendar">
                        <TabsTrigger value="calendar">calendar</TabsTrigger>
                    </Link>
                    <Link href="/dashboard/reservations/list">
                        <TabsTrigger value="list">list</TabsTrigger>
                    </Link>
                </TabsList>
                <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    +
                </Button>
            </Tabs>
            <Suspense
                fallback={
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader />
                    </div>
                }
            >
                <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
                    {children}
                </div>
            </Suspense>
            <CreateDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <CreateReservation
                    isCreating={reservationCreateMutation.isPending}
                    onCreate={(data) => reservationCreateMutation.mutate(data)}
                    state={{
                        spas: spas!,
                        defaultSelectedSpaId: selectedSpaId!,
                    }}
                />
            </CreateDialog>
        </div>
    )
}
