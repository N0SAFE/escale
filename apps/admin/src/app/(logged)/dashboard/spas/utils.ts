import { getSpas } from '@/actions/Spa'
import { Uuidable } from '@/types/index'

export type DType = Uuidable<Awaited<ReturnType<typeof getSpas>>[number]>

export async function spasAccessor() {
    return (await getSpas().then((spas) => {
        return spas.map((spa) => {
            return {
                ...spa,
                uuid: spa.id,
            }
        })
    })) as DType[]
}
