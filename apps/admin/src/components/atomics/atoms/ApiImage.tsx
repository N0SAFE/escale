import { useAttachmentUrl } from '@/hooks/useAttachmentUrl'
import Image, { ImageProps } from 'next/image'
import React from 'react'

type ApiImageProps = {
    identifier: number
}

export default function ApiImage({
    identifier,
    alt,
    ...props
}: ApiImageProps & Omit<ImageProps, 'src'>) {
    const attachmentUrl = useAttachmentUrl(identifier, 'image')!
    return <Image alt={alt} {...props} src={attachmentUrl} />
}
