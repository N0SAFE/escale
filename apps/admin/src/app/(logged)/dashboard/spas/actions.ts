'use server'

import { GroupsFilter, PaginationFilter, SearchFilter } from '@/types/filters'
import { CreateSpa, Spa, SpaImage, UpdateSpa } from '@/types/index'
import { axiosInstance } from '@/utils/axiosInstance'

export async function getSpas(
    filter: GroupsFilter & SearchFilter & PaginationFilter = {}
) {
    'use server'

    // console.log(axiosInstance.defaults.baseURL)
    const { data } = await axiosInstance.get<Spa[]>('/spas', {
        params: {
            ...filter.search,
            groups: filter.groups,
            page: filter.page,
            limit: filter.limit,
        },
    })
    // console.log('data')
    // console.log(data)
    return data
}

export async function getSpa(id: number) {
    'use server'

    const { data } = await axiosInstance.get<Spa>(`/spas/${id}`)
    return data
}

export async function getImagesBySpa(id: number) {
    'use server'

    const { data } = await axiosInstance.get<SpaImage[]>(`/spas/${id}/images`)
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
    await axiosInstance.post<CreateSpa>('/spas', transformedData)
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
    await axiosInstance
        .patch(`/spas/${id}`, transformedData)
        .catch(function (e) {
            console.log(e)
            throw e
        })
}

export async function deleteSpa(id: number) {
    'use server'

    await axiosInstance.delete(`/spas/${id}`)
}
