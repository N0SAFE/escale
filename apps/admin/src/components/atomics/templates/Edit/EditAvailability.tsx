'use client'

import { Availability as AvailabilityType } from '@/types/model/Availability'
import { Spa } from '@/types/model/Spa'
import { days } from '@/types/utils'
import React, { useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DateTime, Info } from 'luxon'
import { Input } from '../../../ui/input'
import { Calendar } from '../../../ui/calendar'
import { Label } from '../../../ui/label'
import Combobox from '../../molecules/Combobox'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
    getAvailabilities,
    getClosestAvailabilities,
} from '@/actions/Availability'
import { UpdateAvailability } from '@/types/model/Availability'
import Loader from '../../atoms/Loader'
import { Button } from '@/components/ui/button'

export type EditAvailabilityProps<T extends AvailabilityType> = {
    isLoading?: boolean
    isUpdating?: boolean
    onEdit?: (data: UpdateAvailability) => void
    onDelete?: (id: T) => void
    defaultValue: T
    state: {
        spas: Spa[]
        isSpaLoading?: boolean
    }
    disabled?: (date: Date) => boolean
}

export default function EditAvailability<T extends AvailabilityType>({
    isLoading,
    isUpdating,
    onEdit,
    onDelete,
    defaultValue,
    state: { spas, isSpaLoading },
    disabled,
}: EditAvailabilityProps<T>) {
    const [selectedMonth, setSelectedMonth] = useState(
        defaultValue?.startAt
            ? DateTime.fromISO(defaultValue?.startAt, {
                  zone: 'utc',
              }).toJSDate()
            : new Date()
    )
    const daysNameInLocale = Info.weekdays('short')
    const [availabilityState, setAvailabilityState] =
        React.useState(defaultValue)
    const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>({
        from: defaultValue?.startAt
            ? DateTime.fromISO(defaultValue.startAt).toJSDate()
            : undefined,
        to: defaultValue?.endAt
            ? DateTime.fromISO(defaultValue.endAt).toJSDate()
            : undefined,
    })
    const [availableDates, setAvailableDates] = React.useState<Set<string>>(
        new Set<string>()
    )
    const startAt = DateTime.fromJSDate(selectedMonth, { zone: 'utc' }).set({
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    })
    const endAt = startAt.plus({ month: 3 }).minus({ day: 1 })
    const defaultSelectedSpa = useMemo(() => {
        return spas?.find((spa) => spa.id === availabilityState.spaId)
    }, [spas, availabilityState.spaId])

    const { data: availabilities } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: [
            'availabilities',
            selectedMonth.toUTCString(),
            { range: { before: 2, after: 2, spaId: availabilityState?.spaId } },
        ],
        queryFn: async () =>
            getAvailabilities({
                groups: ['availabilities:spa'],
                search: {
                    spaId: availabilityState?.spaId,
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
        enabled: !!availabilityState?.spaId,
    })

    const { data: closestAvailabiltyDates } = useQuery({
        queryKey: [
            'closestAvailabiltyDates',
            availabilityState?.spaId,
            DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
        ],
        queryFn: async () => {
            const closestAvailabilty = availabilityState?.spaId
                ? await getClosestAvailabilities?.(
                      availabilityState?.spaId!,
                      DateTime.fromJSDate(rangeDate?.from!).toISODate()!,
                      []
                  )
                : undefined

            return {
                past: closestAvailabilty?.past
                    ? DateTime.fromISO(closestAvailabilty.past.endAt)
                    : undefined,
                future: closestAvailabilty?.future
                    ? DateTime.fromISO(closestAvailabilty.future.startAt)
                    : undefined,
            }
        },
        enabled: !!rangeDate?.from,
    })

    const availabilitiesDuration = availabilities?.map((availability) => {
        const startAt = DateTime.fromISO(availability.startAt)
        const endAt = DateTime.fromISO(availability.endAt)
        const diff = endAt.diff(startAt, 'days')
        const betweenDate = Array.from({ length: diff.days - 1 }, (_, i) =>
            startAt.plus({ days: i + 1 })
        )
        return {
            startAt,
            endAt,
            betweenDate,
            id: availability.id,
        }
    })

    const selectedDay = React.useMemo((): Set<(typeof days)[number]> => {
        if (rangeDate) {
            const from = DateTime.fromJSDate(rangeDate.from!)

            if (rangeDate.to) {
                const diff = DateTime.fromJSDate(rangeDate.to).diff(
                    from,
                    'days'
                )
                const daysInRange = Array.from(
                    { length: diff.days + 1 },
                    (_, i) =>
                        from
                            .plus({ days: i })
                            .setLocale('en-GB')
                            .weekdayShort?.toLowerCase()
                )
                return new Set(daysInRange as (typeof days)[number][])
            }
            return new Set([
                from?.setLocale('en-GB')?.weekdayShort?.toLowerCase(),
            ] as (typeof days)[number][])
        }
        return new Set()
    }, [rangeDate])

    useEffect(() => {
        if (!availabilities) {
            setAvailableDates(new Set<string>())
            return
        }
        const numberOfDays = endAt.diff(startAt, 'days').days + 1
        const array = Array.from({ length: numberOfDays }, (_, i) => {
            const date = startAt.plus({ days: i })

            const availability = availabilities.find((availability) => {
                // check if the date is between the start and end of the availability
                return (
                    date >=
                        DateTime.fromISO(availability.startAt, {
                            zone: 'utc',
                        }) &&
                    date <=
                        DateTime.fromISO(availability.endAt, { zone: 'utc' })
                )
            })

            if (availability?.id === defaultValue?.id) {
                return {
                    date: date,
                    available: false,
                }
            }

            return {
                date: date,
                available: !!availability,
            }
        })
        if (rangeDate?.from) {
            setAvailableDates(
                array.reduce((acc, date) => {
                    if (date.available) {
                        acc.add(date.date.toISODate()!)
                    }
                    return acc
                }, new Set<string>())
            )
            return
        }
        setAvailableDates(
            array.reduce((acc, date) => {
                if (date.available) {
                    acc.add(date.date.toISODate()!)
                }
                return acc
            }, new Set<string>())
        )
        return
        // eslint-disable-next-line
    }, [availabilities, rangeDate?.from, defaultValue])

    useEffect(() => {
        if (!rangeDate?.from && !rangeDate?.to) {
            setAvailabilityState({
                ...availabilityState,
                startAt: '',
                endAt: '',
            } as T)
        }
        if (rangeDate?.to) {
            setAvailabilityState({
                ...availabilityState,
                startAt: DateTime.fromJSDate(rangeDate.from!).toISODate()!,
                endAt: DateTime.fromJSDate(rangeDate.to).toISODate()!,
            } as T)
        } // eslint-disable-next-line
    }, [rangeDate])

    useEffect(() => {
        setAvailabilityState(defaultValue)
        setRangeDate({
            from: DateTime.fromISO(defaultValue.startAt).toJSDate(),
            to: DateTime.fromISO(defaultValue.endAt).toJSDate(),
        })
        setSelectedMonth(
            DateTime.fromISO(defaultValue?.startAt, {
                zone: 'utc',
            }).toJSDate()
        )
    }, [defaultValue])

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
                        value={
                            availabilityState.spaId
                                ? spas?.find(
                                      (spa) =>
                                          spa.id === availabilityState.spaId
                                  )
                                : undefined
                        }
                        onSelect={(spa) => {
                            setAvailabilityState({
                                ...availabilityState,
                                spaId: spa?.id || -1,
                            })
                        }}
                        defaultValue={defaultSelectedSpa}
                    />
                </div>
                <div className="flex flex-row md:flex-col">
                    <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-7 md:gap-2">
                        {days.map((day, index) => (
                            <div
                                key={day}
                                className="flex flex-row items-center md:flex-col"
                            >
                                <span className="text-center capitalize">
                                    {daysNameInLocale[index]}
                                </span>
                                <Input
                                    className="text-xs [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                    type="number"
                                    disabled={!selectedDay.has(day)}
                                    id={`${day}-day`}
                                    defaultValue={
                                        availabilityState[
                                            (day +
                                                'Price') as `${(typeof days)[number]}Price`
                                        ]?.night
                                    }
                                    onChange={(e) => {
                                        !isNaN(Number(e.target.value)) &&
                                            setAvailabilityState({
                                                ...availabilityState,
                                                [(day +
                                                    'Price') as `${(typeof days)[number]}Price`]:
                                                    {
                                                        ...availabilityState[
                                                            (day +
                                                                'Price') as `${(typeof days)[number]}Price`
                                                        ],
                                                        night: Number(
                                                            e.target.value
                                                        ),
                                                    },
                                            })
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <Calendar
                        fixedWeeks
                        mode="range"
                        month={selectedMonth}
                        onMonthChange={(month) => {
                            setSelectedMonth(month)
                        }}
                        className="flex w-full justify-center overflow-hidden"
                        selected={rangeDate}
                        onSelect={setRangeDate}
                        displayedRange={{
                            red: availabilities
                                ?.filter((availability) => {
                                    return availability.id !== defaultValue?.id
                                })
                                .map((availability) => ({
                                    from: DateTime.fromISO(
                                        availability.startAt
                                    ),
                                    to: DateTime.fromISO(availability.endAt),
                                    item: availability,
                                })),
                        }}
                        numberOfMonths={1}
                        disabled={(date) => {
                            return (
                                availableDates.has(
                                    DateTime.fromJSDate(
                                        date
                                    ).toSQLDate() as string
                                ) ||
                                (closestAvailabiltyDates?.past
                                    ? date <
                                      closestAvailabiltyDates.past.toJSDate()
                                    : false) ||
                                (closestAvailabiltyDates?.future
                                    ? date >
                                      closestAvailabiltyDates.future.toJSDate()
                                    : false) ||
                                !availabilityState?.spaId ||
                                availabilityState?.spaId === -1 ||
                                disabled?.(date) ||
                                false
                            )
                        }}
                    />
                </div>{' '}
            </div>
            <div className="flex w-full justify-between">
                <Button
                    className="relative"
                    onClick={() => onDelete?.(defaultValue)}
                    variant={'destructive'}
                >
                    <span>Delete</span>
                </Button>
                <Button
                    className="relative"
                    onClick={() =>
                        onEdit?.({
                            ...availabilityState!,
                            ...days.reduce(
                                (acc, day) => ({
                                    ...acc,
                                    [day + 'Price']: {
                                        day: availabilityState?.[
                                            (day +
                                                'Price') as `${(typeof days)[number]}Price`
                                        ]?.day
                                            ? availabilityState?.[
                                                  (day +
                                                      'Price') as `${(typeof days)[number]}Price`
                                              ]?.day! * 100
                                            : 0,
                                        night: availabilityState?.[
                                            (day +
                                                'Price') as `${(typeof days)[number]}Price`
                                        ]?.night
                                            ? availabilityState?.[
                                                  (day +
                                                      'Price') as `${(typeof days)[number]}Price`
                                              ]?.night! * 100
                                            : 0,
                                        journey: availabilityState?.[
                                            (day +
                                                'Price') as `${(typeof days)[number]}Price`
                                        ]?.journey
                                            ? availabilityState?.[
                                                  (day +
                                                      'Price') as `${(typeof days)[number]}Price`
                                              ]?.journey! * 100
                                            : 0,
                                    },
                                }),
                                {} as Record<
                                    (typeof days)[number],
                                    {
                                        day: number
                                        night: number
                                        journey: number
                                    }
                                >
                            ),
                        })
                    }
                    disabled={isUpdating}
                >
                    <span className={isUpdating ? 'invisible' : 'visible'}>
                        Save change
                    </span>
                    {isUpdating ? (
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
