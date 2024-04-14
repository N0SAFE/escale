import Image, { ImageProps } from 'next/image'
import { useRef } from 'react'

type InputVideoProps = React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
> & {
    defaultImageProps: ImageProps
}

export default function InputVideo(props: InputVideoProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    console.log('props.children', props.children)
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
            />
            {props.children ? (
                <video
                    {...props}
                    onClick={(e) => {
                        inputRef?.current?.click?.()
                        props?.onClick?.(e)
                    }}
                >
                    {props.children}
                </video>
            ) : (
                <Image
                    {...props.defaultImageProps}
                    alt={props.defaultImageProps?.alt || 'Video'}
                    onClick={(e) => {
                        inputRef?.current?.click?.()
                        props.defaultImageProps?.onClick?.(e)
                    }}
                />
            )}
        </>
    )
}
