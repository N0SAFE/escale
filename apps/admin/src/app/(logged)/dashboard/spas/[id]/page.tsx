import { getSpa } from "../actions"

export default async function SpaDetails ({ params }: { params: { id: string } }) {
    return <iframe className="rounded-2xl" src={process.env.NEXT_PUBLIC_FRONT_URL + "/reservation/" + params.id} width="100%" height="100%" allowFullScreen></iframe>
}