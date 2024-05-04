import { useMemo } from 'react'

type AttachmentType = 'image' | 'video'
type AttachmentId = number

export function createAttachmentUrl(
    attachmentId?: AttachmentId | undefined,
    attachmentType?: AttachmentType | undefined
) {
    if (!attachmentId || !attachmentType) {
        return null
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/attachment/${attachmentType}/${attachmentId}`
}

export function useAttachmentUrl(
    attachmentId: AttachmentId | null,
    attachmentType: AttachmentType | null
) {
    return useMemo(() => {
        if (!attachmentId || !attachmentType) {
            return null
        }
        return createAttachmentUrl(attachmentId, attachmentType)
    }, [attachmentId, attachmentType])
}
