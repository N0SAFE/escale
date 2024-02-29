"use client" // @flag color picker

import Comment from "@/components/Comment";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
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
    const [color, setColor] = useState('#000000') // @flag color picker
    console.log(color) // @flag color picker
    return (
        <main className="flex min-h-screen flex-col items-center justify-between text-white" style={{ backgroundColor: color }}>
            {/* @flag color picker */}
             <div className="bg-[#fff] absolute text-black p-4"> 
                {/* @flag color picker */}
                <span>changer la couleur ici</span>
                {/* @flag color picker */}
                <Input type="color" onChange={(e) => setColor(e.target.value)} />
            </div>
            <section>
                <Image src="/20240212_192351.jpg" alt="Picture of the author" className="object-cover h-[600px]" width={1980} height={1080} />
            </section>
            <section className="py-24 px-4 text-3xl leading-6 text-center md:p-24">
                <p>Venez découvrir notre Maison avec spa privatif à seulement 40 minutes de Paris. Séjour idéal pour passer un moment de détente en amoureux ou entre amis</p>
            </section>
            <section className="max-w-[60%] my-8">
                <video src="/video_lescale.mp4" autoPlay loop muted playsInline controlsList="nodownload"></video>
            </section>

            <section>
                
            </section>
            <section className="bg-[url('https://so-spa.fr/wp-content/uploads/2022/07/2022-07-05_16h16_44.png')] bg-cover bg-no-reapeat bg-center w-full background-color-[#27355DED] backdrop-filter-blur-[30px] relative">
                <div className="h-full w-full opacity-75 bg-[#525252ED] absolute"></div>
                <Comment comments={comments} />
            </section>
        </main>
    );
}
