'use client'

import { createAttachmentUrl } from '@/hooks/useAttachmentUrl'
import React, { useEffect, useRef, useState } from 'react'

type ApiVideoProps = {
    sourcesPath: string[]
}

export default function ApiVideo({
    alt,
    sourcesPath,
    ...props
}: ApiVideoProps &
    React.DetailedHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
    > & { alt: string; sourcesPath: string[] }) {
    const videoRef = useRef<HTMLVideoElement>(null)

    const sourcesIdentifierString = sourcesPath.join(',')

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load()
        }
    }, [sourcesIdentifierString])

    return (
        <video {...props} ref={videoRef}>
            {sourcesPath.map((sourcePath) => {
                return (
                    <source
                        key={sourcePath}
                        src={createAttachmentUrl(sourcePath)!}
                    />
                )
            })}
            {alt}
        </video>
    )
}
