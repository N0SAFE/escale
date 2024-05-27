'use client'

import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { useMemo } from 'react'
import Combobox from '@/components/atomics/molecules/Combobox'
import { createImage, deleteImage, getImages } from '@/actions/Image/index'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Upload } from 'lucide-react'
import FileSelector from '../../molecules/FileSelector'
import { Image as ImageType } from '@/types/model/Image'
import Relations, {
    CreateReservation as CreateReservationType,
    Reservation,
    UpdateReservation,
} from '@/types/model/Reservation'
import { DateTime } from 'luxon'
import { DateRange } from 'react-day-picker'
import {
    getCalendarEvents,
    getClosestUnreservable,
} from '@/app/(logged)/dashboard/reservations/actions'
import { getAvailableDates } from '@/app/(logged)/dashboard/actions'
import { Spa } from '@/types/model/Spa'
import { Calendar } from '@/components/ui/calendar'
import { reservationsAccessor } from '@/app/(logged)/dashboard/reservations/utils'

type CreateReservationProps = {
    isLoading?: boolean
    isCreating?: boolean
    onCreate?: (data: CreateReservationType) => void
    state: {
        spas: Spa[]
        isSpaLoading?: boolean
        defaultSelectedSpaId?: number
    }
    disabled?: (date: Date) => boolean
}

