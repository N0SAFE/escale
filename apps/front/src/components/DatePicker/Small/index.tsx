"use client";

import SelectDate from "@/components/SelectDate/index";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

type DatePickerProps = {
    onConfirm: (selected: "night" | "afternoon" | "journey" | undefined, date: Date | DateRange | undefined) => Promise<string | undefined> | string | undefined;
    getAvailableDates: (startAt: string, endAt: string, type: "night" | "afternoon" | "journey") => Promise<{ date: string; available: boolean }[]>;
    getPrice: (date: string | { from: string; to: string }, type: "night" | "afternoon" | "journey") => Promise<number | undefined>;
    defaultValue?: {
        date?: Date | DateRange;
        selected?: "night" | "afternoon" | "journey";
        BookedDate?: Set<string>;
        price?: number;
        month?: number;
    }
};

export default function DatePickerSmall({ onConfirm, getAvailableDates, getPrice, defaultValue }: DatePickerProps) {
    const [date, setDate] = useState<Date | DateRange | undefined>(defaultValue?.date);
    const [selected, setSelected] = useState<"journey" | "night" | "afternoon" | undefined>(defaultValue?.selected);
    const [error, setError] = useState<string | undefined>();
    const [selectedMonth, setSelectedMonth] = useState(defaultValue?.month || DateTime.now().month);
    const [bookedDate, setBookedDate] = useState<Set<string>>(defaultValue?.BookedDate || new Set());
    const [price, setPrice] = useState<number | undefined>(defaultValue?.price);
    // get the date from the first day of the actual month to the last day of the next month
    useEffect(() => {
        if (!selected) return;
        // startAt is the first day of the month inside selectedMonth
        const startAt = DateTime.now().set({ month: selectedMonth, day: 1 });
        const endAt = startAt.plus({ month: 1 }).minus({ day: 1 });
        getAvailableDates(startAt.toISODate(), endAt.toISODate(), selected).then((dates) => {
            setBookedDate(new Set(dates.filter((date) => !date.available).map((date) => date.date)));
        });
        if (selected === "journey") {
            getPrice({ from: DateTime.fromJSDate((date as DateRange).from!).toISODate()!, to: DateTime.fromJSDate((date as DateRange).to!).toISODate()! }, selected).then((price) => {
                setPrice(price);
            });
        } else {
            getPrice(DateTime.fromJSDate(date as Date).toISODate()!, selected).then((price) => {
                setPrice(price);
            });
        }
    }, [getAvailableDates, setBookedDate, selectedMonth, selected, date, getPrice]);

    console.log("selected", selected);
    return (
        <div className="flex justify-between text-black py-4 bg-[#FFFBF2] items-center px-8">
            <div className="w-full">
                <div>220$</div>
                <div>a partir de :</div>
            </div>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full bg-[#E6B022] rounded-full py-4">
                        Reserver
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="text-black">
                    <div className="mx-auto w-full max-w-md">
                        <DrawerHeader>
                            <DrawerTitle>reservation</DrawerTitle>
                            <DrawerDescription>reserver votre spa</DrawerDescription>
                        </DrawerHeader>
                        <div className="flex flex-col gap-2 text-black">
                            <div className="flex gap-2 items-center">
                                <span className="text-nowrap">réserver pour : </span>
                                <Select
                                    defaultValue="night"
                                    onValueChange={(value) => {
                                        setSelected(value as "journey" | "night" | "afternoon");
                                    }}
                                >
                                    <SelectTrigger className="max-w-[190px] w-full">
                                        <SelectValue placeholder="select a reservation time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {/* <SelectItem value="journey">plusieurs jours</SelectItem> */}
                                            <SelectItem value="night">la nuit</SelectItem>
                                            {/* <SelectItem value="afternoon">l&apos;après-midi</SelectItem> */}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* {selected === "journey" ? (
                                <SelectDate onSelect={setDate} type={selected} />
                            ) : selected === "night" ? (
                                <SelectDate onSelect={setDate} type={selected} />
                            ) : selected === "afternoon" ? (
                                <SelectDate onSelect={setDate} type={selected} />
                            ) : null} */}
                            <SelectDate
                                onSelect={setDate}
                                type={"night"}
                                onMonthChange={function (date) {
                                    setSelectedMonth((DateTime.fromJSDate(date) as DateTime<true>).month);
                                }}
                                disabledDate={bookedDate}
                                defaultValue={{date: date}}
                            />
                            {price ? <p>le prix est de {price / 100}€</p> : null}
                            {error ? (
                                <div className="bg-red-600 p-4 text-white rounded-lg">
                                    <h1>une erreur est surevenue</h1>
                                    <p>{error}</p>
                                </div>
                            ) : null}
                        </div>
                        <DrawerFooter>
                            {selected && (
                                <Button
                                    onClick={() =>
                                        Promise.resolve(onConfirm(selected, date)).then(async function (error) {
                                            if (await error) {
                                                setError(await error);
                                            }
                                        })
                                    }
                                >
                                    confirmer
                                </Button>
                            )}
                            <DrawerClose asChild className="text-black">
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
