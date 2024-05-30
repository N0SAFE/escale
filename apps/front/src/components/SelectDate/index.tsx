'use client'

import React, { useEffect, useState } from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
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
import { fr } from 'date-fns/locale'

type Props = {
    disableDateFunction?: (date: Date) => boolean
    onMonthChange: (month: Date) => void
} & (
    | {
          onSelect?: (date: DateRange | undefined) => void
          multiple: true
          value?: DateRange | undefined
      }
    | {
          onSelect?: (date: Date | undefined) => void
          multiple?: false
          value?: Date | undefined
      }
)

export default function SelectDate({
    onSelect,
    className,
    multiple,
    onMonthChange,
    value,
    disableDateFunction,
}: Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props> & Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [date, setDate] = useState<Date | DateRange | undefined>(value)

    useEffect(() => {
        console.log('defaultValue', value)
        setDate(value ? value : undefined)
    }, [value])
    
    console.log('date', date)

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-full max-w-[300px] justify-start text-left font-normal',
                            !value && !value && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {multiple ? (
                            value?.from ? (
                                value.to ? (
                                    <>
                                        {format(value.from, 'LLL dd, y', {
                                            locale: fr,
                                        })}{' '}
                                        -{' '}
                                        {format(value.to, 'LLL dd, y', {
                                            locale: fr,
                                        })}
                                    </>
                                ) : (
                                    format(value.from, 'LLL dd, y', {
                                        locale: fr,
                                    })
                                )
                            ) : (
                                <span>Pick a date</span>
                            )
                        ) : value ? (
                            format(value, 'PPP')
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
                            defaultMonth={(date as DateRange | undefined)?.from}
                            selected={date as DateRange | undefined}
                            onSelect={onSelect}
                            disabled={disableDateFunction}
                            onMonthChange={onMonthChange}
                        />
                    ) : (
                        <Calendar
                            mode="single"
                            selected={
                                disableDateFunction &&
                                (date as Date | undefined)
                                    ? !disableDateFunction(date as Date)
                                        ? (date as Date | undefined)
                                        : undefined
                                    : undefined
                            }
                            onSelect={onSelect}
                            initialFocus
                            onMonthChange={onMonthChange}
                            disabled={disableDateFunction}
                        />
                    )}
                </PopoverContent>
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
