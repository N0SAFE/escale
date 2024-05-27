import { Spa } from '@/types/index'

type ViewSpaProps<T extends Spa> = {
    value: T
}

export default function ViewSpa<T extends Spa>({ value }: ViewSpaProps<T>) {
    return (
        <iframe
            className="rounded-2xl"
            src={process.env.NEXT_PUBLIC_FRONT_URL + '/reservation/' + value.id}
            width="100%"
            height="100%"
            allowFullScreen
        ></iframe>
    )
}
