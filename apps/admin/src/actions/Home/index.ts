import HomeRelations, { Home, UpdateHome } from '@/types/model/Home'
import { xiorInstance } from '@/utils/xiorInstance'
import VideoRelations from '@/types/model/Video'

export const getHomeDetails = async <R extends string[] = []>(): Promise<
    Home<
        [
            ...R,
            HomeRelations.homeComments,
            HomeRelations.video,
            HomeRelations.image,
            HomeRelations.commentBackgroundImage,
            VideoRelations.sources,
        ]
    >
> => {
    const { data } = await xiorInstance.get<
        Home<
            [
                ...R,
                HomeRelations.homeComments,
                HomeRelations.video,
                HomeRelations.image,
                HomeRelations.commentBackgroundImage,
                VideoRelations.sources,
            ]
        >
    >('/home', {
        cache: 'no-store',
    })
    return data
}

export const updateHomeDetails = async (data: UpdateHome) => {
    const transformedData = {
        description: data.description,
        imageId: data.imageId,
        commentBackgroundImageId: data.commentBackgroundImageId,
        videoId: data.videoId,
        commentIds: data.commentIds,
    }
    await xiorInstance.patch('/home', transformedData)
}
