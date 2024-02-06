// import Swiper core and required modules
import { Navigation, Pagination, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import { AvatarImage, Avatar } from "@/components/ui/avatar"

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css";

type Props = {
    comments: { id: string; text: string; user: { id: string; name: string; avatar: string } }[];
};

export default function Comment({ comments }: Props) {
    return (
        <Swiper
            // install Swiper modules
            style={{
                marginTop: "24px",
                marginBottom: "24px",
                marginLeft: "5%",
                marginRight: "5%",
                paddingTop: "24px",
                paddingBottom: "24px",
                paddingLeft: "2%",
                paddingRight: "2%"
            }}
            breakpoints={{
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 24,
                },
                // when window width is >= 480px
                480: {
                    slidesPerView: 1,
                    spaceBetween: 24
                },
                // when window width is >= 640px
                640: {
                    slidesPerView: 2,
                    spaceBetween: 24
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 32,
                    slidesPerGroup: 1
                }
            }}
            modules={[Navigation, A11y]}
            spaceBetween={50}
            slidesPerView={3}
            navigation
            onSwiper={(swiper) => console.log(swiper)}
        >
            {comments.map((comment) => (
                <SwiperSlide key={comment.id} style={{display: "flex", justifyContent: "center"}}>
                    <div className="flex flex-col items-center text-center w-80">
                        <Avatar>
                            <AvatarImage alt="Lisa" src={`https://picsum.photos/48?random=${comment.id}`} />
                        </Avatar>
                        <p className="mt-4 text-sm text-slate-200">&quot;Franchement, vraiment TOP on a passé un super week-end. Merci pour tout et on compte réserver encore !&quot;</p>
                        <p className="mt-2 font-semibold text-slate-300">Lisa</p>
                        <p className="text-xs text-slate-100">Rumilly, France</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        // <Carousel
        //     opts={{
        //         align: "start",
        //         inViewThreshold: 0,
        //         loop: true,
        //         breakpoints: {
        //             320: {

        //             }
        //         }
        //     }}
        //     className="w-full max-w-lg items-center justify-center mx-auto flex"
        // >
        //     <CarouselContent>
        //         {Array.from({ length: 5 }).map((_, index) => (
        //             <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
        //                 <div className="p-1">
        //                     <Card>
        //                         <CardContent className="flex aspect-square items-center justify-center p-6">
        //                             <span className="text-3xl font-semibold">{index + 1}</span>
        //                         </CardContent>
        //                     </Card>
        //                 </div>
        //             </CarouselItem>
        //         ))}
        //     </CarouselContent>
        //     <CarouselPrevious />
        //     <CarouselNext />
        // </Carousel>
    );
}
