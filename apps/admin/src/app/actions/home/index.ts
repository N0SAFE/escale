'use server'

import HomeRelations, { Home, UpdateHome } from '@/types/model/Home'
import { xiorInstance } from '@/utils/xiorInstance'
import VideoRelations from '@/types/model/Video'

export const getHomeDetails = async <R extends string[] = []>(): Promise<
    Home<
        [
            ...R,
            HomeRelations.homeComments,
            HomeRelations.video,
            VideoRelations.sources
        ]
    >
> => {
    'use server'

    console.log('get home details')
    const { data } = await xiorInstance.get<
        Home<
            [
                ...R,
                HomeRelations.homeComments,
                HomeRelations.video,
                VideoRelations.sources
            ]
        >
    >('/home')
    return data
}

export const updateHomeDetails = async (data: UpdateHome) => {
    'use server'

    console.log('update home details')
    const transformedData = {
        description: data.description,
        imageId: data.imageId,
        videoId: data.videoId,
        commentIds: data.commentIds,
    }
    await xiorInstance.patch('/home', transformedData)
}
