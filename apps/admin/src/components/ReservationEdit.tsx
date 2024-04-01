'use client'

import { Reservation, CreateReservation, Spa } from '@/types/index'
import React, { useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DateTime } from 'luxon'
import { Calendar } from './ui/calendar'
import { Label } from './ui/label'
import Combobox from './Combobox'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getReservations } from '@/app/(logged)/dashboard/reservations/actions'

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
            : new Date()
    )
    const [defaultSelectedState, setDefaultSelectedState] = useState<
        Reservation | undefined
    >(defaultValues)
    const [reservationState, setReservationState] =
        React.useState<CreateReservation>({
            startAt: defaultValues?.startAt || '',
            endAt: defaultValues?.endAt || '',
            spa: defaultValues?.spa?.id || -1,
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
    const startAt = DateTime.fromJSDate(selectedMonth, { zone: 'utc' }).set({
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    })
    const endAt = startAt.plus({ month: 3 }).minus({ day: 1 })

    const { data: reservations } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: [
            'reservations',
            selectedMonth.toUTCString(),
            { range: { before: 2, after: 2, spa: reservationState?.spa } },
        ],
        queryFn: async () => {
            if (!reservationState?.spa || reservationState?.spa === -1) return
            return getReservations({
                groups: ['reservations:spa'],
                search: {
                    spa: reservationState?.spa,
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
            })
        },
        enabled: !!reservationState?.spa,
    })

    const { data: closestReservations } = useQuery({
        queryKey: [
            'closestReservations',
            DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
        ],
        queryFn: async () => {
            console.log(
                'get closest reservations',
                DateTime.fromJSDate(rangeDate?.from!).toISODate()!
            )
            return await getClostestReservations?.(
                DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
                defaultSelectedState?.id != undefined
                    ? [defaultSelectedState?.id]
                    : undefined
            )
        },
        enabled: !!rangeDate?.from,
    })

    console.log('closestReservations', closestReservations)

    const reservationDates = React.useMemo(() => {
        if (!reservations) {
            return {
                up: undefined,
                down: undefined,
                set: new Set<string>(),
            }
        }
        const numberOfDays = endAt.diff(startAt, 'days').days + 1
        const array = Array.from({ length: numberOfDays }, (_, i) => {
            const date = startAt.plus({ days: i })
            let hasStart = false
            let hasEnd = false
            // console.log(date.toISODate())

            for (const reservation of reservations) {
                // console.log(reservation)
                if (reservation.id === defaultSelectedState?.id) {
                    // console.log('defaultSelectedState (true)')
                    return {
                        date: date,
                        available: false,
                    }
                }
                if (
                    date.toISODate() ==
                    DateTime.fromISO(reservation.startAt, {
                        zone: 'utc',
                    }).toISODate()
                ) {
                    hasStart = true
                }
                if (
                    date.toISODate() ==
                    DateTime.fromISO(reservation.endAt, {
                        zone: 'utc',
                    }).toISODate()
                ) {
                    hasEnd = true
                }
                if (hasStart && hasEnd) {
                    // console.log('hasStart && hasEnd (false)')
                    return {
                        date: date,
                        available: true,
                    }
                }
                if (
                    date >
                        DateTime.fromISO(reservation.startAt, {
                            zone: 'utc',
                        }) &&
                    date <
                        DateTime.fromISO(reservation.endAt, {
                            zone: 'utc',
                        })
                ) {
                    // console.log('date > startAt && date < endAt (false)')
                    return {
                        date: date,
                        available: true,
                    }
                }
            }

            // console.log('not found (false)')
            return {
                date: date,
                available: false,
            }
        })
        if (rangeDate?.from) {
            return {
                up:
                    closestReservations?.down &&
                    closestReservations?.down.id !== defaultSelectedState?.id
                        ? DateTime.fromISO(
                              closestReservations?.down.startAt
                          ).toJSDate()!
                        : undefined,
                down:
                    closestReservations?.up &&
                    closestReservations?.up.id !== defaultSelectedState?.id
                        ? DateTime.fromISO(
                              closestReservations?.up.endAt
                          ).toJSDate()!
                        : undefined,
                set: array.reduce((acc, date) => {
                    if (date.available) {
                        acc.add(date.date.toISODate()!)
                    }
                    return acc
                }, new Set<string>()),
            }
        }
        return {
            up: undefined,
            down: undefined,
            set: array.reduce((acc, date) => {
                if (date.available) {
                    acc.add(date.date.toISODate()!)
                }
                return acc
            }, new Set<string>()),
        } // eslint-disable-next-line
    }, [reservations, rangeDate, defaultSelectedState, closestReservations])

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
            }
        }
    }, [rangeDate, reservations, defaultSelectedState?.id])

    console.log('notes', reservationState.notes)

    console.log(reservationDates)

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
                        onSelect={(reservation) => {
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
                <Label htmlFor="spa" className="text-right">
                    spa
                </Label>
                <Combobox
                    className="col-span-3"
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
            <div className="flex flex-row md:flex-col">
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
                        red: reservations
                            ?.filter((reservation) => {
                                return (
                                    reservation.id !== defaultSelectedState?.id
                                )
                            })
                            .map((reservation) => ({
                                from: DateTime.fromISO(reservation.startAt),
                                to: DateTime.fromISO(reservation.endAt),
                                fromPortion: { portion: 2, index: 1 },
                                toPortion: { portion: 2, index: 1 },
                                item: reservation,
                            })),
                    }}
                    numberOfMonths={1}
                    disabled={(date) => {
                        return (
                            reservationDates.set.has(
                                DateTime.fromJSDate(date).toSQLDate() as string
                            ) ||
                            (reservationDates.down
                                ? date < reservationDates.down
                                : false) ||
                            (reservationDates.up
                                ? date > reservationDates.up
                                : false) ||
                            !reservationState?.spa ||
                            reservationState?.spa === -1 ||
                            disabled?.(date) ||
                            false
                        )
                    }}
                />
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="spa" className="text-right">
                        notes
                    </Label>
                    <pre className="col-span-3">
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
