import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconName, IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
    spa: {
        tags: {
            icon: IconProp;
            label: string;
            number: number;
        }[];
        name: string;
        description: string;
        image: string;
    };
};

export default function SpaDetails({ spa }: Props) {
    return (
        <div className="text-black">
            <h1>{spa.name}</h1>
            <div className="grid-cols-4">
                {spa.tags.map((tag, index) => (
                    <div key={index}>
                        <FontAwesomeIcon icon={tag.icon} height={20} width={20}/>
                        <p>{tag.label}</p>
                        <p>{tag.number}</p>
                    </div>
                ))}
            </div>
            <p>{spa.description}</p>
            <img src={spa.image} alt={spa.name} />
        </div>
    );
}
