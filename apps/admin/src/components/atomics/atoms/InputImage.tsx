import { useRef } from 'react'
import Image, { ImageProps } from 'next/image'

export default function InputImage(props: ImageProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
            />
            <Image
                {...props}
                alt={props.alt}
                onClick={(e) => {
                    inputRef?.current?.click?.()
                    props?.onClick?.(e)
                }}
            />
        </>
    )
}
