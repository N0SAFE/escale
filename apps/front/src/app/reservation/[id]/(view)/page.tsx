import DatePickerSmall from "@/components/DatePicker/Small/index";
import DatePicker from "@/components/DatePicker/index";
import ImageCarousel from "@/components/ImageCarousel/index";
import SpaDetails from "@/components/SpaDetails/index";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { DateTime } from "luxon";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { DateRange } from "react-day-picker";

type Spa = {
    tags: {
        icon: string;
        label: string;
        number: number;
    }[];
    services: {
        label: string;
        image: string;
    }[];
    id: number;
    images: string[];
    title: string;
    description: string;
};

const Reservation = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const { data } = await axios<Spa>(`/spas/${id}`);

    async function getPrice(date: string | { from: string; to: string }, type: "night" | "afternoon" | "journey") {
        "use server";

        if (!date) {
            return;
        }

        if (type === "journey") {
            const response = await axios
                .get(`/reservations/journey-price?startAt=${(date as { from: string; to: string }).from}&endAt=${(date as { from: string; to: string }).to}&spa=${id}`)
                .catch((e) => {
                    console.log(e);
                    throw e;
                });
            return response.data.price;
        } else {
            console.log("date", date);
            console.log("type", type);
            console.log("spa", id);
            const response = await axios.get(`/reservations/price?date=${date}&type=${type}&spa=${id}`).catch((e) => {
                console.log(e);
                throw e;
            });
            return response.data.price;
        }
    }

    async function getAvailableDates(startAt: string, endAt: string, type: "night" | "afternoon" | "journey"): Promise<{ date: string; available: boolean }[]> {
        "use server";

        const response = await axios.get(`/reservations/available-dates?startAt=${startAt}&endAt=${endAt}&type=${type}&spa=${id}`).catch((e) => {
            console.log(e);
            throw e;
        });
        return response.data;
    }

    async function onConfirm(selected: "night" | "afternoon" | "journey" | undefined, date: Date | DateRange | undefined): Promise<string | undefined> {
        "use server";

        if (!date) {
            return "Veuillez sélectionner une date";
        }
        if (selected === "journey") {
            try {
                const session = await axios.post("/checkout-session/spa/journey", {
                    spa: 1,
                    date: "2024-01-06",
                    successUrl: process.env.NEXT_PUBLIC_FRONT_URL + "/reservation/" + id + "/confirm",
                    cancelUrl: process.env.NEXT_PUBLIC_FRONT_URL + "/reservation/" + id
                });
                if (session) {
                    console.log(session);
                }
            } catch {
                return "Une erreur est survenue";
            }
        } else {
            const dateTime = DateTime.fromJSDate(date as Date);
            try {
                const axiosResponse = await axios.post(
                    `/checkout-session/spa?type=${selected}`,
                    {
                        spa: 1,
                        date: dateTime.toSQLDate(),
                        successUrl: process.env.NEXT_PUBLIC_FRONT_URL + "/reservation/" + id + "/confirm",
                        cancelUrl: process.env.NEXT_PUBLIC_FRONT_URL + "/reservation/" + id
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
                return redirect(axiosResponse.data.url);
            } catch (e: any) {
                if (isRedirectError(e)) throw e;
                return e.response.data.message;
            }
        }
    }

    const { available: isAvailable } = (await getAvailableDates(DateTime.now().toISODate(), DateTime.now().toISODate(), "night"))[0];
    console.log(await getAvailableDates(DateTime.now().toISODate(), DateTime.now().toISODate(), "night"));
    const { defaultDate, defaultType, defaultPrice, defaultMonth, defaultBookedDate } = await (async () => {
        const defaultType: "night" | "day" | "journey" = "night";
        const defaultMonth = DateTime.now().month;
        const startAt = DateTime.now().set({ month: defaultMonth, day: 1 });
        const endAt = startAt.plus({ month: 1 }).minus({ day: 1 });
        const defaultBookedDate = await getAvailableDates(startAt.toISODate(), endAt.toISODate(), defaultType);
        if (!isAvailable) {
            return {
                defaultDate: undefined,
                defaultType: defaultType,
                defaultPrice: undefined,
                defaultMonth: DateTime.now().month,
                defaultBookedDate: []
            };
        } else {
            const defaultPrice = await getPrice(DateTime.now().toISODate(), defaultType);
            return {
                defaultDate: new Date(),
                defaultType: defaultType,
                defaultPrice: defaultPrice,
                defaultMonth: defaultMonth,
                defaultBookedDate: defaultBookedDate
            };
        }
    })();

    return (
        <>
            <div className="mx-4 mt-4 text-black">
                <div className="md:hidden">
                    <DatePickerSmall
                        onConfirm={onConfirm}
                        getAvailableDates={getAvailableDates}
                        getPrice={getPrice}
                        defaultValue={{
                            date: defaultDate,
                            selected: defaultType,
                            BookedDate: new Set(defaultBookedDate.filter((date) => !date.available).map((date) => date.date)),
                            price: defaultPrice,
                            month: defaultMonth
                        }}
                    />
                </div>
                <ImageCarousel images={data.images} />
                <div className="xl:ml-66 xl:mr-66 lg:mr-35 lg:ml-36 md:mr-24 md:ml-24 flex gap-8 flex-row py-8">
                    <div className="w-full lg:w-2/3 md:w-1/2">
                        <SpaDetails spa={data} />
                    </div>
                    <div className="w-full lg:w-1/3 md:w-1/2 h-fit gap-8 hidden md:flex">
                        <Separator orientation="vertical" className="h-auto" />
                        <div>
                            <span className="text-2xl font-bold">à partir de 150 €</span>
                            <DatePicker
                                onConfirm={onConfirm}
                                getAvailableDates={getAvailableDates}
                                getPrice={getPrice}
                                defaultValue={{
                                    date: defaultDate,
                                    selected: defaultType,
                                    BookedDate: new Set(defaultBookedDate.filter((date) => !date.available).map((date) => date.date)),
                                    price: defaultPrice,
                                    month: defaultMonth
                                }}
                                className="mt-4"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reservation;
