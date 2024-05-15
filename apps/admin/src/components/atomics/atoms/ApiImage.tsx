import { useAttachmentUrl } from '@/hooks/useAttachmentUrl'
import Image, { ImageProps } from 'next/image'
import React from 'react'

type ApiImageProps = {
    path: string
}

export default function ApiImage({
    path,
    alt,
    ...props
}: ApiImageProps & Omit<ImageProps, 'src'>) {
    const attachmentUrl = useAttachmentUrl(path)!
    return <Image alt={alt} priority {...props} src={attachmentUrl} />
}
