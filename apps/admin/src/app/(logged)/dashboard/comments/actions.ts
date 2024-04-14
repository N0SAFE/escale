'use server'

import { Comment } from '@/types/index'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getComments() {
    'use server'

    // console.log(xiorInstance.defaults.baseURL)
    const { data } = await xiorInstance.get<Comment[]>('/comments')
    // console.log('data')
    // console.log(data)
    return data
}

export async function getComment(id: number) {
    'use server'

    const { data } = await xiorInstance.get<Comment>(`/comments/${id}`)
    return data
}
