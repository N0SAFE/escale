'use client'

import { Reservation, Spa, UpdateReservation } from '@/types/index'
import React, { useEffect } from 'react'
import { getSpas } from '../../actions'
import { useWindowSize } from '@uidotdev/usehooks'
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { block } from 'million/react'
import {
    deleteReservation,
    getClosestReservations,
    updateReservation,
    getUnreservableData,
} from '../actions'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'
import { toast } from 'sonner'
import Combobox from '@/components/Combobox'
import ReservationEdit from '@/components/ReservationEdit'

const ReservationCalendarView = () => {
    console.log('render ReservationCalendarView')
    const queryClient = useQueryClient()
    const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date())
    const [selectedSpa, setSelectedSpa] = React.useState<Spa>()
    const [sheetIsOpen, setSheetIsOpen] = React.useState(false)
    const [selectedReservations, setSelectedReservations] = React.useState<{
        list: Reservation[]
        active?: Reservation
    }>()
    const [updatedReservation, setUpdatedReservation] = React.useState<{
        id: number
        reservation: UpdateReservation
    }>()

    // console.log('updatedReservation', updatedReservation)

    const { data: spas, isFetched: spaIsFetched } = useQuery({
        queryKey: ['spas'],
        queryFn: async () => {
            return await getSpas()
        },
    })

    const reservationUpdateMutation = useMutation({
        mutationFn: async ({
            id,
            reservation,
        }: {
            id: number
            reservation: UpdateReservation
        }) => {
            // console.log('reservation', id, reservation)
            if (!reservation) {
                return
            }
            return await updateReservation(id, reservation)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            queryClient.invalidateQueries({
                queryKey: ['reservations'],
            })
            toast.success('reservation updated')
            await refetch()
        },
    })
    const reservationDeleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await deleteReservation(id)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            queryClient.invalidateQueries({
                queryKey: ['reservations'],
            })
            toast.success('reservation deleted')
            setSheetIsOpen(false)
        },
    })

    const size = useWindowSize()
    const calendarSize = React.useMemo(
        () =>
            size.width! >= 640
                ? size.width! >= 1280
                    ? size.width! >= 1536
                        ? size.width! >= 1920
                            ? 5
                            : 4
                        : 3
                    : 2
                : 2,
        [size]
    )

    const { data: allReservations, refetch } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: [
            'reservations',
            selectedSpa?.id,
            selectedMonth.toISOString(),
        ],
        queryFn: async () => {
            return selectedSpa?.id
                ? await getUnreservableData(
                      selectedSpa?.id,
                      DateTime.fromJSDate(selectedMonth)
                          .minus({ month: 1 })
                          .toISODate()!,
                      DateTime.fromJSDate(selectedMonth)
                          .plus({
                              month: calendarSize + 1,
                          })
                          .toISODate()!
                  )
                : {
                      reservations: [],
                      blockedEvents: [],
                      reservedEvents: [],
                  }
        },
    })

    const { reservations, blockedEvents, reservedEvents } = allReservations || {
        reservations: [],
        blockedEvents: [],
        reservedEvents: [],
    }

    return (
        <Sheet
            open={sheetIsOpen}
            onOpenChange={() => setSheetIsOpen(!sheetIsOpen)}
        >
            <div className="w-full py-4 flex justify-center ">
                <Combobox
                    className="col-span-3"
                    items={spas?.map((spa) => ({
                        label: spa.title,
                        value: spa,
                    }))}
                    isLoading={!spaIsFetched}
                    defaultPreviewText="Select a spa..."
                    value={selectedSpa}
                    onSelect={(spa) => {
                        setSelectedSpa(spa)
                    }}
                />
            </div>
            <Calendar
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                mode="range"
                className="w-full overflow-hidden flex justify-center"
                selected={undefined}
                numberOfMonths={calendarSize}
                displayedRange={{
                    random: reservations?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
                        fromPortion: { portion: 2, index: 1 },
                        toPortion: { portion: 2, index: 1 },
                        item: a,
                    })),
                    randomColor: [
                        'blue',
                        'green',
                        'yellow',
                        'purple',
                        'orange',
                        'cyan',
                        'pink',
                    ],
                    red: reservedEvents?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
                        fromPortion: { portion: 2, index: 1 },
                        toPortion: { portion: 2, index: 1 },
                    })),
                    gray: blockedEvents?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
                        fromPortion: { portion: 2, index: 1 },
                        toPortion: { portion: 2, index: 1 },
                    })),
                    pickRandomColor: ({ item }) => {
                        return item.id
                    },
                }}
                onDisplayedRangeClick={(displayedReservations) => {
                    if (displayedReservations.length === 0) {
                        return
                    }
                    if (displayedReservations.length === 1) {
                        setSelectedReservations({
                            list: displayedReservations.map((a) => a.item),
                            active: displayedReservations[0].item,
                        })
                        setUpdatedReservation({
                            id: displayedReservations[0].item.id,
                            reservation: {
                                ...displayedReservations[0].item,
                                spa: displayedReservations[0].item.spaId,
                            },
                        })
                        setSheetIsOpen(true)
                        return
                    }
                    setUpdatedReservation({
                        id: displayedReservations[0].item.id,
                        reservation: {
                            ...displayedReservations[0].item,
                            spa: displayedReservations[0].item.spaId,
                        },
                    })
                    setSelectedReservations({
                        list: displayedReservations.map((a) => a.item),
                        active: displayedReservations[0].item,
                    })
                    setSheetIsOpen(true)
                    return
                }}
                triggerColorChangeOnHover
            />

            <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] h-screen flex flex-col justify-between">
                <div className="overflow-auto scrollbar-none">
                    <SheetHeader>
                        <SheetTitle>
                            Edit profile{' '}
                            {selectedReservations?.list?.map(
                                (reservation) => reservation?.id
                            )}
                        </SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </SheetDescription>
                    </SheetHeader>
                    <ReservationEdit
                        spas={spas}
                        isSpaLoading={!spaIsFetched}
                        selectedSpa={
                            updatedReservation?.reservation?.spa
                                ? spas?.find(
                                      (s) =>
                                          s.id ===
                                          updatedReservation?.reservation?.spa
                                  )
                                : undefined
                        }
                        getClostestReservations={async (
                            date: string,
                            avoidIds?: number[]
                        ) =>
                            (await getClosestReservations(date, { avoidIds }))!
                        }
                        defaultValues={selectedReservations?.active}
                        reservationsList={selectedReservations?.list}
                        onChange={(data) => {
                            setUpdatedReservation({
                                id: data.id!,
                                reservation: data.reservation,
                            })
                        }}
                    />
                </div>
                <SheetFooter className="flex sm:justify-between gap-4">
                    <Button
                        onClick={() => {
                            reservationDeleteMutation.mutate(
                                updatedReservation?.id!
                            )
                        }}
                        variant={'destructive'}
                    >
                        {reservationDeleteMutation.isPending ? (
                            <div className="relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Loader size="4" />
                                </div>
                                <span className="invisible">Delete</span>
                            </div>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                    <Button
                        onClick={() => {
                            reservationUpdateMutation.mutate({
                                id: updatedReservation?.id!,
                                reservation: updatedReservation?.reservation!,
                            })
                        }}
                        className="relative"
                    >
                        {reservationUpdateMutation.isPending ? (
                            <div className="relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Loader size="4" />
                                </div>
                                <span className="invisible">Save change</span>
                            </div>
                        ) : (
                            'Save change'
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default ReservationCalendarView