export default function CreateReservation({
    isLoading,
    isCreating,
    onCreate,
    state: { spas, isSpaLoading, defaultSelectedSpaId },
    disabled,
}: CreateReservationProps) {
    const [selectedMonth, setSelectedMonth] = useState(
        DateTime.now()
            .set({
                day: 1,
                hour: 0,
                minute: 0,
                second: 0,
            })
            .toJSDate()
    )
    const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
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

    const [reservationState, setReservationState] =
        useState<CreateReservationType>({
            spaId: defaultSelectedSpaId || -1,
            startAt: '',
            endAt: '',
            notes: '',
        })

    const defaultSelectedSpa = useMemo(() => {
        return spas?.find((spa) => spa.id === reservationState.spaId)
    }, [spas, reservationState.spaId])

    const {
        refetch,
        data: [{ data: events }, { data: reservations }],
    } = useQueries({
        combine: (array) => {
            return {
                data: array,
                refetch: () => {
                    array.forEach((query) => {
                        query.refetch()
                    })
                },
            }
        },
        queries: [
            {
                placeholderData: keepPreviousData,
                queryKey: [
                    'events',
                    reservationState?.spaId,
                    selectedMonth.toISOString(),
                ],
                queryFn: async () => {
                    if (
                        !reservationState?.spaId ||
                        reservationState?.spaId === -1
                    ) {
                        return []
                    }
                    return getCalendarEvents(
                        reservationState?.spaId,
                        {
                            from: DateTime.fromJSDate(selectedMonth)
                                .minus({ month: 1 })
                                .toISODate()!,
                            to: DateTime.fromJSDate(selectedMonth)
                                .plus({ month: 1 })
                                .toISODate()!,
                        },
                        {
                            search: {
                                type: 'reserved',
                            },
                        }
                    )
                },
            },
            {
                placeholderData: keepPreviousData,
                queryKey: [
                    'reservations',
                    reservationState?.spaId,
                    selectedMonth.toISOString(),
                ],
                queryFn: async () => {
                    if (
                        !reservationState?.spaId ||
                        reservationState?.spaId === -1
                    ) {
                        return []
                    }
                    const reservations = await reservationsAccessor({
                        search: {
                            spaId: reservationState?.spaId,
                        },
                        dates: {
                            startAt: {
                                after: DateTime.fromJSDate(selectedMonth)
                                    .minus({ month: 1 })
                                    .toISODate()!,
                            },
                            endAt: {
                                before: DateTime.fromJSDate(selectedMonth)
                                    .plus({ month: 1 })
                                    .toISODate()!,
                            },
                        },
                    })
                    return reservations
                },
            },
        ],
    })

    const reservedEvents =
        events?.reduce<typeof events>(
            (acc, e) => [...acc, ...(e.type === 'reserved' ? [e] : [])],
            []
        ) || []

    const { data: closestUnreservableDate } = useQuery({
        queryKey: [
            'closestReservations',
            reservationState?.spaId,
            DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
        ],
        queryFn: async () => {
            const closestUnreservablilities = reservationState?.spaId
                ? await getClosestUnreservable?.(
                      reservationState?.spaId!,
                      DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
                      [],
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
            reservationState?.spaId,
            startAt.toISODate(),
        ],
        queryFn: async () => {
            return reservationState?.spaId
                ? new Map<
                      string,
                      Awaited<ReturnType<typeof getAvailableDates>>[number]
                  >(
                      await getAvailableDates(
                          reservationState?.spaId,
                          startAt.toISODate()!,
                          endAt.toISODate()!,
                          {
                              includeExternalReservedCalendarEvents: true,
                              includeReservations: true,
                              avoidIds: [],
                          }
                      ).then((r) => r.map((data) => [data.date, data]))
                  )
                : new Map<
                      string,
                      Awaited<ReturnType<typeof getAvailableDates>>[number]
                  >()
        },
        enabled: !!reservationState?.spaId,
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
        // check for intersection over a reservation and the start and end of the range date
        if (rangeDate?.from && rangeDate?.to) {
            const from = DateTime.fromJSDate(rangeDate?.from!).toISODate()!
            const to = DateTime.fromJSDate(rangeDate?.to!).toISODate()!
            const isIntersected = reservations?.some((reservation) => {
                // i want to check if the range intersect with an availability
                const start = DateTime.fromISO(reservation.startAt).toISODate()!
                const end = DateTime.fromISO(reservation.endAt).toISODate()!
                return (
                    (from > start && from < end) ||
                    (to > start && to < end) ||
                    (from <= start && to >= end)
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
    }, [rangeDate, reservations, reservationState, availableDates])

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex min-h-full flex-col justify-between gap-16">
            <div className="flex w-full flex-col gap-4 lg:gap-16">
                <div className="flex items-center gap-4">
                    <Label htmlFor="spa" className="hidden text-right md:block">
                        spa
                    </Label>
                    <Combobox
                        className="w-full"
                        items={spas?.map((spa) => ({
                            label: spa.title,
                            value: spa,
                        }))}
                        isLoading={isSpaLoading || false}
                        defaultPreviewText="Select a spa..."
                        defaultValue={defaultSelectedSpa}
                        value={
                            reservationState.spaId
                                ? spas?.find(
                                      (spa) => spa.id === reservationState.spaId
                                  )
                                : undefined
                        }
                        onSelect={(spa) => {
                            setReservationState({
                                ...reservationState,
                                spaId: spa?.id || -1,
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
                            // onMonthChange?.(month)
                        }}
                        className="flex w-full justify-center overflow-hidden"
                        selected={rangeDate}
                        onSelect={setRangeDate}
                        displayedRange={{
                            red: [
                                ...(reservations?.map((reservation) => ({
                                    from: DateTime.fromISO(reservation.startAt),
                                    to: DateTime.fromISO(reservation.endAt),
                                    fromPortion: { portion: 2, index: 1 },
                                    toPortion: { portion: 2, index: 1 },
                                })) || []),
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
                                    ? date <
                                      closestUnreservableDate.past.toJSDate()
                                    : false) ||
                                (closestUnreservableDate?.future
                                    ? date >
                                      closestUnreservableDate.future.toJSDate()
                                    : false) ||
                                !reservationState?.spaId ||
                                reservationState?.spaId === -1 ||
                                disabled?.(date) ||
                                false
                            )
                        }}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Label htmlFor="spa" className="text-right">
                        notes
                    </Label>
                    <pre className="w-full p-[1px]">
                        <textarea
                            className="h-32 w-full rounded-md border border-gray-300 bg-inherit p-2"
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
            <div className="flex w-full justify-between">
                <Button
                    className="relative"
                    onClick={() => onCreate?.(reservationState!)}
                    disabled={isCreating}
                >
                    <span className={isCreating ? 'invisible' : 'visible'}>
                        Save change
                    </span>
                    {isCreating ? (
                        <div className="absolute flex items-center justify-center">
                            <Loader size={'4'} />
                        </div>
                    ) : (
                        ''
                    )}
                </Button>
            </div>
        </div>
    )
}
