import { CreateFaq, Faq, UpdateFaq } from '@/types/index'
import { xiorInstance } from '@/utils/xiorInstance'

export const getFaqs = async () => {
    const { data } = await xiorInstance.get<Faq[]>('/faqs', {
        cache: 'no-store',
    })
    return data
}

export const getFaq = async (id: number) => {
    const { data } = await xiorInstance.get<Faq>(`/faqs/${id}`)
    return data
}

export const updateFaq = async (id: number, data: UpdateFaq) => {
    const transformedData = {
        question: data.question,
        answer: data.answer,
        rank: data.rank,
    }
    await xiorInstance.patch<UpdateFaq>(`/faqs/${id}`, transformedData)
}

export const createFaq = async (data: CreateFaq) => {
    const transformedData = {
        question: data.question,
        answer: data.answer,
        rank: data.rank,
    }
    await xiorInstance.post<CreateFaq>('/faqs', transformedData)
}

export const deleteFaq = async (id: number) => {
    await xiorInstance.delete(`/faqs/${id}`)
}

export const getSpas = async () => {
    return xiorInstance.get('/spas').then(function (spas) {
        return spas.data
    })
}
