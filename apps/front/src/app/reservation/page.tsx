import DatePickerSmall from "@/components/DatePicker/Small/index";
import DatePicker from "@/components/DatePicker/index";
import ImageCarousel from "@/components/ImageCarousel/index";
import SpaDetails from "@/components/SpaDetails/index";
import { Separator } from "@/components/ui/separator";
import axios, { AxiosResponse } from "axios";
import { redirect } from "next/navigation";

type ReservationType = {
    id: number;
}[]

const Reservation = async () => {
    // this page is a placeholder for the first spa reservation
    console.log(axios.defaults.baseURL)
    const { data } = await axios<ReservationType>("/spas");
    redirect(`/reservation/${data?.[0]?.id}`);
};

export default Reservation;
