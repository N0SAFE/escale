import React, { useEffect, useRef, useState } from 'react'

type ApiVideoProps = {
    sourcesIdentifier: number[]
}

export default function ApiVideo({
    alt,
    sourcesIdentifier,
    ...props
}: ApiVideoProps &
    React.DetailedHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
    > & { alt: string; sourcesIdentifier: number[] }) {
    const videoRef = useRef<HTMLVideoElement>(null)

    const sourcesIdentifierString = sourcesIdentifier.join(',')

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load()
        }
    }, [sourcesIdentifierString])

    return (
        <video {...props} ref={videoRef}>
            {sourcesIdentifier.map((sourceIdentifier) => {
                return (
                    <source
                        key={sourceIdentifier}
                        src={
                            process.env.NEXT_PUBLIC_API_URL +
                            '/attachment/video/' +
                            sourceIdentifier
                        }
                    />
                )
            })}
            {alt}
        </video>
    )
}
