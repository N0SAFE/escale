import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { File } from '@/types/index'
import { CommandEmpty } from 'cmdk'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import ApiImage from '../atoms/ApiImage'
import Loader from '../atoms/Loader'
import { toast } from 'sonner'

type FileSelectorProps<T extends { id: number }> = {
    inputAccept?: string
    onFileSelect?: (selectedFile: T) => void
    onFileUpload?: (file: Blob) => T | Promise<T>
    onFileDelete?: (file: T) => void
    files: T[] | undefined
    renderNull?: () => React.ReactNode
    renderFile?: (selectedFile: T) => React.ReactNode
    renderFileList?: (selectedFile: T) => React.ReactNode
    defaultSelectedFile?: T
    defaultSelectedFileId?: number
    isUploading?: boolean
    isLoading?: boolean
}

export default function FileSelector<T extends { id: number }>({
    inputAccept,
    files,
    onFileSelect,
    onFileUpload,
    onFileDelete,
    renderFile,
    renderFileList,
    renderNull,
    defaultSelectedFile,
    defaultSelectedFileId,
    isLoading,
}: FileSelectorProps<T>) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = React.useState<T | null>(
        defaultSelectedFile || null
    )
    const [isUploading, setIsUploading] = React.useState(false)

    const handleFileSelect = (file: T) => {
        setSelectedFile(file)
        onFileSelect?.(file)
    }

    useEffect(() => {
        if (defaultSelectedFile) {
            setSelectedFile(defaultSelectedFile)
        }
    }, [defaultSelectedFile])

    useEffect(() => {
        if (defaultSelectedFileId) {
            const file = files?.find(
                (file) => file.id === defaultSelectedFileId
            )
            if (file) {
                setSelectedFile(file)
            }
        }
    }, [defaultSelectedFileId, files])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex h-24 items-center justify-center">
                <div
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-800 "
                    onClick={function () {
                        inputRef?.current?.click?.()
                    }}
                >
                    {isUploading ? (
                        <Loader className="h-4 w-4" />
                    ) : (
                        <Upload className="h-4 w-4" />
                    )}
                </div>
                <Input
                    accept={inputAccept ? inputAccept : 'image/*'}
                    className="hidden"
                    type="file"
                    ref={inputRef}
                    onChange={async function (e) {
                        const file = e.target.files?.[0]
                        if (file) {
                            setIsUploading(true)
                            try {
                                const uploadedFile = await onFileUpload?.(file)
                                setIsUploading(false)
                                if (!uploadedFile) return
                                setSelectedFile(uploadedFile)
                                onFileSelect?.(uploadedFile)
                            } catch {
                                setIsUploading(false)
                                toast.error(
                                    'an error occured while uploading file'
                                )
                            }
                        }
                    }}
                />
            </div>

            <div className="h-48 w-full">
                {selectedFile ? (
                    renderFile ? (
                        renderFile(selectedFile)
                    ) : (
                        selectedFile.id
                    )
                ) : (
                    <div className="flex h-full items-center justify-center">
                        {renderNull ? (
                            renderNull()
                        ) : (
                            <Image
                                className="h-full w-full object-none"
                                src="/placeholder.svg"
                                alt="Empty file"
                                width={400}
                                height={400}
                            />
                        )}
                    </div>
                )}
            </div>

            <Card className="max-h-96 w-full overflow-y-auto">
                <CardContent>
                    <Command
                        value={selectedFile ? `${selectedFile.id}` : undefined}
                    >
                        <CommandList className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
                            <div className="flex flex-col gap-2">
                                <CommandInput
                                    className="flex flex-col items-center justify-center"
                                    placeholder="search file"
                                />
                                <CommandEmpty className="flex flex-col items-center justify-center">
                                    <Upload className="h-16 w-16" />
                                    <div className="text-gray-500">
                                        Select file
                                    </div>
                                </CommandEmpty>
                                <div className="grid grid-cols-4 gap-2">
                                    {files?.map((file) => (
                                        <ContextMenu key={file.id}>
                                            <ContextMenuTrigger>
                                                <CommandItem
                                                    value={`${file.id}`}
                                                >
                                                    <Button
                                                        key={file.id}
                                                        className={
                                                            'h-full w-full max-w-full'
                                                        }
                                                        variant={'ghost'}
                                                        onClick={() => {
                                                            handleFileSelect(
                                                                file
                                                            )
                                                            setSelectedFile(
                                                                file
                                                            )
                                                        }}
                                                    >
                                                        {renderFileList ? (
                                                            renderFileList(file)
                                                        ) : (
                                                            <>
                                                                <span className="sr-only">
                                                                    Select image
                                                                </span>
                                                                {file.id}
                                                            </>
                                                        )}
                                                    </Button>
                                                </CommandItem>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent>
                                                <ContextMenuItem
                                                    onClick={() =>
                                                        onFileDelete?.(file)
                                                    }
                                                    className={cn(
                                                        'text-red-500',
                                                        'hover:bg-red-500',
                                                        'hover:text-white'
                                                    )}
                                                >
                                                    Delete
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    ))}
                                </div>
                            </div>
                        </CommandList>
                    </Command>
                </CardContent>
            </Card>
        </div>
    )
}
