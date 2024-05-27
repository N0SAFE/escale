import { Upload } from 'lucide-react'
import Image from 'next/image'

type ImageShowcaseProps = {
    useUpload?: boolean
}

export default function ImageShowcase({ useUpload }: ImageShowcaseProps) {
    return (
        <div className="grid gap-2">
            <Image
                alt="Product image"
                className="aspect-square w-full rounded-md object-cover"
                height="300"
                src="/placeholder.svg"
                width="300"
            />
            <div className="grid grid-cols-3 gap-2">
                <button>
                    <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src="/placeholder.svg"
                        width="84"
                    />
                </button>
                <button className="relative">
                    <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src="/placeholder.svg"
                        width="84"
                    />
                    <div className="absolute right-2 top-2">+2</div>
                </button>
                <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                    {useUpload ? (
                        <>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                        </>
                    ) : (
                        <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src="/placeholder.svg"
                            width="84"
                        />
                    )}
                </button>
            </div>
        </div>
    )
}
