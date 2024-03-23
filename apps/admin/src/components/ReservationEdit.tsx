'use client'

import { Reservation, CreateReservation, Spa } from '@/types/index'
import React, { useEffect, useState } from 'react'
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
    displayedRange?: {
        blue: {
            from: Date
            to: Date
            item: Reservation
            onClick: (item: Reservation) => void
        }[]
        yellow: {
            from: Date
            to: Date
            item: Reservation
            onClick: (item: Reservation) => void
        }[]
        green: {
            from: Date
            to: Date
            item: Reservation
            onClick: (item: Reservation) => void
        }[]
        red: {
            from: Date
            to: Date
            item: Reservation
            onClick: (item: Reservation) => void
        }[]
    }
    onMonthChange?: (month: Date) => void
    getClostestReservations?: (date: string) => Promise<{
        up: Reservation | undefined
        down: Reservation | undefined
    }>
    spas?: Spa[]
    isSpaLoading?: boolean
    selectedSpa?: Spa
    disabled?: (date: Date) => boolean
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
}: ReservationEditProps) {
    const [selectedMonth, setSelectedMonth] = useState(
        defaultValues?.startAt
            ? DateTime.fromISO(defaultValues?.startAt, {
                  zone: 'utc',
              }).toJSDate()
            : new Date()
    )
    const [reservationState, setReservationState] =
        React.useState<CreateReservation>({
            startAt: defaultValues?.startAt || '',
            endAt: defaultValues?.endAt || '',
            spa: defaultValues?.spa?.id || -1,
        })
    const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>({
        from: defaultValues?.startAt
            ? DateTime.fromISO(defaultValues.startAt).toJSDate()
            : undefined,
        to: defaultValues?.endAt
            ? DateTime.fromISO(defaultValues.endAt).toJSDate()
            : undefined,
    })
    const [reservationDates, setReservationDates] = React.useState<{
        up: Date | undefined
        down: Date | undefined
        set: Set<string>
    }>({
        up: undefined,
        down: undefined,
        set: new Set<string>(),
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
        queryFn: async () =>
            reservationState?.spa && reservationState?.spa !== -1
                ? getReservations({
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
                : undefined,
        enabled: !!reservationState?.spa,
    })

    useEffect(() => {
        if (!reservations) {
            setReservationDates({
                up: undefined,
                down: undefined,
                set: new Set<string>(),
            })
            return
        }
        const numberOfDays = endAt.diff(startAt, 'days').days + 1
        const array = Array.from({ length: numberOfDays }, (_, i) => {
            const date = startAt.plus({ days: i })

            const reservation = reservations.find((reservation) => {
                // check if the date is between the start and end of the reservation
                return (
                    date >=
                        DateTime.fromISO(reservation.startAt, {
                            zone: 'utc',
                        }) &&
                    date <= DateTime.fromISO(reservation.endAt, { zone: 'utc' })
                )
            })

            if (reservation?.id === defaultValues?.id) {
                return {
                    date: date,
                    available: false,
                }
            }

            return {
                date: date,
                available: !!reservation,
            }
        })
        if (rangeDate?.from) {
            getClostestReservations?.(
                DateTime.fromJSDate(rangeDate?.from!).toISODate()!
            ).then(function (closestReservations) {
                setReservationDates({
                    up:
                        closestReservations?.down &&
                        closestReservations?.down.id !== defaultValues?.id
                            ? DateTime.fromISO(
                                  closestReservations?.down.startAt,
                                  {
                                      zone: 'utc',
                                  }
                              ).toJSDate()!
                            : undefined,
                    down:
                        closestReservations?.up &&
                        closestReservations?.up.id !== defaultValues?.id
                            ? DateTime.fromISO(closestReservations?.up.endAt, {
                                  zone: 'utc',
                              }).toJSDate()!
                            : undefined,
                    set: array.reduce((acc, date) => {
                        if (date.available) {
                            acc.add(date.date.toISODate()!)
                        }
                        return acc
                    }, new Set<string>()),
                })
            })
            return
        }
        setReservationDates({
            up: undefined,
            down: undefined,
            set: array.reduce((acc, date) => {
                if (date.available) {
                    acc.add(date.date.toISODate()!)
                }
                return acc
            }, new Set<string>()),
        })
        return
        // eslint-disable-next-line
    }, [reservations, rangeDate?.from, defaultValues])

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
            id: defaultValues?.id,
            reservation: {
                ...reservationState,
            },
        }) // eslint-disable-next-line
    }, [reservationState, defaultValues?.id])

    return (
        <div className="grid gap-4 py-4  w-full">
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
                        setRangeDate(undefined)
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
                                return reservation.id !== defaultValues?.id
                            })
                            .map((reservation) => ({
                                from: DateTime.fromISO(reservation.startAt),
                                to: DateTime.fromISO(reservation.endAt),
                                item: reservation,
                                onClick: function (item: Reservation) {
                                    setRangeDate({
                                        from: DateTime.fromISO(
                                            item.startAt
                                        ).toJSDate(),
                                        to: DateTime.fromISO(
                                            item.endAt
                                        ).toJSDate(),
                                    })
                                },
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
            </div>
        </div>
    )
}
