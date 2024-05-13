import { useMemo } from 'react'

type AttachmentType = 'image' | 'video'
type AttachmentId = number

export function createAttachmentUrl(path: string | undefined) {
    if (!path) {
        return null
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`
}

export function useAttachmentUrl(path: string | undefined) {
    return useMemo(() => {
        if (!path) {
            return null
        }
        return createAttachmentUrl(path)
    }, [path])
}
