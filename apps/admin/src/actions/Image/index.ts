import { CreateImage, Image, UpdateImage } from '@/types/index'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getImages() {
    const { data } = await xiorInstance.get<Image[]>('/images')
    return data
}

export async function getImage(id: number) {
    const { data } = await xiorInstance.get<Image>(`/images/${id}`)
    return data
}

export async function createImage(formData: FormData) {
    const { data } = await xiorInstance.post<CreateImage>('/images', formData)
    return data as unknown as Image
}

export async function updateImage(id: number, data?: UpdateImage) {
    if (!data) {
        return
    }
    const transformedData = {
        alt: data.alt,
        name: data.name,
    }
    await xiorInstance.patch(`/images/${id}`, transformedData)
}

export async function deleteImage(id: number) {
    await xiorInstance.delete(`/images/${id}`)
}
