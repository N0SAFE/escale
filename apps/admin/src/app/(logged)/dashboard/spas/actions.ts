'use server'

import { CreateSpa, Spa, SpaImage, UpdateSpa } from '@/types/index'
import { axiosInstance } from '@/utils/axiosInstance'

export async function getSpas() {
    'use server'

    try {
        // console.log(axiosInstance.defaults.baseURL)
        const { data } = await axiosInstance.get<Spa[]>('/spas')
        // console.log('data')
        // console.log(data)
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function getSpa(id: number) {
    'use server'

    try {
        const { data } = await axiosInstance.get<Spa>(`/spas/${id}`)
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function getImagesBySpa(id: number) {
    'use server'

    try {
        const { data } = await axiosInstance.get<SpaImage[]>(
            `/spas/${id}/images`
        )
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function createSpa(data: CreateSpa) {
    'use server'

    const transformedData = {
        title: data.title,
        description: data.description,
        location: data.location,
        googleMapsLink: data.google_maps_link,
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
        google_maps_link: data.google_maps_link,
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
