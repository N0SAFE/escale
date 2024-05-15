import { Uuidable } from '@/types/index'
import { getAvailabilities } from '../actions'

export type DType = Uuidable<
    Awaited<ReturnType<typeof getAvailabilities>>[number]
>

export async function availabilitiesAccessor() {
    return (await getAvailabilities({
        groups: ['availabilities:spa'],
    }).then((availabilities) =>
        availabilities.map((s) => ({ ...s, uuid: s.id }))
    )) as DType[]
}
