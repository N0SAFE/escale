"use client";

import SelectDate from "../SelectDate/index";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type Props = {
    onSelect?: (date: DateRange | undefined, type: "multiple-day") => void;
} | {
    onSelect?: (date: Date | undefined, type: "night" | "afternoon") => void;
};

export default function DatePicker({ onSelect }: Props) {
    const [selected, setSelected] = useState<"multiple-day" | "night" | "afternoon" | undefined>();
    console.log("selected", selected);
    return (
        <div className="flex flex-col gap-2 text-black">
            <div className="flex gap-2 items-center">
                <span className="text-nowrap">réserver pour : </span>
                <Select
                    onValueChange={(value) => {
                        setSelected(value as "multiple-day" | "night" | "afternoon");
                    }}
                >
                    <SelectTrigger className="max-w-[190px] w-full">
                        <SelectValue placeholder="select a reservation time" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="multiple-day">plusieurs jours</SelectItem>
                            <SelectItem value="night">la nuit</SelectItem>
                            <SelectItem value="afternoon">l&apos;après-midi</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {selected === "multiple-day" ? (
                <SelectDate onSelect={onSelect as (date: DateRange | undefined) => void} type={selected} />
            ) : selected === "night" ? (
                <SelectDate onSelect={onSelect as (date: Date | undefined) => void} type={selected} />
            ) : selected === "afternoon" ? (
                <SelectDate onSelect={onSelect as (date: Date | undefined) => void} type={selected} />
            ) : null}
        </div>
    );
}
