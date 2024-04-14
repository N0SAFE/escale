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

type FileType = {
    id: number
    file: File
}

type SelectedFileType<T extends FileType> =
    | {
          new: true
          file: Blob
      }
    | {
          new: false
          file: T
      }

type FileSelectorProps<T extends FileType> = {
    onFileSelect?: (file: SelectedFileType<T>) => void
    files: T[] | undefined
    renderNull?: () => React.ReactNode
    renderFile?: (selectedFile: SelectedFileType<T>) => React.ReactNode
    renderFileList?: (selectedFile: SelectedFileType<T>) => React.ReactNode
    defaultSelectedFile?: T
}

export default function FileSelector<T extends FileType>({
    files,
    onFileSelect,
    renderFile,
    renderFileList,
    renderNull,
    defaultSelectedFile,
}: FileSelectorProps<T>) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = React.useState<
        | {
              new: true
              file: Blob
          }
        | {
              new: false
              file: T
          }
        | null
    >(
        defaultSelectedFile
            ? {
                  new: false,
                  file: defaultSelectedFile,
              }
            : null
    )

    const url = useMemo(() => {
        if (selectedFile?.new) {
            return URL.createObjectURL(selectedFile.file)
        } else if (selectedFile?.file) {
            return (
                process.env.NEXT_PUBLIC_API_URL +
                '/attachment/image/' +
                selectedFile.file.id
            )
        }
        return null
    }, [selectedFile])

    const handleFileSelect = (file: T) => {
        setSelectedFile({
            new: false,
            file,
        })
        onFileSelect?.({
            new: false,
            file,
        })
    }

    useEffect(() => {
        if (defaultSelectedFile) {
            setSelectedFile({
                new: false,
                file: defaultSelectedFile,
            })
        }
    }, [defaultSelectedFile])

    return (
        <div className="flex flex-col gap-4">
            <div className="h-24 flex justify-center items-center">
                <div className="h-8 w-8 cursor-pointer bg-slate-800 rounded-full flex items-center justify-center">
                    <Upload
                        className="w-4 h-4"
                        onClick={function () {
                            inputRef?.current?.click?.()
                        }}
                    />
                </div>
                <Input
                    className="hidden"
                    type="file"
                    ref={inputRef}
                    onChange={function (e) {
                        const file = e.target.files?.[0]
                        if (file) {
                            const selectedFile = {
                                new: true as const,
                                file,
                            }
                            setSelectedFile(selectedFile)
                            onFileSelect?.(selectedFile)
                        }
                    }}
                />
            </div>

            <div className="h-48 w-full">
                {selectedFile ? (
                    renderFile ? (
                        renderFile(selectedFile)
                    ) : (
                        <Image
                            alt="Product image"
                            className="h-full object-cover w-full"
                            src={url!}
                            width="200"
                            height="200"
                        />
                    )
                ) : (
                    <div className="flex items-center justify-center h-full">
                        {renderNull ? (
                            renderNull()
                        ) : (
                            <Image
                                className="h-full object-cover w-full"
                                src="/placeholder.svg"
                                alt="Empty file"
                                width={400}
                                height={400}
                            />
                        )}
                    </div>
                )}
            </div>

            <Card className="w-full max-h-96 overflow-y-auto">
                <CardContent>
                    <Command>
                        <CommandList className="scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                            <CommandInput
                                className="flex flex-col items-center justify-center"
                                placeholder="search file"
                            />
                            <CommandEmpty className="flex flex-col items-center justify-center">
                                <Upload className="w-16 h-16" />
                                <div className="text-gray-500">Select file</div>
                            </CommandEmpty>
                            <div className="grid grid-cols-4 gap-2">
                                {files?.map((file) => (
                                    <CommandItem
                                        value={file.file.name}
                                        key={file.id}
                                    >
                                        <Button
                                            key={file.id}
                                            className="w-full max-w-full h-full"
                                            variant={'ghost'}
                                            onClick={() =>
                                                handleFileSelect(file)
                                            }
                                        >
                                            <span className="sr-only">
                                                Select image
                                            </span>
                                            <Image
                                                alt="Product image"
                                                className="w-16 rounded-md object-cover h-16"
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_API_URL +
                                                    '/attachment/image/' +
                                                    file.id
                                                }
                                                width="200"
                                                height="200"
                                            />
                                        </Button>
                                    </CommandItem>
                                ))}
                            </div>
                        </CommandList>
                    </Command>
                </CardContent>
            </Card>
        </div>
    )
}
