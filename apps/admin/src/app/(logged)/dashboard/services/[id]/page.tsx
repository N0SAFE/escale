import { getService } from '../actions'

export default async function ServiceView({
    params,
}: {
    params: { id: string }
}) {
    const service = await getService(+params.id)
    return <div>{JSON.stringify(service)}</div>
}
