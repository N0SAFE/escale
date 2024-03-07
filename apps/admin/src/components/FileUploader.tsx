'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Loader from './loader'
import { Button } from './ui/button'
import { SortableList } from './SortableList/SortableList'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/utils'

type FileUploaderProps<D> = {
    // onSortSuccess?: (array: { id: number; order: number }[]) => void;
    // onSortError?: (error: unknown) => void;
    // onUploadSuccess?: (data: D[]) => void;
    // onUploadError?: (error: unknown) => void;
    onSort?: (array: D[]) => Promise<void>
    onUpload?: (formData: FormData) => Promise<void>
    renderItem: (item: D) => React.ReactNode
    onUploadEnd?: () => void
    onSortStart?: () => void
    onSortEnd?: () => void //change this
    onUploadStart?: () => void
    data: D[] | undefined
    isLoading: boolean
}

export default function FileUploader<
    D extends {
        id: number
        order: number
    }
>({
    onSort,
    onSortStart,
    onSortEnd,
    onUpload,
    onUploadStart,
    onUploadEnd,
    renderItem,
    data,
    isLoading,
    className,
}: React.HtmlHTMLAttributes<HTMLDivElement> & FileUploaderProps<D>) {
    const inputFileRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<any[]>([])
    useEffect(() => {
        setImages(
            data?.map?.((spaImage: any) => ({
                id: spaImage.order, // due to limitation in a package the order has to be named id and the id has to be named lastId to keep track of it
                lastId: spaImage.id,
                image: spaImage.image,
            })) || []
        )
    }, [data])

    async function handleOrderChange(array: D[]) {
        onSortStart?.()
        setImages(array)
        const sorted = array.map((item, index) => ({
            ...item,
            id: (item as any).lastId,
            order: index + 1,
        }))
        await onSort?.(sorted)
        onSortEnd?.()
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        if (Object.values(e.target.files).length === 0) {
            return
        }
        onUploadStart?.()
        const formData = new FormData()
        Object.values(e.target.files).map((file) => {
            formData.append('images[]', file)
        })
        await onUpload?.(formData)
        onUploadEnd?.()
        // .then(async () => {
        //     await refetch().then(function (d) {
        //         setIsUpdating(false);
        //         if (onUploadSuccess) {
        //             onUploadSuccess(d.data?.data!);
        //         }
        //         onUploadEnd();
        //     });
        // })
        // .catch((e) => {
        //     if (onUploadError) {
        //         onUploadError(e);
        //     }
        //     onUploadEnd();
        // })
    }

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <Button
                variant="ghost"
                className="border-2 border-dashed border-gray-200 rounded-lg w-full p-6 flex items-center justify-center hover:bg-slate-200"
                onClick={() => inputFileRef?.current?.click()}
            >
                <FileIcon className="w-6 h-6" />
                <div className="text-sm text-gray-500">
                    Drag and drop your files here
                </div>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={inputFileRef}
                    onChange={handleFileUpload}
                />
            </Button>
            {isLoading && !data ? (
                <div className="bg-slate-300 z-10 bg-opacity-60 flex items-center justify-center grow rounded-lg">
                    <Loader />
                </div>
            ) : (
                <ScrollArea>
                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-slate-300 z-10 bg-opacity-60 flex items-center justify-center">
                                <Loader />
                            </div>
                        )}

                        <SortableList
                            items={images}
                            onChange={handleOrderChange}
                            renderItem={(item) => (
                                <SortableList.Item id={item.id} key={item.id}>
                                    {renderItem({
                                        ...item,
                                        id: item.lastId,
                                        order: item.id,
                                        image: item.image,
                                    })}
                                </SortableList.Item>
                            )}
                        />
                    </div>
                </ScrollArea>
            )}
        </div>
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
