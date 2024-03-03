"use client";

import SelectDate from "@/components/SelectDate/index";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import Loader from "@/components/Loader";

type DatePickerProps = {
  onConfirm: (
    selected: "night" | "afternoon" | "journey" | undefined,
    date: Date | DateRange | undefined
  ) => Promise<string | undefined> | string | undefined;
  getAvailableDates: (
    startAt: string,
    endAt: string,
    type: "night" | "afternoon" | "journey"
  ) => Promise<Set<string>>;
  getPrice: (
    date: string | { from: string; to: string },
    type: "night" | "afternoon" | "journey"
  ) => Promise<number | undefined>;
  defaultValue?: {
    date?: Date | DateRange;
    selected?: "night" | "afternoon" | "journey";
    availableDates?: Set<string>;
    price?: number;
    month?: number;
  };
};

export default function DatePicker({
  onConfirm,
  getAvailableDates,
  getPrice,
  defaultValue,
  ...props
}: DatePickerProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue">) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | DateRange | undefined>(
    defaultValue?.date
  );
  const [selected, setSelected] = useState<
    "journey" | "night" | "afternoon" | undefined
  >(defaultValue?.selected);
  const [error, setError] = useState<string | undefined>();
  const [selectedMonth, setSelectedMonth] = useState(
    defaultValue?.month || DateTime.now().month
  );
  const [price, setPrice] = useState<number | undefined>(defaultValue?.price);
  const [availableDates, setAvailableDates] = useState<Set<string>>(
    defaultValue?.availableDates || new Set()
  );
  // get the date from the first day of the actual month to the last day of the next month
  useEffect(() => {
    if (!selected) return;
    // startAt is the first day of the month inside selectedMonth
    const startAt = DateTime.now().set({ month: selectedMonth, day: 1 });
    const endAt = startAt.plus({ month: 1 }).minus({ day: 1 });
    getAvailableDates(startAt.toISODate(), endAt.toISODate(), selected).then(
      (dates) => {
        setAvailableDates(dates);
      }
    );
    if (selected === "journey") {
      getPrice(
        {
          from: DateTime.fromJSDate((date as DateRange).from!).toISODate()!,
          to: DateTime.fromJSDate((date as DateRange).to!).toISODate()!,
        },
        selected
      ).then((price) => {
        setPrice(price);
      });
    } else {
      getPrice(DateTime.fromJSDate(date as Date).toISODate()!, selected).then(
        (price) => {
          setPrice(price);
        }
      );
    }
  }, [getAvailableDates, selectedMonth, selected, date, getPrice]);

  console.log("selected", selected);
  return (
    <div {...props} className={"flex flex-col gap-2 w-full " + props.className}>
      <div className="flex gap-2 items-center">
        <span className="text-nowrap">réserver pour : </span>
        <Select
          defaultValue="night"
          onValueChange={(value) => {
            setSelected(value as "journey" | "night" | "afternoon");
          }}
        >
          <SelectTrigger className="max-w-[190px] w-full bg-white text-black">
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
        disableDateFunction={(date) =>
          !availableDates.has(
            DateTime.fromJSDate(date).toSQLDate() as string
          ) || new Date() > date
        }
        defaultValue={{ date: date }}
      />
      {price ? <p>le prix est de {price / 100}€</p> : null}
      {selected && (
        <Button
          disabled={isLoading}
          onClick={() =>
            Promise.resolve(onConfirm(selected, date)).then(async function (
              error
            ) {
              if (await error) {
                setError(await error);
              } else {
                setIsLoading(true);
              }
            })
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-1 p-4">
              <Loader className="p-1" />
              Loading...
            </div>
          ) : (
            "confirmer"
          )}
        </Button>
      )}
      {error ? (
        <div className="bg-red-600 p-4 text-white rounded-lg">
          <h1>une erreur est surevenue</h1>
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
}
