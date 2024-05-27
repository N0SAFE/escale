import Relations, {
    CreateService,
    Service,
    UpdateService,
} from '@/types/model/Service'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getServices() {
    const { data } =
        await xiorInstance.get<Service<[typeof Relations.image]>[]>('/services')
    return data
}

export async function getService(id: number) {
    const { data } = await xiorInstance.get<Service>(`/services/${id}`)
    return data
}

export async function createService(data: CreateService) {
    const transformedData = {
        label: data.label,
        description: data.description,
        image: data.imageId,
    }
    await xiorInstance.post<CreateService>('/services', transformedData)
}

export async function updateService(id: number, data?: UpdateService) {
    if (!data) {
        return
    }
    const transformedData = {
        label: data.label,
        description: data.description,
        image: data.imageId,
    }
    await xiorInstance.patch(`/services/${id}`, transformedData)
}

export async function deleteService(id: number) {
    await xiorInstance.delete(`/services/${id}`)
}
