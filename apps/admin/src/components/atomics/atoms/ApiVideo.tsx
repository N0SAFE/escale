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

    useEffect(() => {
        console.log('sourcesIdentifier', sourcesIdentifier)
        if (videoRef.current) {
            videoRef.current.load()
        }
    }, [sourcesIdentifier.join(',')])

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
