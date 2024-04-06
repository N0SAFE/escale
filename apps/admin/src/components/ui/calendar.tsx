import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DateRange, DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { DateTime } from 'luxon'
import css from '@/lib/calendar-css'

import {
    DayProps,
    useDayRender,
    Button as ReactDayPickerButton,
} from 'react-day-picker'

function DurationDay<T extends { id: number }>(
    props: DayProps,
    {
        displayedpropsMap,
    }: {
        displayedpropsMap: Map<
            string,
            {
                color: (typeof colors)[number]
                displayedProp: DisplayedProps<T>
            }[]
        >
    }
) {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const dayRender = useDayRender(props.date, props.displayMonth, buttonRef)

    dayRender.activeModifiers = {
        ...(dayRender.activeModifiers || {}),
        selected: true,
    }

    // console.log(DateTime.fromJSDate(props.date).toISODate()!)
    // console.log(displayedpropsMap.get(DateTime.fromJSDate(props.date).toISODate()!))

    if (dayRender.isHidden) {
        return <></>
    }
    if (!dayRender.isButton) {
        return <div {...dayRender.divProps} />
    }

    // console.log('dayRender', dayRender.activeModifiers)

    return <ReactDayPickerButton {...dayRender.buttonProps} ref={buttonRef} />
}

type DisplayedProps<T extends { id: number }> = {
    from: DateTime
    fromPortion?: { portion: number; index: number }
    to: DateTime
    toPortion?: { portion: number; index: number }
    item?: T
}

type DisplayedPropsRequireItem<T extends { id: number }> = {
    from: DateTime
    fromPortion?: { portion: number; index: number }
    to: DateTime
    toPortion?: { portion: number; index: number }
    item: T
}

const colors = [
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'orange',
    'pink',
    'cyan',
    'gray',
] as const

export type CalendarProps<T extends { id: number }> = React.ComponentProps<
    typeof DayPicker
> & {
    displayedRange?: {
        blue?: DisplayedProps<T>[]
        yellow?: DisplayedProps<T>[]
        green?: DisplayedProps<T>[]
        red?: DisplayedProps<T>[]
        purple?: DisplayedProps<T>[]
        orange?: DisplayedProps<T>[]
        pink?: DisplayedProps<T>[]
        cyan?: DisplayedProps<T>[]
        gray?: DisplayedProps<T>[]
        random?: DisplayedPropsRequireItem<T>[]
        randomColor?: (typeof colors)[number][]
        pickRandomColor?: (
            item: DisplayedPropsRequireItem<T>,
            index: number
        ) => number
    }
    triggerColorChangeOnHover?: boolean
    triggerSelectedColorChangeOnHoverDisplayedRange?: boolean
    onDisplayedRangeClick?: (
        items: Exclude<DisplayedPropsRequireItem<T>, undefined>[],
        day: Date
    ) => void
    onDisplayedRangeHover?: (
        items: Exclude<DisplayedPropsRequireItem<T>, undefined>[],
        day: Date
    ) => void
    onDisplayedRangeOut?: () => void
}

