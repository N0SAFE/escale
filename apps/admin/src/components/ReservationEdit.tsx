'use client'

import { Reservation, CreateReservation, Spa } from '@/types/index'
import React, { useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DateTime } from 'luxon'
import { Calendar } from './ui/calendar'
import { Label } from './ui/label'
import Combobox from './Combobox'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
    getClosestUnreservable,
    getReservations,
    getUnreservableData,
} from '@/app/(logged)/dashboard/reservations/actions'
import { getAvailableDates } from '@/app/(logged)/dashboard/actions'

export type ReservationEditProps = {
    onChange?: ({
        id,
        reservation,
    }: {
        id?: number
        reservation: CreateReservation
    }) => void
    defaultValues?: Reservation
    onMonthChange?: (month: Date) => void
    getClostestReservations?: (
        date: string,
        avoidIds?: number[]
    ) => Promise<{
        up: Reservation | undefined
        down: Reservation | undefined
    }>
    spas?: Spa[]
    isSpaLoading?: boolean
    selectedSpa?: Spa
    disabled?: (date: Date) => boolean
    reservationsList?: Reservation[]
}

export default function ReservationEdit({
    defaultValues,
    getClostestReservations,
    onMonthChange,
    onChange,
    spas,
    isSpaLoading,
    selectedSpa,
    disabled,
    reservationsList,
}: ReservationEditProps) {
    // Creates a new editor instance.
    const [selectedMonth, setSelectedMonth] = useState(
        defaultValues?.startAt
            ? DateTime.fromISO(defaultValues?.startAt, {
                  zone: 'utc',
              }).toJSDate()
            : DateTime.now()
                  .set({
                      day: 1,
                      hour: 0,
                      minute: 0,
                      second: 0,
                  })
                  .toJSDate()
    )
    const [defaultSelectedState, setDefaultSelectedState] = useState<
        Reservation | undefined
    >(defaultValues)
    const [reservationState, setReservationState] =
        React.useState<CreateReservation>({
            startAt: defaultValues?.startAt || '',
            endAt: defaultValues?.endAt || '',
            spa: defaultValues?.spaId || -1,
            notes: defaultValues?.notes || '',
        })
    const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>({
        from: defaultValues?.startAt
            ? DateTime.fromISO(defaultValues.startAt).toJSDate()
            : undefined,
        to: defaultValues?.endAt
            ? DateTime.fromISO(defaultValues.endAt).toJSDate()
            : undefined,
    })
    const firstDayOfTheMonth = DateTime.fromJSDate(selectedMonth).set({
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
    })
    const startAt = firstDayOfTheMonth.minus({
        day: 6,
    })
    const endAt = firstDayOfTheMonth
        .plus({ month: 1 })
        .set({
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
        })
        .plus({ day: 6 })

    const { data: allReservations, refetch } = useQuery({
        queryKey: ['reservations', reservationState?.spa, startAt.toISO()],
        queryFn: async () => {
            return reservationState?.spa
                ? await getUnreservableData(
                      reservationState?.spa,
                      startAt.toISODate()!,
                      endAt.toISODate()!
                  )
                : {
                      reservations: [],
                      blockedEvents: [],
                      reservedEvents: [],
                  }
        },
        enabled: !!reservationState?.spa,
    })

    const { reservations, reservedEvents } = allReservations || {
        reservations: [],
        reservedEvents: [],
    }

    const { data: closestUnreservableDate } = useQuery({
        queryKey: [
            'closestAllReservations',
            defaultSelectedState?.id,
            DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
        ],
        queryFn: async () => {
            const closestUnreservablilities = reservationState?.spa
                ? await getClosestUnreservable?.(
                      reservationState?.spa!,
                      DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
                      defaultSelectedState?.id != undefined
                          ? [defaultSelectedState?.id]
                          : undefined,
                      {
                          includeExternalReservedCalendarEvents: true,
                      }
                  )
                : {}

            return {
                past: closestUnreservablilities.past
                    ? DateTime.fromISO(closestUnreservablilities.past)
                    : undefined,
                future: closestUnreservablilities.future
                    ? DateTime.fromISO(closestUnreservablilities.future)
                    : undefined,
            }
        },
        enabled: !!rangeDate?.from,
    })

    const { data: availableDates } = useQuery({
        queryKey: [
            'availableDates',
            reservationState?.spa,
            startAt.toISODate(),
        ],
        queryFn: async () => {
            return reservationState?.spa
                ? new Map<
                      string,
                      Awaited<ReturnType<typeof getAvailableDates>>[number]
                  >(
                      await getAvailableDates(
                          reservationState?.spa,
                          startAt.toISODate()!,
                          endAt.toISODate()!,
                          {
                              includeExternalReservedCalendarEvents: true,
                              includeReservations: true,
                          }
                      ).then((r) => r.map((data) => [data.date, data]))
                  )
                : new Map<
                      string,
                      Awaited<ReturnType<typeof getAvailableDates>>[number]
                  >()
        },
        enabled: !!reservationState?.spa,
    })

    useEffect(() => {
        if (!rangeDate?.from && !rangeDate?.to) {
            setReservationState({
                ...reservationState,
                startAt: '',
                endAt: '',
            })
        }
        if (rangeDate?.to) {
            setReservationState({
                ...reservationState,
                startAt: DateTime.fromJSDate(rangeDate.from!).toISODate()!,
                endAt: DateTime.fromJSDate(rangeDate.to).toISODate()!,
            })
        } // eslint-disable-next-line
    }, [rangeDate])

    useEffect(() => {
        onChange?.({
            id: defaultSelectedState?.id,
            reservation: {
                ...reservationState,
            },
        }) // eslint-disable-next-line
    }, [reservationState, defaultSelectedState?.id])

    useEffect(() => {
        // check for intersection over a reservation and the start and end of the range date
        if (rangeDate?.from && rangeDate?.to) {
            const from = DateTime.fromJSDate(rangeDate?.from!).toISODate()!
            const to = DateTime.fromJSDate(rangeDate?.to!).toISODate()!
            const isIntersected = reservations?.some((reservation) => {
                // i want to check if the range intersect with an availability
                const start = DateTime.fromISO(reservation.startAt).toISODate()!
                const end = DateTime.fromISO(reservation.endAt).toISODate()!
                return (
                    ((from > start && from < end) ||
                        (to > start && to < end) ||
                        (from <= start && to >= end)) &&
                    reservation.id !== defaultSelectedState?.id
                )
            })
            if (isIntersected) {
                setRangeDate({
                    from: undefined,
                    to: undefined,
                })
                return
            }
            if (
                rangeDate?.from?.toISOString() === rangeDate?.to?.toISOString()
            ) {
                setRangeDate({
                    from: rangeDate?.from,
                    to: DateTime.fromJSDate(rangeDate?.from)
                        .plus({ day: 1 })
                        .toJSDate(),
                })
                return
            }
        } else if (rangeDate?.from) {
            const from = DateTime.fromJSDate(rangeDate?.from!).toISODate()!
            const isIntersected = reservations?.some((reservation) => {
                // i want to check if the range intersect with an availability
                if (reservation.id === defaultSelectedState?.id) {
                    return false
                }
                const start = DateTime.fromISO(reservation.startAt).toISODate()!
                const end = DateTime.fromISO(reservation.endAt).toISODate()!
                return from > start && from < end
            })
            if (isIntersected) {
                setRangeDate({
                    from: undefined,
                    to: undefined,
                })
                return
            }
            if (
                availableDates?.get(
                    DateTime.fromJSDate(rangeDate?.from).toISODate()!
                )?.partial === 'departure'
            ) {
                setRangeDate({
                    from: DateTime.fromJSDate(rangeDate?.from)
                        .minus({ day: 1 })
                        .toJSDate(),
                    to: rangeDate?.from,
                })
                return
            }
        }
    }, [rangeDate, reservations, defaultSelectedState?.id])

    return (
        <div className="grid gap-4 py-4  w-full">
            {reservationsList && reservationsList.length > 1 ? (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                        htmlFor="spa"
                        className="text-right whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        reservations list
                    </Label>
                    <Combobox
                        className="col-span-3"
                        items={reservationsList?.map((reservation) => ({
                            label:
                                reservation.startAt + ' - ' + reservation.endAt,
                            value: reservation,
                        }))}
                        isLoading={isSpaLoading || false}
                        defaultPreviewText="Select a reservation..."
                        value={reservationsList?.find(
                            (reservation) =>
                                reservation.id === defaultSelectedState?.id
                        )}
                        onSelect={(reservation?: Reservation) => {
                            if (!reservation) {
                                setRangeDate({
                                    from: undefined,
                                    to: undefined,
                                })
                                setReservationState({
                                    startAt: '',
                                    endAt: '',
                                    notes: '',
                                    spa: -1,
                                })
                                setDefaultSelectedState(undefined)
                                return
                            }
                            setRangeDate({
                                from: DateTime.fromISO(
                                    reservation.startAt
                                ).toJSDate(),
                                to: DateTime.fromISO(
                                    reservation.endAt
                                ).toJSDate(),
                            })
                            setReservationState({
                                startAt: reservation.startAt,
                                endAt: reservation.endAt,
                                notes: reservation.notes,
                                spa: reservation.spa.id,
                            })
                            setDefaultSelectedState(reservation)
                        }}
                    />
                </div>
            ) : undefined}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="spa" className="text-right hidden md:block">
                    spa
                </Label>
                <Combobox
                    className="md:col-span-3 col-span-4"
                    items={spas?.map((spa) => ({
                        label: spa.title,
                        value: spa,
                    }))}
                    isLoading={isSpaLoading || false}
                    defaultPreviewText="Select a spa..."
                    value={
                        reservationState.spa
                            ? spas?.find(
                                  (spa) => spa.id === reservationState.spa
                              )
                            : undefined
                    }
                    onSelect={(spa) => {
                        setReservationState({
                            ...reservationState,
                            spa: spa?.id || -1,
                        })
                    }}
                />
            </div>
            <div className="flex flex-col">
                <Calendar
                    fixedWeeks
                    mode="range"
                    month={selectedMonth}
                    onMonthChange={(month) => {
                        setSelectedMonth(month)
                        onMonthChange?.(month)
                    }}
                    className="w-full overflow-hidden flex justify-center"
                    selected={rangeDate}
                    onSelect={setRangeDate}
                    displayedRange={{
                        red: [
                            ...reservations
                                ?.filter((reservation) => {
                                    return (
                                        reservation.id !==
                                        defaultSelectedState?.id
                                    )
                                })
                                .map((reservation) => ({
                                    from: DateTime.fromISO(reservation.startAt),
                                    to: DateTime.fromISO(reservation.endAt),
                                    fromPortion: { portion: 2, index: 1 },
                                    toPortion: { portion: 2, index: 1 },
                                })),
                            ...(reservedEvents?.map((reservation) => ({
                                from: DateTime.fromISO(reservation.startAt),
                                to: DateTime.fromISO(reservation.endAt),
                                fromPortion: { portion: 2, index: 1 },
                                toPortion: { portion: 2, index: 1 },
                                item: reservation,
                            })) || []),
                        ],
                    }}
                    numberOfMonths={1}
                    disabled={(date) => {
                        return (
                            !availableDates?.get(
                                DateTime.fromJSDate(date).toISODate()!
                            )?.isAvailable ||
                            (closestUnreservableDate?.past
                                ? date < closestUnreservableDate.past.toJSDate()
                                : false) ||
                            (closestUnreservableDate?.future
                                ? date >
                                  closestUnreservableDate.future.toJSDate()
                                : false) ||
                            !reservationState?.spa ||
                            reservationState?.spa === -1 ||
                            disabled?.(date) ||
                            false
                        )
                    }}
                />
                <div className="flex flex-col items-center justify-center md:grid md:grid-cols-4 gap-4">
                    <Label htmlFor="spa" className="text-right">
                        notes
                    </Label>
                    <pre className="col-span-3 w-full p-[1px]">
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded-md bg-inherit"
                            value={reservationState.notes}
                            onChange={(e) => {
                                setReservationState({
                                    ...reservationState,
                                    notes: e.target.value,
                                })
                            }}
                        />
                    </pre>
                </div>
            </div>
        </div>
    )
}
