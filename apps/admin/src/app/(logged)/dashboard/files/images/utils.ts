import { getSpas } from '@/actions/Spa'
import { getImages } from '@/actions/Image'
import { Spa, Uuidable } from '@/types/index'

export type DType = Uuidable<Awaited<ReturnType<typeof getImages>>[number]>

export async function imagesAccessor() {
    return (await getImages().then((availabilities) =>
        availabilities.map((s) => ({ ...s, uuid: s.id }))
    )) as DType[]
}
