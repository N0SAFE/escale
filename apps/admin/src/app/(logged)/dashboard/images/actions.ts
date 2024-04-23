'use server'

import { CreateImage, Image, UpdateImage } from '@/types/index'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getImages() {
    'use server'

    // console.log(xiorInstance.defaults.baseURL)
    const { data } = await xiorInstance.get<Image[]>('/images')
    // console.log('data')
    // console.log(data)
    return data
}

export async function getImage(id: number) {
    'use server'

    const { data } = await xiorInstance.get<Image>(`/images/${id}`)
    return data
}

export async function createImage(formData: FormData) {
    'use server'

    // console.log(Array.from(data.entries()))

    const { data } = await xiorInstance.post<CreateImage>('/images', formData)
    return data as unknown as Image
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
    await xiorInstance
        .patch(`/images/${id}`, transformedData)
        .catch(function (e) {
            console.log(e)
            throw e
        })
}

export async function deleteImage(id: number) {
    'use server'

    await xiorInstance.delete(`/images/${id}`)
}
