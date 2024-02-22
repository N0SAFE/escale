import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconName, IconProp } from "@fortawesome/fontawesome-svg-core";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import Link from "next/link";

type Props = {
    spa: {
        google_maps_link: string;
        location: string;
        tags: {
            icon: string;
            label: string;
            number: number;
        }[];
        services: {
            label: string;
            image: string
        }[];
        id: number;
        images: {
            id: number,
            created_at: string,
            updated_at: string,
            alt: string,
            file_id: number
        }[];
        title: string;
        description: string;
    }
};

export default function SpaDetails({ spa }: Props) {
    return (
        <div>
            <h1 className="text-6xl my-8">{spa.title}</h1>
            <div className="mb-4">
                <Link className="underline underline-offset-4" href={spa.google_maps_link} target="_blank">{spa.location}</Link>
            </div>
            {/* <div className="grid-cols-3 grid">
                {spa.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                        <FontAwesomeIcon icon={tag.icon as IconProp} width={30} height={30} />
                        <span>
                            {tag.number} {tag.label}
                        </span>
                    </div>
                ))}
            </div> */}
            <div className="py-16">
                <p dangerouslySetInnerHTML={{ __html: spa.description}}></p>
            </div>
            <h3 className="text-2xl">Les Services</h3>
            <div className="grid grid-cols-3 gap-4 pt-8 md:grid-cols-3 lg:grid-cols-4">
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
