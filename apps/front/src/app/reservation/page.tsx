import DatePickerSmall from "@/components/DatePicker/Small/index";
import DatePicker from "@/components/DatePicker/index";
import ImageCarousel from "@/components/ImageCarousel/index";
import SpaDetails from "@/components/SpaDetails/index";
import { Separator } from "@/components/ui/separator";

const Reservation = async () => {
    return (
        <>
            <div className="mx-4 mt-4">
                <div className="md:hidden">
                    <DatePickerSmall />
                </div>
                <ImageCarousel images={["https://so-spa.fr/wp-content/uploads/2022/07/La-Falaise-web-4-1-scaled.jpg", "https://so-spa.fr/wp-content/uploads/2022/07/La-Falaise-web-4-1-scaled.jpg"]} />
                <div className="xl:ml-66 xl:mr-66 lg:mr-48 lg:ml-48 md:mr-24 md:ml-24 flex gap-2 flex-row">
                    <div className="w-full lg:w-2/3 md:w-1/2">
                        <SpaDetails
                            spa={{
                                name: "test",
                                tags: [
                                    {
                                        icon: ["fas", "spa"],
                                        label: "label",
                                        number: 1
                                    }
                                ],
                                description: "description",
                                image: "https://so-spa.fr/wp-content/uploads/2022/07/La-Falaise-web-4-1-scaled.jpg"
                            }}
                        />
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
