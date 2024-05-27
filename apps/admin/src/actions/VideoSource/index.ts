import {
    CreateVideoSource,
    UpdateVideoSource,
    VideoSource,
} from '@/types/model/VideoSource'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getVideoSources() {
    return xiorInstance.get('/video-sources').then(function ({ data }) {
        return data
    })
}

export async function getVideoSource(id: number) {
    return xiorInstance
        .get<VideoSource>(`/video-sources/${id}`)
        .then(function ({ data }) {
            return data
        })
}

export async function getVideoSourcesByVideoId(videoId: number) {
    return xiorInstance
        .get<VideoSource>(`/videos/${videoId}/sources`)
        .then(function ({ data }) {
            return data
        })
}

export async function updateVideoSource(id: number, data: UpdateVideoSource) {
    const transformedData = {
        videoId: data.videoId,
    }
    return xiorInstance
        .patch<UpdateVideoSource>(`/video-sources/${id}`, transformedData)
        .then(function ({ data }) {
            return data
        })
}

export async function createVideoSource(data: CreateVideoSource) {
    const transformedData = {
        file: data.file,
        videoId: data.videoId,
    }
    await xiorInstance
        .post<CreateVideoSource>('/video-sources', transformedData)
        .then(function ({ data }) {
            return data
        })
}
