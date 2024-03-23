'use client'

import { Reservation, Spa, UpdateReservation } from '@/types/index'
import React from 'react'
import { getSpas } from '../../actions'
import { useWindowSize } from '@uidotdev/usehooks'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { block } from 'million/react'
import {
    deleteReservation,
    getReservations,
    getClosestReservations,
    updateReservation,
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
    const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date())
    const [selectedSpa, setSelectedSpa] = React.useState<Spa>()
    const [sheetIsOpen, setSheetIsOpen] = React.useState(false)
    const [selectedReservation, setSelectedReservation] =
        React.useState<Reservation>()
    const [updatedReservation, setUpdatedReservation] = React.useState<{
        id: number
        reservation: UpdateReservation
    }>()

    const { data: spas, isFetched: isSpaFetched } = useQuery({
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
            if (!reservation) {
                return
            }
            return await updateReservation(id, reservation)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
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
            toast.success('reservation deleted')
            setSheetIsOpen(false)
            await refetch()
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

    const {
        data: reservations,
        error,
        isFetched,
        refetch,
    } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: ['reservations', selectedMonth.toISOString(), selectedSpa],
        queryFn: async () =>
            selectedSpa
                ? await getReservations({
                      groups: ['reservations:spa'],
                      search: {
                          spa: selectedSpa?.id,
                      },
                      dates: {
                          endAt: {
                              after: selectedMonth
                                  ? DateTime.fromJSDate(selectedMonth)
                                        .minus({ month: 1 })
                                        .toISODate()!
                                  : undefined,
                          },
                          startAt: {
                              before: selectedMonth
                                  ? DateTime.fromJSDate(selectedMonth)
                                        .plus({
                                            month: calendarSize + 1,
                                        })
                                        .toISODate()!
                                  : undefined,
                          },
                      },
                  })
                : [],
    })

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
                    isLoading={!isSpaFetched}
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
                        item: a,
                        onClick: (reservations: Reservation) => {
                            setSelectedReservation(reservations)
                            setSheetIsOpen(true)
                        },
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
                    pickRandomColor: ({ item }) => {
                        return item.id
                    },
                }}
            />
            <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] h-screen flex flex-col justify-between">
                <div>
                    <SheetHeader>
                        <SheetTitle>
                            Edit profile {selectedReservation?.id}
                        </SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </SheetDescription>
                    </SheetHeader>
                    <ReservationEdit
                        spas={spas}
                        isSpaLoading={!isSpaFetched}
                        selectedSpa={
                            updatedReservation?.reservation?.spa
                                ? spas?.find(
                                      (s) =>
                                          s.id ===
                                          updatedReservation?.reservation?.spa
                                  )
                                : undefined
                        }
                        getClostestReservations={async (date: string) =>
                            (await getClosestReservations(date))?.data!
                        }
                        defaultValues={selectedReservation}
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
