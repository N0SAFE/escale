'use server'

import { CreateService, Service, UpdateService } from '@/types/index'
import { axiosInstance } from '@/utils/axiosInstance'

export async function getServices() {
    'use server'

    // console.log(axiosInstance.defaults.baseURL)
    const { data } = await axiosInstance.get<Service[]>('/services')
    // console.log('data')
    // console.log(data)
    return data
}

export async function getService(id: number) {
    'use server'

    const { data } = await axiosInstance.get<Service>(`/services/${id}`)
    return data
}

export async function createService(data: CreateService) {
    'use server'

    const transformedData = {
        label: data.label,
        description: data.description,
        image: data.image?.id,
    }
    await axiosInstance.post<CreateService>('/services', transformedData)
}

export async function updateService(id: number, data?: UpdateService) {
    'use server'

    if (!data) {
        return
    }
    const transformedData = {
        label: data.label,
        description: data.description,
        image: data.image?.id,
    }
    await axiosInstance
        .patch(`/services/${id}`, transformedData)
        .catch(function (e) {
            console.log(e)
            throw e
        })
}

export async function deleteService(id: number) {
    'use server'

    await axiosInstance.delete(`/services/${id}`)
}
