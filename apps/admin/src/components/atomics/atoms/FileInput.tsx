import { useRef, useState } from 'react'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'

type FileInputProps = Omit<
    React.HTMLAttributes<HTMLButtonElement>,
    'variant'
> & {
    onUpload: (files: FileList | null) => void
    multiple?: boolean
}

export default function FileInput({
    onUpload,
    className,
    onClick,
    multiple,
    ...props
}: FileInputProps) {
    const inputFileRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<FileList | null>(null)
    console.log(files)
    return (
        <Button
            {...props}
            variant="ghost"
            className={cn(
                'border-2 border-dashed border-gray-200 rounded-lg p-6 flex items-center justify-center hover:bg-slate-200 w-fit gap-2',
                className
            )}
            onClick={(e) => {
                inputFileRef?.current?.click()
                onClick && onClick(e)
            }}
        >
            <FileIcon className="w-6 h-6" />
            <span className="text-sm text-gray-500 text-ellipsis overflow-hidden">
                {files?.length
                    ? files.length > 1
                        ? files.length + 'file selected'
                        : files[0] instanceof File
                        ? files[0].name
                        : files[0]
                    : 'Drag and drop your files here'}
            </span>
            <input
                type="file"
                multiple
                className="hidden"
                ref={inputFileRef}
                onChange={(e) => {
                    setFiles(e.target.files)
                    onUpload(e.target.files)
                }}
            />
        </Button>
    )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    )
}
