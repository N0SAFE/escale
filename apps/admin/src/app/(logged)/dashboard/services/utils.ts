import { Uuidable } from '@/types/index'
import { getServices } from '@/actions/Service'

export type DType = Uuidable<Awaited<ReturnType<typeof getServices>>[number]>

export async function servicesAccessor() {
    return (await getServices().then((services) =>
        services.map((s) => ({ ...s, uuid: s.id }))
    )) as DType[]
}
