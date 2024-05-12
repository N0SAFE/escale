'use server'

import { GroupsFilter, PaginationFilter, SearchFilter } from '@/types/filters'
import { CreateSpa, Spa, SpaImage, UpdateSpa } from '@/types/index'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getSpas(
    filter: GroupsFilter & SearchFilter & PaginationFilter = {}
) {
    'use server'

    const { data } = await xiorInstance.get<Spa[]>('/spas', {
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
    'use server'

    const { data } = await xiorInstance.get<Spa>(`/spas/${id}`)
    return data
}

export async function getImagesBySpa(id: number) {
    'use server'

    const { data } = await xiorInstance.get<SpaImage[]>(`/spas/${id}/images`)
    return data
}

export async function createSpa(data: CreateSpa) {
    'use server'

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
    'use server'

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
    'use server'

    await xiorInstance.delete(`/spas/${id}`)
}
