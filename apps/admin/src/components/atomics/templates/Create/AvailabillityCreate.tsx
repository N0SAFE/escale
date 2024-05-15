'use client'

import {
    Availability as AvailabilityType,
    CreateAvailability,
    Spa,
} from '@/types/index'
import { days } from '@/types/utils'
import React, { useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DateTime, Info } from 'luxon'
import { Input } from '../../../ui/input'
import { Calendar } from '../../../ui/calendar'
import { Label } from '../../../ui/label'
import Combobox from '../../molecules/Combobox'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAvailabilities } from '@/app/(logged)/dashboard/availabilities/actions'

export type AvailabilityCreateProps = {
    onChange?: (availability: CreateAvailability) => void
    displayedRange?: {
        blue: {
            from: Date
            to: Date
            item: AvailabilityType
            onClick: (item: AvailabilityType) => void
        }[]
        yellow: {
            from: Date
            to: Date
            item: AvailabilityType
            onClick: (item: AvailabilityType) => void
        }[]
        green: {
            from: Date
            to: Date
            item: AvailabilityType
            onClick: (item: AvailabilityType) => void
        }[]
        red: {
            from: Date
            to: Date
            item: AvailabilityType
            onClick: (item: AvailabilityType) => void
        }[]
    }
    onMonthChange?: (month: Date) => void
    getClostestAvailabilities?: (date: string) => Promise<{
        up: AvailabilityType | undefined
        down: AvailabilityType | undefined
    }>
    spas?: Spa[]
    isSpaLoading?: boolean
    selectedSpa?: Spa
    disabled?: (date: Date) => boolean
    defaultSelectedSpa?: Spa
}

export default function AvailabilityCreate({
    getClostestAvailabilities,
    onMonthChange,
    onChange,
    spas,
    isSpaLoading,
    selectedSpa,
    disabled,
    defaultSelectedSpa,
}: AvailabilityCreateProps) {
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const daysNameInLocale = Info.weekdays('short')
    const [availabilityState, setAvailabilityState] =
        React.useState<CreateAvailability>()
    const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })
    const [availableDates, setAvailableDates] = React.useState<{
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

    const { data: availabilities } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: [
            'availabilities',
            selectedMonth.toUTCString(),
            { range: { before: 2, after: 2, spa: availabilityState?.spa } },
        ],
        queryFn: async () =>
            getAvailabilities({
                groups: ['availabilities:spa'],
                search: {
                    spa: availabilityState?.spa,
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
        enabled: !!availabilityState?.spa,
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
            setAvailableDates({
                up: undefined,
                down: undefined,
                set: new Set<string>(),
            })
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

            return {
                date: date,
                available: !!availability,
            }
        })
        if (rangeDate?.from) {
            getClostestAvailabilities?.(
                DateTime.fromJSDate(rangeDate?.from!).toISODate()!
            ).then(function (closestAvailabilities) {
                setAvailableDates({
                    up:
                        closestAvailabilities?.down &&
                        DateTime.fromISO(closestAvailabilities?.down.startAt, {
                            zone: 'utc',
                        }).toJSDate()!,
                    down:
                        closestAvailabilities?.up &&
                        DateTime.fromISO(closestAvailabilities?.up.endAt, {
                            zone: 'utc',
                        }).toJSDate()!,
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
        setAvailableDates({
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
    }, [availabilities, rangeDate?.from])

    useEffect(() => {
        if (!rangeDate?.from && !rangeDate?.to) {
            setAvailabilityState({
                ...availabilityState,
                startAt: '',
                endAt: '',
            } as CreateAvailability)
        }
        if (rangeDate?.to) {
            setAvailabilityState({
                ...availabilityState,
                startAt: DateTime.fromJSDate(rangeDate.from!).toISODate()!,
                endAt: DateTime.fromJSDate(rangeDate.to).toISODate()!,
            } as CreateAvailability)
        } // eslint-disable-next-line
    }, [rangeDate])

    useEffect(() => {
        onChange?.({
            ...availabilityState!,
            ...days.reduce(
                (acc, day) => ({
                    ...acc,
                    [day + 'Price']: {
                        day: availabilityState?.[
                            (day + 'Price') as `${(typeof days)[number]}Price`
                        ]?.day
                            ? availabilityState?.[
                                  (day +
                                      'Price') as `${(typeof days)[number]}Price`
                              ]?.day! * 100
                            : 0,
                        night: availabilityState?.[
                            (day + 'Price') as `${(typeof days)[number]}Price`
                        ]?.night
                            ? availabilityState?.[
                                  (day +
                                      'Price') as `${(typeof days)[number]}Price`
                              ]?.night! * 100
                            : 0,
                        journey: availabilityState?.[
                            (day + 'Price') as `${(typeof days)[number]}Price`
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
                    { day: number; night: number; journey: number }
                >
            ),
        } as CreateAvailability) // eslint-disable-next-line
    }, [availabilityState])

    return (
        <div className="grid gap-4 py-4  w-full">
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
                        availabilityState?.spa
                            ? spas?.find(
                                  (spa) => spa.id === availabilityState.spa
                              )
                            : undefined
                    }
                    onSelect={(spa) => {
                        setAvailabilityState({
                            ...(availabilityState! || {}),
                            spa: spa?.id || -1,
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
                            className="flex flex-row md:flex-col items-center"
                        >
                            <span className="text-center capitalize">
                                {daysNameInLocale[index]}
                            </span>
                            <Input
                                className="text-xs [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                type="number"
                                disabled={!selectedDay.has(day)}
                                id={`${day}-day`}
                                defaultValue={
                                    availabilityState?.[
                                        (day +
                                            'Price') as `${(typeof days)[number]}Price`
                                    ]?.night
                                }
                                onChange={(e) => {
                                    !isNaN(Number(e.target.value)) &&
                                        setAvailabilityState({
                                            ...(availabilityState! || {}),
                                            [(day +
                                                'Price') as `${(typeof days)[number]}Price`]:
                                                {
                                                    ...availabilityState?.[
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
                        onMonthChange?.(month)
                    }}
                    className="w-full overflow-hidden flex justify-center"
                    selected={rangeDate}
                    onSelect={setRangeDate}
                    displayedRange={{
                        red: availabilities?.map((availability) => ({
                            from: DateTime.fromISO(availability.startAt),
                            to: DateTime.fromISO(availability.endAt),
                            item: availability,
                        })),
                    }}
                    numberOfMonths={1}
                    disabled={(date) => {
                        return (
                            availableDates.set.has(
                                DateTime.fromJSDate(date).toSQLDate() as string
                            ) ||
                            (availableDates.down
                                ? date < availableDates.down
                                : false) ||
                            (availableDates.up
                                ? date > availableDates.up
                                : false) ||
                            !availabilityState?.spa ||
                            availabilityState?.spa === -1 ||
                            disabled?.(date) ||
                            false
                        )
                    }}
                />
            </div>
        </div>
    )
}
