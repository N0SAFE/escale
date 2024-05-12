'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getComment } from '@/actions/Comment'
import Loader from '@/components/atomics/atoms/Loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { UpdateImage } from '@/types/index'
import ApiImage from '@/components/atomics/atoms/ApiImage'

export default function ServiceEdit() {
    // const params = useParams<{ id: string }>()
    // const { data: image, isFetched } = useQuery({
    //     queryKey: ['service', +params.id],
    //     queryFn: async () => getImage(+params.id),
    // })
    // const [imageState, setImageState] = useState<UpdateImage>()
    // const serviceMutation = useMutation({
    //     mutationFn: async (imageState: UpdateImage) => {
    //         console.log(imageState)
    //         return await updateImage(+params.id, imageState)
    //     },
    //     onError: (error) => {
    //         toast.error('server error')
    //     },
    //     onSuccess: (data) => {
    //         toast.success('Service updated')
    //     },
    // })
    // useEffect(() => {
    //     setImageState({
    //         name: image?.file?.name,
    //         alt: image?.alt,
    //     })
    // }, [image])
    // if (!isFetched) {
    //     return (
    //         <div className="w-full h-full flex items-center justify-center">
    //             <Loader />
    //         </div>
    //     )
    // }
    // console.log(image)
    // return (
    //     <div className="flex flex-col gap-16 min-h-full justify-between">
    //         <div className="flex gap-4 lg:gap-16 w-full">
    //             <div className="flex flex-col w-full">
    //                 <Label htmlFor="name">name</Label>
    //                 <Input
    //                     defaultValue={image?.file?.name}
    //                     onChange={(e) =>
    //                         setImageState({
    //                             ...imageState!,
    //                             name: e.target.value,
    //                         })
    //                     }
    //                 />
    //             </div>
    //             <div className="flex flex-col w-full">
    //                 <Label htmlFor="alt">alt</Label>
    //                 <Input
    //                     defaultValue={image?.alt}
    //                     onChange={(e) =>
    //                         setImageState({
    //                             ...imageState!,
    //                             alt: e.target.value,
    //                         })
    //                     }
    //                 />
    //             </div>
    //             <ApiImage
    //                 identifier={image?.id!}
    //                 alt={imageState?.alt!}
    //                 width={100}
    //                 height={100}
    //             />
    //         </div>
    //         <div className="flex justify-end">
    //             <Button onClick={() => serviceMutation.mutate(imageState!)}>
    //                 Save
    //             </Button>
    //         </div>
    //     </div>
    // )
}
