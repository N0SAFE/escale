"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ComboboxProps = {
    items: {
        value: string;
        label: string;
        component: React.ReactNode;
    }[];
}

export default function Combobox({ items }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {value ? items.find((framework) => framework.value === value)?.label : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                        {items.map((item) => (
                            <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                                {item.component}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
