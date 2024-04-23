'use server'

import { CreateFaq, Faq, UpdateFaq } from '@/types/index'
import { xiorInstance } from '@/utils/xiorInstance'

export const getFaqs = async () => {
    'use server'
    const { data } = await xiorInstance.get<Faq[]>('/faqs')
    return data
}

export const getFaq = async (id: number) => {
    'use server'
    const { data } = await xiorInstance.get<Faq>(`/faqs/${id}`)
    return data
}

export const updateFaq = async (id: number, data: UpdateFaq) => {
    'use server'

    console.log('update faq')

    const transformedData = {
        question: data.question,
        answer: data.answer,
        rank: data.rank,
    }
    await xiorInstance.patch<UpdateFaq>(`/faqs/${id}`, transformedData)
}

export const createFaq = async (data: CreateFaq) => {
    'use server'

    console.log('create faq')
    const transformedData = {
        question: data.question,
        answer: data.answer,
        rank: data.rank,
    }
    console.log(transformedData)
    try {
        console.log(
            await xiorInstance.post<CreateFaq>('/faqs', transformedData)
        )
    } catch (e) {
        console.log(e)
    }
}

export const deleteFaq = async (id: number) => {
    'use server'

    console.log('delete faq')
    await xiorInstance.delete(`/faqs/${id}`)
}

export const getSpas = async () => {
    'use server'

    return xiorInstance.get('/spas').then(function (spas) {
        return spas.data
    })
}
