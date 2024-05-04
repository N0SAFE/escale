'use server'

import { Comment } from '@/types/model/Comment'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getComments() {
    'use server'

    const { data } = await xiorInstance.get<Comment[]>('/comments')
    return data
}

export async function getComment(id: number) {
    'use server'

    const { data } = await xiorInstance.get<Comment>(`/comments/${id}`)
    return data
}
