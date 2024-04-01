'use client'

import React, { useEffect, useState } from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import fr from 'date-fns/locale/fr'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { DateTime } from 'luxon'

type Props = {
    disableDateFunction?: (date: Date) => boolean
    onMonthChange: (month: Date) => void
    defaultValue?: {
        date?: Date | DateRange | undefined
    }
} & (
    | {
          onSelect?: (date: DateRange | undefined) => void
          multiple: true
      }
    | {
          onSelect?: (date: Date | undefined) => void
          multiple?: false
      }
)

export default function SelectDate({
    onSelect,
    className,
    multiple,
    onMonthChange,
    defaultValue,
    disableDateFunction,
}: Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props> & Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [rangeDate, setRangeDate] = useState<DateRange | undefined>(
        multiple
            ? defaultValue?.date
                ? (defaultValue.date as DateRange)
                : undefined
            : undefined
    )
    const [date, setDate] = useState<Date | undefined>(
        !multiple
            ? defaultValue?.date
                ? (defaultValue.date as Date)
                : undefined
            : undefined
    )

    useEffect(() => {
        if (onSelect) {
            console.log('date', date)
            console.log('multiple', multiple)
            if (multiple) {
                onSelect(rangeDate)
            } else {
                onSelect(date)
            }
        }
    }, [date, onSelect, rangeDate, multiple])

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center">
                    <span className="text-nowrap">
                        sélectionner des dates :{' '}
                    </span>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                                'max-w-[300px] w-full justify-start text-left font-normal text-black',
                                !rangeDate &&
                                    !rangeDate &&
                                    'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {multiple ? (
                                rangeDate?.from ? (
                                    rangeDate.to ? (
                                        <>
                                            {format(
                                                rangeDate.from,
                                                'LLL dd, y',
                                                { locale: fr }
                                            )}{' '}
                                            -{' '}
                                            {format(rangeDate.to, 'LLL dd, y', {
                                                locale: fr,
                                            })}
                                        </>
                                    ) : (
                                        format(rangeDate.from, 'LLL dd, y', {
                                            locale: fr,
                                        })
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )
                            ) : date ? (
                                format(date, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        {multiple ? (
                            <Calendar
                                fixedWeeks
                                initialFocus
                                mode="range"
                                defaultMonth={rangeDate?.from}
                                selected={rangeDate}
                                onSelect={setRangeDate}
                                numberOfMonths={2}
                                disabled={disableDateFunction}
                                onMonthChange={onMonthChange}
                            />
                        ) : (
                            <Calendar
                                mode="single"
                                selected={
                                    disableDateFunction && date
                                        ? !disableDateFunction(date)
                                            ? date
                                            : undefined
                                        : undefined
                                }
                                onSelect={setDate}
                                initialFocus
                                onMonthChange={onMonthChange}
                                disabled={disableDateFunction}
                            />
                        )}
                    </PopoverContent>
                </div>
                {/* ) : type === "afternoon" ? (
                    <div className="flex items-center">
                        <span className="text-nowrap">sélectionner une date : </span>
                        <PopoverTrigger asChild onClick={() => setIsOpen(!isOpen)}>
                            <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal text-black", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={disableDateFunction && date ? (!disableDateFunction(date) ? date : undefined) : undefined}
                                onSelect={setDate}
                                initialFocus
                                onMonthChange={onMonthChange}
                                disabled={disableDateFunction}
                            />
                        </PopoverContent>
                    </div>
                ) : null} */}
            </Popover>
        </div>
    )
}
