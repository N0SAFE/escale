'use server'

import { CreateImage, Image, UpdateImage } from '@/types/index'
import { axiosInstance } from '@/utils/axiosInstance'

export async function getImages() {
    'use server'

    try {
        // console.log(axiosInstance.defaults.baseURL)
        const { data } = await axiosInstance.get<Image[]>('/images')
        // console.log('data')
        // console.log(data)
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function getImage(id: number) {
    'use server'

    try {
        const { data } = await axiosInstance.get<Image>(`/images/${id}`)
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function createImage(data: FormData) {
    'use server'

    // console.log(Array.from(data.entries()))

    await axiosInstance.post<CreateImage>('/images', data)
}

export async function updateImage(id: number, data?: UpdateImage) {
    'use server'

    if (!data) {
        return
    }
    const transformedData = {
        alt: data.alt,
        name: data.name,
    }
    await axiosInstance
        .patch(`/images/${id}`, transformedData)
        .catch(function (e) {
            console.log(e)
            throw e
        })
}

export async function deleteImage(id: number) {
    'use server'

    await axiosInstance.delete(`/images/${id}`)
}
