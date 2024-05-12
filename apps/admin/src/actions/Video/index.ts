'use server'

import VideoReference, {
    CreateVideo,
    UpdateVideo,
    Video,
} from '@/types/model/Video'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getVideos<R extends string[] = []>() {
    'use server'

    return await xiorInstance
        .get<Video<[...R, VideoReference.sources]>[]>('/videos')
        .then(function ({ data }) {
            return data
        })
}

export async function getVideo(id: number) {
    'use server'

    return await xiorInstance
        .get<Video>(`/videos/${id}`)
        .then(function ({ data }) {
            return data
        })
}

export async function updateVideo(id: number, data: FormData) {
    'use server'

    return xiorInstance
        .patch<UpdateVideo>(`/videos/${id}`, data)
        .then(function ({ data }) {
            return data
        })
}

export async function createVideo<R extends string[] = []>(
    data: FormData
): Promise<Video<[...R, VideoReference.sources]> | undefined> {
    'use server'

    return await xiorInstance
        .post<CreateVideo>('/videos', data)
        .then(function ({ data }) {
            return data as unknown as Video<[...R, VideoReference.sources]>
        })
}

export async function deleteVideo(id: number) {
    'use server'

    await xiorInstance.delete(`/videos/${id}`).then(function ({ data }) {
        return data
    })
}
