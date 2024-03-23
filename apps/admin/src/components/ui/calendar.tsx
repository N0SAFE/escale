import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { DateTime } from 'luxon'
import { TupleIndices } from '@/types/utils'

type DisplayedProps<T extends { id: number }> = {
    from: DateTime
    to: DateTime
    item: T
    onClick?: (item: T) => void
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
        random?: DisplayedProps<T>[]
        randomColor?: (typeof colors)[number][]
        pickRandomColor?: (item: DisplayedProps<T>, index: number) => number
    }
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
    ...props
}: CalendarProps<T>) {
    const [hoveredItem, setHoveredItem] =
        React.useState<DisplayedProps<T> | null>(null)
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

    console.log(duration)

    return (
        <div
            onMouseLeave={function () {
                setHoveredItem(null)
            }}
        >
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
                }}
                modifiers={{
                    ...[
                        ...colors.map(
                            (color) =>
                                duration[color as (typeof colors)[number]]
                        ),
                    ].reduce((acc, duration, index) => {
                        if (!duration) {
                            return acc
                        }
                        duration.forEach(
                            ({
                                color,
                                duration: { item },
                                startAt,
                                endAt,
                                betweenDate,
                            }) => {
                                const startActiveKey = `start-active-${color}`
                                const startInactiveKey = `start-inactive-${color}`
                                const endActiveKey = `end-active-${color}`
                                const endInactiveKey = `end-inactive-${color}`
                                const middleInactiveKey = `middle-inactive-${color}`
                                const middleActiveKey = `middle-active-${color}`

                                if (hoveredItem) {
                                    if (hoveredItem.item.id === item.id) {
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
                                            acc[startActiveKey].push(
                                                startAt.toJSDate()
                                            )
                                        } else {
                                            acc[startActiveKey] = [
                                                startAt.toJSDate(),
                                            ]
                                        }
                                        if (acc[endActiveKey]) {
                                            acc[endActiveKey].push(
                                                endAt.toJSDate()
                                            )
                                        } else {
                                            acc[endActiveKey] = [
                                                endAt.toJSDate(),
                                            ]
                                        }
                                        return
                                    }
                                    if (acc[startInactiveKey]) {
                                        acc[startInactiveKey].push(
                                            startAt.toJSDate()
                                        )
                                    } else {
                                        acc[startInactiveKey] = [
                                            startAt.toJSDate(),
                                        ]
                                    }
                                    if (acc[endInactiveKey]) {
                                        acc[endInactiveKey].push(
                                            endAt.toJSDate()
                                        )
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
                            }
                        )

                        return acc
                    }, {} as any),
                    ...modifiers,
                }}
                modifiersClassNames={{
                    [`start-active-red`]: `[&:not(aria-selected)]:bg-red-600 hover:bg-red-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-red`]: `[&:not(aria-selected)]:bg-red-300 hover:bg-red-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-red`]: `[&:not(aria-selected)]:bg-red-300 hover:bg-red-600 rounded-none`,
                    [`middle-active-red`]: `[&:not(aria-selected)]:bg-red-600 hover:bg-red-600 rounded-none text-white hover:text-white`,
                    [`end-active-red`]: `[&:not(aria-selected)]:bg-red-600 hover:bg-red-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-red`]: `[&:not(aria-selected)]:bg-red-300 hover:bg-red-600 rounded-l-none rounded-r-md`,
                    [`start-active-blue`]: `[&:not(aria-selected)]:bg-blue-600 hover:bg-blue-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-blue`]: `[&:not(aria-selected)]:bg-blue-300 hover:bg-blue-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-blue`]: `[&:not(aria-selected)]:bg-blue-300 hover:bg-blue-600 rounded-none`,
                    [`middle-active-blue`]: `[&:not(aria-selected)]:bg-blue-600 hover:bg-blue-600 rounded-none text-white hover:text-white`,
                    [`end-active-blue`]: `[&:not(aria-selected)]:bg-blue-600 hover:bg-blue-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-blue`]: `[&:not(aria-selected)]:bg-blue-300 hover:bg-blue-600 rounded-l-none rounded-r-md`,
                    [`start-active-green`]: `[&:not(aria-selected)]:bg-green-600 hover:bg-green-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-green`]: `[&:not(aria-selected)]:bg-green-300 hover:bg-green-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-green`]: `[&:not(aria-selected)]:bg-green-300 hover:bg-green-600 rounded-none`,
                    [`middle-active-green`]: `[&:not(aria-selected)]:bg-green-600 hover:bg-green-600 rounded-none text-white hover:text-white`,
                    [`end-active-green`]: `[&:not(aria-selected)]:bg-green-600 hover:bg-green-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-green`]: `[&:not(aria-selected)]:bg-green-300 hover:bg-green-600 rounded-l-none rounded-r-md`,
                    [`start-active-yellow`]: `[&:not(aria-selected)]:bg-yellow-600 hover:bg-yellow-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-yellow`]: `[&:not(aria-selected)]:bg-yellow-300 hover:bg-yellow-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-yellow`]: `[&:not(aria-selected)]:bg-yellow-300 hover:bg-yellow-600 rounded-none`,
                    [`middle-active-yellow`]: `[&:not(aria-selected)]:bg-yellow-600 hover:bg-yellow-600 rounded-none text-white hover:text-white`,
                    [`end-active-yellow`]: `[&:not(aria-selected)]:bg-yellow-600 hover:bg-yellow-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-yellow`]: `[&:not(aria-selected)]:bg-yellow-300 hover:bg-yellow-600 rounded-l-none rounded-r-md`,
                    [`start-active-purple`]: `[&:not(aria-selected)]:bg-purple-600 hover:bg-purple-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-purple`]: `[&:not(aria-selected)]:bg-purple-300 hover:bg-purple-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-purple`]: `[&:not(aria-selected)]:bg-purple-300 hover:bg-purple-600 rounded-none`,
                    [`middle-active-purple`]: `[&:not(aria-selected)]:bg-purple-600 hover:bg-purple-600 rounded-none text-white hover:text-white`,
                    [`end-active-purple`]: `[&:not(aria-selected)]:bg-purple-600 hover:bg-purple-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-purple`]: `[&:not(aria-selected)]:bg-purple-300 hover:bg-purple-600 rounded-l-none rounded-r-md`,
                    [`start-active-orange`]: `[&:not(aria-selected)]:bg-orange-600 hover:bg-orange-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-orange`]: `[&:not(aria-selected)]:bg-orange-300 hover:bg-orange-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-orange`]: `[&:not(aria-selected)]:bg-orange-300 hover:bg-orange-600 rounded-none`,
                    [`middle-active-orange`]: `[&:not(aria-selected)]:bg-orange-600 hover:bg-orange-600 rounded-none text-white hover:text-white`,
                    [`end-active-orange`]: `[&:not(aria-selected)]:bg-orange-600 hover:bg-orange-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-orange`]: `[&:not(aria-selected)]:bg-orange-300 hover:bg-orange-600 rounded-l-none rounded-r-md`,
                    [`start-active-pink`]: `[&:not(aria-selected)]:bg-pink-600 hover:bg-pink-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-pink`]: `[&:not(aria-selected)]:bg-pink-300 hover:bg-pink-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-pink`]: `[&:not(aria-selected)]:bg-pink-300 hover:bg-pink-600 rounded-none`,
                    [`middle-active-pink`]: `[&:not(aria-selected)]:bg-pink-600 hover:bg-pink-600 rounded-none text-white hover:text-white`,
                    [`end-active-pink`]: `[&:not(aria-selected)]:bg-pink-600 hover:bg-pink-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-pink`]: `[&:not(aria-selected)]:bg-pink-300 hover:bg-pink-600 rounded-l-none rounded-r-md`,
                    [`start-active-cyan`]: `[&:not(aria-selected)]:bg-cyan-600 hover:bg-cyan-600 rounded-r-none rounded-l-md text-white hover:text-white`,
                    [`start-inactive-cyan`]: `[&:not(aria-selected)]:bg-cyan-300 hover:bg-cyan-600 rounded-r-none rounded-l-md`,
                    [`middle-inactive-cyan`]: `[&:not(aria-selected)]:bg-cyan-300 hover:bg-cyan-600 rounded-none`,
                    [`middle-active-cyan`]: `[&:not(aria-selected)]:bg-cyan-600 hover:bg-cyan-600 rounded-none text-white hover:text-white`,
                    [`end-active-cyan`]: `[&:not(aria-selected)]:bg-cyan-600 hover:bg-cyan-600 rounded-l-none rounded-r-md text-white hover:text-white`,
                    [`end-inactive-cyan`]: `[&:not(aria-selected)]:bg-cyan-300 hover:bg-cyan-600 rounded-l-none rounded-r-md`,
                    ...modifiersClassNames,
                }}
                onDayMouseEnter={(day, activeModifiers, e) => {
                    const hoverdedDateTime = DateTime.fromJSDate(day)
                    const durationList = colors.map((color) => duration[color])
                    for (const duration of durationList) {
                        const finded = duration
                            ?.toReversed()
                            ?.find(
                                (item) =>
                                    hoverdedDateTime >= item.startAt &&
                                    hoverdedDateTime <= item.endAt
                            )
                        if (finded) {
                            if (hoveredItem) {
                                if (
                                    hoveredItem.item.id ===
                                    finded?.duration.item.id
                                ) {
                                    return
                                }
                            }
                            setHoveredItem(finded?.duration)
                            return
                        }
                    }
                    setHoveredItem(null)
                    onDayMouseEnter?.(day, activeModifiers, e)
                }}
                onDayClick={(day, activeModifiers, e) => {
                    if (!hoveredItem) {
                        return
                    }
                    hoveredItem.onClick?.(hoveredItem.item)
                    onDayClick?.(day, activeModifiers, e)
                }}
                {...props}
            />
        </div>
    )
}
Calendar.displayName = 'Calendar'

export { Calendar }
