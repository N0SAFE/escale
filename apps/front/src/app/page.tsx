"use client";

import Comment from "@/components/Comment";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const comments = [
    {
        id: "1",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "1",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    },
    {
        id: "2",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "2",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    },
    {
        id: "3",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "3",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    },
    {
        id: "4",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "4",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    },
    {
        id: "5",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "5",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    },
    {
        id: "6",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "6",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    },
    {
        id: "7",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "7",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    },
    {
        id: "8",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
        user: {
            id: "8",
            name: "John Doe",
            avatar: "https://picsum.photos/200"
        }
    }
];

export default function Home() {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-white">
            <section>
                <Image src="https://so-spa.fr/wp-content/uploads/2022/07/La-Falaise-web-4-1-scaled.jpg" alt="Picture of the author" className="object-cover h-[800px]" width={1980} height={1080} />
            </section>
            <section className="py-24 px-4 text-3xl leading-6 text-center text-black md:p-24">
                <p>Venez découvrir notre Maison avec spa privatif à seulement 40 minutes de Paris. Séjour idéal pour passer un moment de détente en amoureux ou entre amis</p>
            </section>
            <section>
                <video src="https://so-spa.fr/wp-content/uploads/2022/07/WhatsApp-Video-2022-06-26-at-18.53.25-1.mp4" autoPlay loop muted playsInline controlsList="nodownload"></video>
            </section>

            <section>
                <Card className="w-full max-w-lg items-center justify-center mx-auto flex">
                    <Carousel responsive={responsive}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="p-1">
                                <Card>
                                    <div className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-3xl font-semibold">{index + 1}</span>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </Carousel>
                </Card>
            </section>
            <section className="bg-[url('https://so-spa.fr/wp-content/uploads/2022/07/2022-07-05_16h16_44.png')] bg-cover bg-no-reapeat bg-center w-full background-color-[#27355DED] backdrop-filter-blur-[30px] relative">
                <div className="h-full w-full opacity-75 bg-[#525252ED] absolute"></div>
                <Comment comments={comments} />
            </section>
        </main>
    );
}
