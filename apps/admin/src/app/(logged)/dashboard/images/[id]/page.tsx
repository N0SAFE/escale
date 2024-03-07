import { getImage } from '../actions'

export default async function ServiceView({
    params,
}: {
    params: { id: string }
}) {
    const service = await getImage(+params.id)
    return <div>{JSON.stringify(service?.data)}</div>
}
