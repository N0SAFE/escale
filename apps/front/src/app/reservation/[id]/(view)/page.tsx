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
  location: string;
  google_maps_link: string;
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
  spaImages: {
    image: {
      id: number;
      created_at: string;
      updated_at: string;
      alt: string;
      file_id: number;
    };
  }[];
  title: string;
  description: string;
};

const Reservation = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data } = await axios<Spa>(`/spas/${id}`);

  // console.log(data);

  async function getPrice(
    date: string | { from: string; to: string },
    type: "night" | "afternoon" | "journey"
  ) {
    "use server";

    if (!date) {
      return;
    }

    if (type === "journey") {
      const response = await axios
        .get(
          `/reservations/journey-price?startAt=${
            (date as { from: string; to: string }).from
          }&endAt=${(date as { from: string; to: string }).to}&spa=${id}`
        )
        .catch((e) => {
          console.log(e);
          throw e;
        });
      return response.data.price;
    } else {
      const response = await axios
        .get(`/reservations/price?date=${date}&type=${type}&spa=${id}`)
        .catch((e) => {
          console.log(e);
          throw e;
        });
      return response.data.price;
    }
  }

  async function getAvailableDates(
    startAt: string,
    endAt: string,
    type: "night" | "afternoon" | "journey"
  ): Promise<Set<string>> {
    "use server";

    const response = await axios
      .get<{ date: string; available: boolean }[]>(
        `/reservations/available-dates?startAt=${startAt}&endAt=${endAt}&type=${type}&spa=${id}`
      )
      .catch((e) => {
        // console.log(e);
        throw e;
      });

    return new Set(
      response.data.filter((date) => date.available).map((date) => date.date)
    );
  }

  async function onConfirm(
    selected: "night" | "afternoon" | "journey" | undefined,
    date: Date | DateRange | undefined
  ): Promise<string | undefined> {
    "use server";

    if (!date) {
      return "Veuillez sélectionner une date";
    }
    if (selected === "journey") {
      try {
        const session = await axios.post("/checkout-session/spa/journey", {
          spa: 1,
          date: "2024-01-06",
          successUrl:
            process.env.NEXT_PUBLIC_FRONT_URL +
            "/reservation/" +
            id +
            "/confirm",
          cancelUrl: process.env.NEXT_PUBLIC_FRONT_URL + "/reservation/" + id,
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
            successUrl:
              process.env.NEXT_PUBLIC_FRONT_URL +
              "/reservation/" +
              id +
              "/confirm",
            cancelUrl: process.env.NEXT_PUBLIC_FRONT_URL + "/reservation/" + id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return redirect(axiosResponse.data.url);
      } catch (e: any) {
        if (isRedirectError(e)) throw e;
        return e.response.data.message;
      }
    }
  }

  const {
    defaultDate,
    defaultType,
    defaultPrice,
    defaultMonth,
    defaultAvailableDates,
  } = await (async () => {
    const defaultType: "night" | "day" | "journey" = "night";
    const defaultMonth = DateTime.now().month;
    const startAt = DateTime.now().set({ month: defaultMonth, day: 1 });
    const endAt = startAt.plus({ month: 1 }).minus({ day: 1 });
    const defaultAvailableDates = await getAvailableDates(
      startAt.toISODate(),
      endAt.toISODate(),
      defaultType
    );
    if (!defaultAvailableDates.has(DateTime.now().toSQLDate())) {
      return {
        defaultDate: undefined,
        defaultType: defaultType,
        defaultPrice: undefined,
        defaultMonth: DateTime.now().month,
        defaultAvailableDates: new Set<string>(),
      };
    } else {
      const defaultPrice = await getPrice(
        DateTime.now().toISODate(),
        defaultType
      );
      return {
        defaultDate: new Date(),
        defaultType: defaultType,
        defaultPrice: defaultPrice,
        defaultMonth: defaultMonth,
        defaultAvailableDates: defaultAvailableDates,
      };
    }
  })();

  return (
    <>
      <div className="mx-4 mt-4">
        <div className="md:hidden">
          <DatePickerSmall
            onConfirm={onConfirm}
            getPrice={getPrice}
            getAvailableDates={getAvailableDates}
            defaultValue={{
              date: defaultDate,
              selected: defaultType,
              availableDates: defaultAvailableDates,
              price: defaultPrice,
              month: defaultMonth,
            }}
          />
        </div>
        <ImageCarousel
          images={data.spaImages.map(function (spaImage) {
            return (
              process.env.NEXT_PUBLIC_API_URL +
              "/attachment/image/" +
              spaImage.image.id
            );
          })}
        />
        <div className="xl:mx-46 lg:mx-24 md:mx-0 flex gap-8 flex-row py-8">
          <div className="w-full lg:w-2/3 md:w-1/2">
            <SpaDetails spa={data} />
          </div>
          <div className="w-full lg:w-1/3 md:w-1/2 h-fit gap-8 hidden md:flex">
            <Separator orientation="vertical" className="h-auto" />
            <div>
              <span className="text-2xl font-bold">à partir de 150 €</span>
              <DatePicker
                onConfirm={onConfirm}
                getPrice={getPrice}
                getAvailableDates={getAvailableDates}
                defaultValue={{
                  date: defaultDate,
                  selected: defaultType,
                  availableDates: defaultAvailableDates,
                  price: defaultPrice,
                  month: defaultMonth,
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
