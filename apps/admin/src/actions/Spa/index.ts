import {
    GroupsFilter,
    PaginationFilter,
    PropertyFilter,
    SearchFilter,
} from '@/types/filters'
import Relations, {
    Context,
    CreateSpa,
    Spa,
    UpdateSpa,
} from '@/types/model/Spa'
import { SpaImage } from '@/types/model/SpaImage'
import { Pretify } from '@/types/utils'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getSpas(
    filter: Pretify<
        GroupsFilter & SearchFilter & PropertyFilter & PaginationFilter
    > = {}
) {
    const { data } = await xiorInstance.get<
        Spa<Exclude<typeof filter.groups, undefined>>[]
    >('/spas', {
        params: {
            ...filter.search,
            groups: filter.groups,
            page: filter.page,
            limit: filter.limit,
        },
    })
    return data
}

export async function getSpa(id: number) {
    const { data } = await xiorInstance.get<Spa>(`/spas/${id}`)
    return data
}

export async function getImagesBySpa(id: number) {
    const { data } = await xiorInstance.get<SpaImage[]>(`/spas/${id}/images`)
    return data
}

export async function createSpa(data: CreateSpa) {
    const transformedData = {
        title: data.title,
        description: data.description,
        location: data.location,
        googleMapsLink: data.googleMapsLink,
        spaImages:
            data.spaImages?.map((spaImage) => ({
                image: spaImage.image.id,
                order: spaImage.order,
            })) || [],
        services: data.services?.map((service) => service.id) || [],
    }
    await xiorInstance.post<CreateSpa>('/spas', transformedData)
}

export async function updateSpa(id: number, data?: UpdateSpa) {
    if (!data) {
        return
    }
    const transformedData = {
        title: data.title,
        description: data.description,
        location: data.location,
        googleMapsLink: data.googleMapsLink,
        spaImages:
            data.spaImages?.map((spaImage) => ({
                image: spaImage.image.id,
                order: spaImage.order,
            })) || [],
        services: data.services?.map((service) => service.id) || [],
    }
    await xiorInstance.patch(`/spas/${id}`, transformedData)
}

export async function deleteSpa(id: number) {
    await xiorInstance.delete(`/spas/${id}`)
}
