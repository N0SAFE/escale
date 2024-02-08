import DatePickerSmall from "@/components/DatePicker/Small/index";
import DatePicker from "@/components/DatePicker/index";
import ImageCarousel from "@/components/ImageCarousel/index";
import SpaDetails from "@/components/SpaDetails/index";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

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
    console.log(data);
    return (
        <>
            <div className="mx-4 mt-4">
                <div className="md:hidden">
                    <DatePickerSmall />
                </div>
                <ImageCarousel images={data.images} />
                <div className="xl:ml-66 xl:mr-66 lg:mr-35 lg:ml-36 md:mr-24 md:ml-24 flex gap-2 flex-row">
                    <div className="w-full lg:w-2/3 md:w-1/2">
                        <SpaDetails spa={data} />
                    </div>
                    <div className="w-full lg:w-1/3 md:w-1/2 h-[100px] gap-2 hidden md:flex">
                        <Separator orientation="vertical" />
                        <div>
                            <DatePicker />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reservation;