function Calendar<T extends { id: number }>({
    className,
    classNames,
    showOutsideDays = true,
    displayedRange,
    modifiers,
    modifiersClassNames,
    onDayMouseEnter,
    onDayClick,
    triggerColorChangeOnHover,
    onDisplayedRangeClick,
    onDisplayedRangeHover,
    onDisplayedRangeOut,
    ...props
}: CalendarProps<T>) {
    // console.log('render CalendarComponent')
    const [hoveredItems, setHoveredItems] = React.useState<
        DisplayedProps<T>[] | null
    >(null)
    // console.log('triggerColorChangeOnHover', triggerColorChangeOnHover)
    // console.log(displayedRange)
    const displayedRangeMap = React.useMemo(() => {
        const map = new Map<
            string,
            {
                color: (typeof colors)[number]
                displayedProp: DisplayedProps<T>
            }[]
        >()
        colors.forEach((color) => {
            // console.log(color)
            displayedRange?.[color]?.forEach((item) => {
                // console.log(displayedRange?.[color])
                const numberOfDays = item.to.diff(item.from, 'days').days
                // console.log(numberOfDays)
                Array.from({ length: numberOfDays + 1 }, (_, i) => {
                    const date = item.from.plus({ days: i })
                    // console.log(date.toISODate())
                    if (map.has(date.toISODate()!)) {
                        map.set(date.toISODate()!, [
                            ...map.get(date.toISODate()!)!,
                            {
                                color,
                                displayedProp: item,
                            },
                        ])
                    } else {
                        map.set(date.toISODate()!, [
                            {
                                color,
                                displayedProp: item,
                            },
                        ])
                    }
                })
            })
        })
        return map
    }, [displayedRange])
    // console.log(displayedRangeMap)
    const duration = React.useMemo(() => {
        const d = {
            ...colors.reduce(
                (acc, color) => {
                    return {
                        ...acc,
                        [color]: displayedRange
                            ? displayedRange[
                                  color as (typeof colors)[number]
                              ]?.map((item: DisplayedProps<T>) => {
                                  const startAt = item.from
                                  const endAt = item.to
                                  const diff = endAt.diff(startAt, 'days')
                                  const betweenDate = Array.from(
                                      { length: diff.days - 1 },
                                      (_, i) => startAt.plus({ days: i + 1 })
                                  )
                                  return {
                                      startAt,
                                      endAt,
                                      betweenDate,
                                      duration: item,
                                      color,
                                  }
                              })
                            : [],
                    }
                },
                {} as {
                    [key in (typeof colors)[number]]: {
                        startAt: DateTime
                        endAt: DateTime
                        betweenDate: DateTime[]
                        duration: DisplayedProps<T>
                        color: (typeof colors)[number]
                    }[]
                }
            ),
        }

        displayedRange?.random?.forEach(function (item, index) {
            const startAt = item.from
            const endAt = item.to
            const diff = endAt.diff(startAt, 'days')
            const betweenDate = Array.from({ length: diff.days - 1 }, (_, i) =>
                startAt.plus({ days: i + 1 })
            )
            const colorIndex = displayedRange?.pickRandomColor
                ? displayedRange?.pickRandomColor?.(item, index)
                : index
            const color = displayedRange.randomColor
                ? displayedRange.randomColor[
                      colorIndex % displayedRange.randomColor.length
                  ]
                : colors[colorIndex % colors.length]
            if (!d[color]) {
                d[color] = []
            }
            d[color]?.push({
                startAt,
                endAt,
                betweenDate,
                duration: item,
                color,
            })
        })
        return d
    }, [displayedRange])

    const changeDisplayedRangeStateOnHover = React.useCallback<
        Exclude<
            React.ComponentProps<typeof DayPicker>['onDayMouseEnter'],
            undefined
        >
    >(
        (day, activeModifiers, e) => {
            const hoverdedDateTime = DateTime.fromJSDate(day)
            const durationList = colors.map((color) => duration[color])
            const hoveredItems = durationList
                ?.flatMap((duration) => {
                    return duration
                        ?.toReversed()
                        ?.filter(
                            (item) =>
                                hoverdedDateTime >= item.startAt &&
                                hoverdedDateTime <= item.endAt
                        )
                })
                ?.filter((i) => i !== undefined)
            if (hoveredItems?.length > 0) {
                setHoveredItems(hoveredItems.map((item) => item.duration))
                onDisplayedRangeHover?.(
                    hoveredItems
                        ?.filter((i) => i.duration.item)
                        .map(
                            (item) => item.duration
                        ) as DisplayedPropsRequireItem<T>[],
                    day
                )
                return
            }
            setHoveredItems(null)
            onDisplayedRangeHover?.([], day)
            onDayMouseEnter?.(day, activeModifiers, e)
        },
        [duration, onDayMouseEnter, onDisplayedRangeHover]
    )

    const modifiersClassNamesComputed = React.useMemo(() => {
        return colors.reduce<any>((acc, color) => {
            return {
                ...acc,
                ...['active', 'inactive']
                    .map((state) => {
                        return Array.from({ length: 4 }, (_, out) => {
                            if (out + 1 === 1) {
                                return {
                                    [`start-${state}-${color}`]: cn(
                                        `custom-day start-day-${color} ${state} ${
                                            state === 'active'
                                                ? 'dark:text-white'
                                                : 'dark:text-black'
                                        }`,
                                        state === 'active'
                                            ? triggerColorChangeOnHover
                                                ? 'hover:text-white asToHandleOnDayMouseEnter'
                                                : 'hover:bg-red-600'
                                            : triggerColorChangeOnHover
                                            ? 'hover:bg-red-600'
                                            : 'hover:bg-red-300'
                                    ),
                                    [`end-${state}-${color}`]: cn(
                                        `custom-day end-day-${color} ${state} ${
                                            state === 'active'
                                                ? 'dark:text-white'
                                                : 'dark:text-black'
                                        }`,
                                        state === 'active'
                                            ? triggerColorChangeOnHover
                                                ? 'hover:text-white asToHandleOnDayMouseEnter'
                                                : 'hover:bg-red-600'
                                            : triggerColorChangeOnHover
                                            ? 'hover:bg-red-600'
                                            : 'hover:bg-red-300'
                                    ),
                                    [`middle-${state}-${color}`]: cn(
                                        `custom-day middle-day-${color} ${state} ${
                                            state === 'active'
                                                ? 'dark:text-white'
                                                : 'dark:text-black'
                                        }`,
                                        state === 'active'
                                            ? triggerColorChangeOnHover
                                                ? 'hover:text-white asToHandleOnDayMouseEnter'
                                                : 'hover:bg-red-600'
                                            : triggerColorChangeOnHover
                                            ? 'hover:bg-red-600'
                                            : 'hover:bg-red-300'
                                    ),
                                }
                            }
                            return Array.from({ length: out + 1 }, (_, of) => {
                                return {
                                    [`start-${state}-${color}-${of + 1}-${
                                        out + 1
                                    }`]: cn(
                                        `custom-day start-day-${color}-${
                                            of + 1
                                        }-${out + 1}-${state}${
                                            triggerColorChangeOnHover
                                                ? '-asToHandleOnDayMouseEnter'
                                                : ''
                                        }`
                                    ),
                                    [`end-${state}-${color}-${of + 1}-${
                                        out + 1
                                    }`]: cn(
                                        `custom-day end-day-${color}-${
                                            of + 1
                                        }-${out + 1}-${state}${
                                            triggerColorChangeOnHover
                                                ? '-asToHandleOnDayMouseEnter'
                                                : ''
                                        }`
                                    ),
                                }
                            })
                        })
                    })
                    .flat(4)
                    .reduce((acc, item) => ({ ...acc, ...item }), {} as any),
            }
        }, {})
    }, [triggerColorChangeOnHover])

    // console.log(triggerColorChangeOnHover)
    // console.log(modifiersClassNamesComputed)

    const modifiersComputed = React.useMemo(() => {
        return {
            ...[
                ...colors.map(
                    (color) => duration[color as (typeof colors)[number]]
                ),
            ].reduce((acc, duration, index) => {
                if (!duration) {
                    return acc
                }
                duration.forEach(
                    ({
                        color,
                        duration: { item, fromPortion, toPortion },
                        startAt,
                        endAt,
                        betweenDate,
                    }) => {
                        const startActiveKey = `start-active-${color}${
                            fromPortion && fromPortion.portion > 1
                                ? '-' +
                                  fromPortion.index +
                                  '-' +
                                  fromPortion.portion
                                : ''
                        }`
                        const startInactiveKey = `start-inactive-${color}${
                            fromPortion && fromPortion.portion > 1
                                ? '-' +
                                  fromPortion.index +
                                  '-' +
                                  fromPortion.portion
                                : ''
                        }`
                        const endActiveKey = `end-active-${color}${
                            toPortion && toPortion.portion > 1
                                ? '-' +
                                  toPortion.index +
                                  '-' +
                                  toPortion.portion
                                : ''
                        }`
                        const endInactiveKey = `end-inactive-${color}${
                            toPortion && toPortion.portion > 1
                                ? '-' +
                                  toPortion.index +
                                  '-' +
                                  toPortion.portion
                                : ''
                        }`
                        const middleInactiveKey = `middle-inactive-${color}`
                        const middleActiveKey = `middle-active-${color}`
                        // console.log(startActiveKey, startInactiveKey)
                        // console.log(endActiveKey, endInactiveKey)
                        // console.log(triggerColorChangeOnHover)

                        if (hoveredItems && triggerColorChangeOnHover) {
                            if (
                                hoveredItems.some(
                                    (hoveredItem) =>
                                        hoveredItem.item?.id === item?.id
                                )
                            ) {
                                if (acc[middleActiveKey]) {
                                    acc[middleActiveKey].push(
                                        ...betweenDate.map((date) =>
                                            date.toJSDate()
                                        )
                                    )
                                } else {
                                    acc[middleActiveKey] = [
                                        ...betweenDate.map((date) =>
                                            date.toJSDate()
                                        ),
                                    ]
                                }
                                if (acc[startActiveKey]) {
                                    acc[startActiveKey].push(startAt.toJSDate())
                                } else {
                                    acc[startActiveKey] = [startAt.toJSDate()]
                                }
                                if (acc[endActiveKey]) {
                                    acc[endActiveKey].push(endAt.toJSDate())
                                } else {
                                    acc[endActiveKey] = [endAt.toJSDate()]
                                }
                                return
                            }
                            if (acc[startInactiveKey]) {
                                acc[startInactiveKey].push(startAt.toJSDate())
                            } else {
                                acc[startInactiveKey] = [startAt.toJSDate()]
                            }
                            if (acc[endInactiveKey]) {
                                acc[endInactiveKey].push(endAt.toJSDate())
                            } else {
                                acc[endInactiveKey] = [endAt.toJSDate()]
                            }
                            if (acc[middleInactiveKey]) {
                                acc[middleInactiveKey].push(
                                    ...betweenDate.map((date) =>
                                        date.toJSDate()
                                    )
                                )
                            } else {
                                acc[middleInactiveKey] = [
                                    ...betweenDate.map((date) =>
                                        date.toJSDate()
                                    ),
                                ]
                            }
                            return
                        }

                        if (acc[startInactiveKey]) {
                            acc[startInactiveKey].push(startAt.toJSDate())
                        } else {
                            acc[startInactiveKey] = [startAt.toJSDate()]
                        }
                        if (acc[endInactiveKey]) {
                            acc[endInactiveKey].push(endAt.toJSDate())
                        } else {
                            acc[endInactiveKey] = [endAt.toJSDate()]
                        }
                        if (acc[middleInactiveKey]) {
                            acc[middleInactiveKey].push(
                                ...betweenDate.map((date) => date.toJSDate())
                            )
                        } else {
                            acc[middleInactiveKey] = [
                                ...betweenDate.map((date) => date.toJSDate()),
                            ]
                        }
                    }
                )

                return acc
            }, {} as any),
            ...modifiers,
        }
    }, [hoveredItems, duration, modifiers, triggerColorChangeOnHover])

    // console.log(modifiersClassNamesComputed)

    return (
        <div
            onMouseLeave={function () {
                setHoveredItems(null)
                onDisplayedRangeOut?.()
            }}
        >
            <style jsx global>
                {css}
            </style>
            <DayPicker
                showOutsideDays={showOutsideDays}
                className={cn('p-3', className)}
                classNames={{
                    months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                    month: 'space-y-4',
                    caption: 'flex justify-center pt-1 relative items-center',
                    caption_label: 'text-sm font-medium',
                    nav: 'space-x-1 flex items-center',
                    nav_button: cn(
                        buttonVariants({ variant: 'outline' }),
                        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                    ),
                    nav_button_previous: 'absolute left-1',
                    nav_button_next: 'absolute right-1',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell:
                        'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2',
                    cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: cn(
                        buttonVariants({ variant: 'ghost' }),
                        'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
                    ),
                    day_range_end: 'day-range-end',
                    day_selected:
                        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                    day_today: 'bg-accent text-accent-foreground',
                    day_outside:
                        'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                    day_disabled: 'text-muted-foreground opacity-50',
                    day_range_middle:
                        'aria-selected:bg-accent aria-selected:text-accent-foreground',
                    day_hidden: 'invisible',
                    ...classNames,
                }}
                components={{
                    IconLeft: ({ ...props }) => (
                        <ChevronLeft className="h-4 w-4" />
                    ),
                    IconRight: ({ ...props }) => (
                        <ChevronRight className="h-4 w-4" />
                    ),
                    Day: (props) =>
                        DurationDay(props, {
                            displayedpropsMap: displayedRangeMap,
                        }),
                }}
                modifiers={modifiersComputed}
                modifiersClassNames={{
                    ...modifiersClassNamesComputed,
                    ...modifiersClassNames,
                }}
                onDayMouseEnter={changeDisplayedRangeStateOnHover}
                onDayClick={(day, activeModifiers, e) => {
                    if (!hoveredItems || hoveredItems.length === 0) {
                        return
                    }
                    onDisplayedRangeClick?.(
                        hoveredItems?.filter(
                            (i) => i.item
                        ) as DisplayedPropsRequireItem<T>[],
                        day
                    )
                    onDayClick?.(day, activeModifiers, e)
                }}
                {...props}
            />
        </div>
    )
}
Calendar.displayName = 'Calendar'

export { Calendar }
