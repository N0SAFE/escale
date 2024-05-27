'use client'

import { CreateAvailability as CreateAvailabilityType } from '@/types/model/Availability'
import { Spa } from '@/types/model/Spa'
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import React, {
    createContext,
    Suspense,
    useContext,
    useEffect,
    useMemo,
} from 'react'
import {
    createAvailability,
    deleteAvailability,
    getAvailabilities,
    getClosestAvailabilities,
    updateAvailability,
} from '@/actions/Availability'
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
import { AlertDialogFooter } from '@/components/ui/alert-dialog'
import Loader from '@/components/atomics/atoms/Loader'
import { DateTime } from 'luxon'
import { parseAsInteger, useQueryState } from 'nuqs'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import CreateAvailability from '@/components/atomics/templates/Create/CreateAvailability'

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

export default function ClientLayout({
    children,
}: React.PropsWithChildren<{}>) {
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const selectedTab = pathname.split('/').pop()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [createdAvailability, setCreatedAvailability] =
        React.useState<CreateAvailabilityType>()
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
        mutationFn: async (availability?: CreateAvailabilityType) => {
            if (!availability) {
                return
            }
            if (!availability.startAt || !availability.endAt) {
                throw new Error('startAt and endAt are required')
            }
            if (availability.spaId === -1) {
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
            <div className="flex h-[-webkit-fill-available] flex-col gap-4">
                <Tabs
                    className="flex w-full justify-between"
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
                    {children}
                </Suspense>
                <CreateDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <CreateAvailability
                        isCreating={availabilityCreateMutation.isPending}
                        onCreate={(data) =>
                            availabilityCreateMutation.mutate(data)
                        }
                        state={{
                            spas: spas!,
                            defaultSelectedSpaId: selectedSpaId!,
                        }}
                    />
                </CreateDialog>
            </div>
        </AvailabilityContext.Provider>
    )
}
