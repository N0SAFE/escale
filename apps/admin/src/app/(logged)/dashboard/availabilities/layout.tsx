import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import React from 'react'
import { spaAccessor } from './utils'
import ClientLayout from './ClientLayout'

export default async function AvailabilityLayout({
    children,
}: React.PropsWithChildren<{}>) {
    // const queryClient = useQueryClient()

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['spas'],
        queryFn: spaAccessor,
    })

    // const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    // const [createdReservation, setCreatedReservation] =
    //     React.useState<CreateReservation>()
    // const [selectedSpaId] = useQueryState(querySpaId, parseAsInteger)

    // const defaultSelectedSpa = useMemo(() => {
    //     return spas?.find((spa) => spa.id === selectedSpaId)
    // }, [spas, selectedSpaId])

    // const reservationCreateMutation = useMutation({
    //     mutationFn: async (reservation?: CreateReservation) => {
    //         if (!reservation) {
    //             return
    //         }
    //         if (!reservation.startAt || !reservation.endAt) {
    //             throw new Error('startAt and endAt are required')
    //         }
    //         if (reservation.spa === -1) {
    //             throw new Error('spa is required')
    //         }
    //         return await createReservation(reservation)
    //     },
    //     onError: (error) => {
    //         toast.error(error.message)
    //     },
    //     onSuccess: async (data) => {
    //         toast.success('reservation created')
    //         setIsCreateDialogOpen(false)
    //         queryClient.invalidateQueries({
    //             queryKey: ['reservations'],
    //         })
    //         await refetch()
    //     },
    // })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex h-full w-full flex-col overflow-hidden">
                <ClientLayout>{children}</ClientLayout>
            </div>
        </HydrationBoundary>
    )
}
