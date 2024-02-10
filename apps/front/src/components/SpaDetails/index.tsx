import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconName, IconProp } from "@fortawesome/fontawesome-svg-core";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";

type Props = {
    spa: {
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
};

export default function SpaDetails({ spa }: Props) {
    return (
        <div className="text-black">
            <h1>{spa.title}</h1>
            <div className="grid-cols-3 grid">
                {spa.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                        <FontAwesomeIcon icon={tag.icon as IconProp} width={30} height={30} />
                        <span>
                            {tag.number} {tag.label}
                        </span>
                    </div>
                ))}
            </div>
            <div className="py-16">
                <p>{spa.description}</p>
            </div>
            <h3 className="text-2xl">Les Services</h3>
            <div className="grid grid-cols-4 gap-4 pt-8">
                {spa.services.map((service, index) => (
                    <div key={index}>
                        <AspectRatio ratio={4 / 3}>
                            <Image src={service.image} alt={service.label} width={300} height={100} className="rounded-lg h-full w-full" />
                        </AspectRatio>
                        <p>{service.label}</p>
                    </div>
                ))}
            </div>
            {/* <img src={spa.image} alt={spa.name} /> */}
        </div>
    );
}
