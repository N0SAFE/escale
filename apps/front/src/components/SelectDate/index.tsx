"use client";

import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import fr from 'date-fns/locale/fr';
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
    onSelect?: (date: DateRange | undefined, type: "multiple-day") => void;
    type: "multiple-day";
} | {
    onSelect?: (date: Date | undefined, type: "night" | "afternoon") => void;
    type: "night" | "afternoon";
};

export default function SelectDate({ onSelect, className, type }: Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props> & Props) {
    console.log(new Date());
    const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 5)
    });
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        if (onSelect) {
            if (type === "multiple-day") {
                onSelect(rangeDate, type);
            } else {
                onSelect(date, type);
            }
        }
    }, [date, onSelect, rangeDate, type]);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                {type === "multiple-day" ? (
                    <div className="flex items-center">
                        <span className="text-nowrap">sélectionner des dates : </span>
                        <PopoverTrigger asChild>
                            <Button id="date" variant={"outline"} className={cn("max-w-[300px] w-full justify-start text-left font-normal text-black", !rangeDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {rangeDate?.from ? (
                                    rangeDate.to ? (
                                        <>
                                            {format(rangeDate.from, "LLL dd, y", {locale: fr})} - {format(rangeDate.to, "LLL dd, y", {locale: fr})}
                                        </>
                                    ) : (
                                        format(rangeDate.from, "LLL dd, y", {locale: fr})
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={rangeDate?.from} selected={rangeDate} onSelect={setRangeDate} numberOfMonths={2} />
                        </PopoverContent>
                    </div>
                ) : type === "night" || type === "afternoon" ? (
                    <div className="flex items-center">
                        <span className="text-nowrap">sélectionner une date : </span>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </div>
                ) : null}
            </Popover>
        </div>
    );
}
