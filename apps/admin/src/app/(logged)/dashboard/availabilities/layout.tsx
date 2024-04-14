'use client'

import {
    Availability,
    CreateAvailability,
    Spa,
    UpdateAvailability,
} from '@/types/index'
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import React, { createContext, Suspense, useContext, useEffect, useMemo } from 'react'
import {
    createAvailability,
    deleteAvailability,
    getAvailabilities,
    getClosestAvailabilities,
    updateAvailability,
} from './actions'
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
import AvailabilityEdit from '@/components/atomics/templates/AvailabillityEdit'
import { AlertDialogFooter } from '@/components/ui/alert-dialog'
import Loader from '@/components/atomics/atoms/Loader'
import { DateTime } from 'luxon'
import { parseAsInteger, useQueryState } from 'nuqs'

export const AvailabilityContext = createContext<{
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
                'refetch as to be called inside the AvailabilityContext.Provider'
            )
        },
    },
})

export const useAvailabilityContext = () => {
    return useContext(AvailabilityContext)
}

export const querySpaId = 'spaId'

export default function AvailabilityLayout({
    children,
}: React.PropsWithChildren<{}>) {
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const selectedTab = pathname.split('/').pop()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [createdAvailability, setCreatedAvailability] =
        React.useState<CreateAvailability>()
    const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date())
    const [selectedSpaId] = useQueryState(querySpaId, parseAsInteger)
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
    
    const defaultSelectedSpa = useMemo(() => {
        return spas?.find((spa) => spa.id === selectedSpaId)
    }, [spas, selectedSpaId])
    
    const availabilityCreateMutation = useMutation({
        mutationFn: async (availability?: CreateAvailability) => {
            if (!availability) {
                return
            }
            if (!availability.startAt || !availability.endAt) {
                throw new Error('startAt and endAt are required')
            }
            if (availability.spa === -1) {
                throw new Error('spa is required')
            }
            return await createAvailability(availability)
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: async (data) => {
            toast.success('availability created')
            setIsCreateDialogOpen(false)
            queryClient.invalidateQueries({
                queryKey: ['availabilities'],
            })
            await refetch()
        },
    })
    // console.log(createdAvailability?.spa)
    const { data: availabilities, isFetched } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: [
            'availabilities',
            selectedMonth.toUTCString(),
            { range: { before: 2, after: 2, spa: createdAvailability?.spa } },
        ],
        queryFn: async () =>
            getAvailabilities({
                groups: ['availabilities:spa'],
                search: {
                    spa: createdAvailability?.spa,
                },
                dates: {
                    startAt: {
                        after: DateTime.fromJSDate(selectedMonth)
                            .minus({ months: 2 })
                            .toISODate()!,
                    },
                    endAt: {
                        before: DateTime.fromJSDate(selectedMonth)
                            .plus({ months: 2 })
                            .toISODate()!,
                    },
                },
            }),
        enabled: !!createdAvailability?.spa,
    })
    useEffect(() => {
        setSelectedMonth(new Date())
    }, [isCreateDialogOpen])

    return (
        <AvailabilityContext.Provider
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
                    <Link href="/dashboard/availabilities/calendar">
                        <TabsTrigger value="calendar">calendar</TabsTrigger>
                    </Link>
                    <Link href="/dashboard/availabilities/list">
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
                    <DialogContent className="sm:max-w-[800px] h-full">
                        <div className="overflow-auto scrollbar-none">
                            <DialogHeader>
                                <DialogTitle>Create availability</DialogTitle>
                                <DialogDescription>
                                    create a new availability and add it to the
                                    list
                                </DialogDescription>
                            </DialogHeader>
                            <AvailabilityEdit
                                getClostestAvailabilities={async (
                                    date: string
                                ) =>
                                    (await getClosestAvailabilities(date))
                                        ?.data!
                                }
                                onMonthChange={setSelectedMonth}
                                spas={spas}
                                onChange={(data) => {
                                    setCreatedAvailability(data.availability)
                                }}
                                defaultSelectedSpa={defaultSelectedSpa}
                            />
                        </div>
                        <AlertDialogFooter>
                            <Button
                                className="relative"
                                onClick={() => {
                                    availabilityCreateMutation.mutate(
                                        createdAvailability
                                    )
                                }}
                                disabled={availabilityCreateMutation.isPending}
                            >
                                <span
                                    className={
                                        availabilityCreateMutation.isPending
                                            ? 'invisible'
                                            : 'visible'
                                    }
                                >
                                    Save change
                                </span>
                                {availabilityCreateMutation.isPending ? (
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
        </AvailabilityContext.Provider>
    )
}
