'use client'

import { CreateReservation, Spa } from '@/types/index'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { createContext, Suspense, useContext, useEffect } from 'react'
import { createReservation, getClosestReservations } from './actions'
import { toast } from 'sonner'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tabs } from '@radix-ui/react-tabs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { getSpas } from '../actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import ReservationEdit from '@/components/ReservationEdit'
import { AlertDialogFooter } from '@/components/ui/alert-dialog'
import Loader from '@/components/loader'

export const ReservationContext = createContext<{
    spas: {
        data: Spa[]
        isLoading: boolean
        isError: boolean
        error: any
        refetch: () => void
    }
}>({
    spas: {
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => {
            throw new Error(
                'refetch as to be called inside the ReservationContext.Provider'
            )
        },
    },
})

export const useReservationContext = () => {
    return useContext(ReservationContext)
}

export default function AvailabilityLayout({
    children,
}: React.PropsWithChildren<{}>) {
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const selectedTab = pathname.split('/').pop()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [createdReservation, setCreatedReservation] =
        React.useState<CreateReservation>()
    const {
        data: spas,
        isFetched: isSpaFetched,
        refetch,
        isError,
        error,
    } = useQuery({
        queryKey: ['spas'],
        queryFn: async () => {
            return await getSpas()
        },
    })
    const reservationCreateMutation = useMutation({
        mutationFn: async (reservation?: CreateReservation) => {
            if (!reservation) {
                return
            }
            if (!reservation.startAt || !reservation.endAt) {
                throw new Error('startAt and endAt are required')
            }
            if (reservation.spa === -1) {
                throw new Error('spa is required')
            }
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
            await refetch()
        },
    })

    return (
        <ReservationContext.Provider
            value={{
                spas: {
                    data: spas || [],
                    isLoading: !isSpaFetched,
                    isError: isError,
                    error: error,
                    refetch: refetch,
                },
            }}
        >
            <Tabs
                className="w-full flex justify-between"
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
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button variant="outline">+</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle>Create reservation</DialogTitle>
                            <DialogDescription>
                                create a new reservation and add it to the list
                            </DialogDescription>
                        </DialogHeader>
                        <ReservationEdit
                            getClostestReservations={async (date: string) =>
                                (await getClosestReservations(date))?.data!
                            }
                            spas={spas}
                            onChange={(data) => {
                                setCreatedReservation(data.reservation)
                            }}
                        />
                        <AlertDialogFooter>
                            <Button
                                className="relative"
                                onClick={() => {
                                    reservationCreateMutation.mutate(
                                        createdReservation
                                    )
                                }}
                                disabled={reservationCreateMutation.isPending}
                            >
                                <span
                                    className={
                                        reservationCreateMutation.isPending
                                            ? 'invisible'
                                            : 'visible'
                                    }
                                >
                                    Save change
                                </span>
                                {reservationCreateMutation.isPending ? (
                                    <div className="flex items-center justify-center absolute">
                                        <Loader size={'4'} />
                                    </div>
                                ) : (
                                    ''
                                )}
                            </Button>
                        </AlertDialogFooter>
                    </DialogContent>
                </Dialog>
            </Tabs>
            <Suspense
                fallback={
                    <div className="w-full h-full flex justify-center items-center">
                        <Loader />
                    </div>
                }
            >
                {children}
            </Suspense>
        </ReservationContext.Provider>
    )
}
