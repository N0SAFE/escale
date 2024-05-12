'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Pencil, PlusCircle, Upload } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import { usePathname } from 'next/navigation'
import { Image as ImageType } from '@/types/model/Image'
import { Video as VideoType } from '@/types/model/Video'
import { Comment } from '@/types/model/Comment'
import { Home } from '@/types/model/Home'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getHomeDetails, updateHomeDetails } from '@/actions/Home'
import { getComments } from '@/actions/Comment'
import { createImage, deleteImage, getImages } from '../../images/actions'
import Combobox from '@/components/atomics/molecules/Combobox'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { ScrollArea } from '@/components/ui/scroll-area'
import ImageShowcase from '@/components/atomics/molecules/ImageShowcase'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import InputImage from '@/components/atomics/atoms/InputImage'
import InputVideo from '@/components/atomics/atoms/InputVideo'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Command, CommandList } from '@/components/ui/command'
import { CommandEmpty, CommandItem } from 'cmdk'
import { LoggedDashboardImages } from '@/routes/index'
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import FileSelector from '@/components/atomics/molecules/FileSelector'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import HomeRelations from '@/types/model/Home'
import VideoRelations from '@/types/model/Video'
import ApiVideo from '@/components/atomics/atoms/ApiVideo'
import { createVideo, getVideos } from '@/actions/Video'
import { toast } from 'sonner'
import Loader from '@/components/atomics/atoms/Loader'

export default function HomeWebsitePage() {
    const queryClient = useQueryClient()

    const [isSaving, setIsSaving] = useState(false)

    const { data: homeData, isFetched } = useQuery({
        queryKey: ['home'],
        queryFn: async () => getHomeDetails(),
    })

    const { data: comments } = useQuery({
        queryKey: ['comments'],
        queryFn: async () => getComments(),
    })

    const { data: images } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })

    const { data: videos } = useQuery({
        queryKey: ['videos'],
        queryFn: async () => getVideos(),
    })

    const [hilightedComments, setHilightedComments] = useState<
        Comment[] | undefined
    >(homeData?.homeComments.map((hc) => hc.comment))

    const [homeState, setHomeState] = useState(homeData)

    const [editButtonIsOpen, setEditButtonIsOpen] = useState(false)

    useEffect(() => {
        setHilightedComments(homeData?.homeComments.map((hc) => hc.comment))
    }, [homeData])

    useEffect(() => {
        setHomeState(homeData)
    }, [homeData])

    const homeMutation = useMutation({
        mutationKey: ['home'],
        mutationFn: async (home: typeof homeState) => {
            return await updateHomeDetails({
                imageId: home?.imageId,
                commentBackgroundImageId: home?.commentBackgroundImageId,
                videoId: home?.videoId,
                description: home?.description,
                commentIds: hilightedComments?.map((c) => c.id) || [],
            })
        },
        onMutate: () => {
            setIsSaving(true)
        },
        onError: async (error, variables, context) => {
            toast.error('Error saving product')
        },
        onSettled: async () => {
            setIsSaving(false)
            setEditButtonIsOpen(false)
        },
        onSuccess: async (data) => {
            toast.success('Product saved')
            await queryClient.invalidateQueries({
                queryKey: ['home'],
            })
        },
    })

    const save = async () => {
        setIsSaving(true)
        await homeMutation.mutateAsync(homeState)
        setIsSaving(false)
    }

    if (!isFetched) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Loader size="8" />
            </div>
        )
    }

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto w-full max-w-[59rem] flex-1 gap-4 flex flex-col">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Pro Controller
                    </h1>
                    {/* <Badge variant="outline" className="ml-auto sm:ml-0">
                        In stock
                    </Badge> */}
                    <DropdownMenu
                        open={editButtonIsOpen}
                        onOpenChange={(e) => setEditButtonIsOpen(e)}
                    >
                        <DropdownMenuTrigger className="flex md:hidden items-center ml-auto">
                            <Button variant="outline" size="sm">
                                <Pencil />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="flex flex-col gap-2 p-2">
                            <DropdownMenuItem asChild>
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        save()
                                        e.preventDefault()
                                    }}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="relative flex items-center justify-center h-full w-full">
                                                <span className="invisible">
                                                    Save Product
                                                </span>
                                                <Loader
                                                    divClassName="absolute"
                                                    size="4"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <span>Save Product</span>
                                    )}
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Button variant="outline" size="sm">
                                    Discard
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                        <Button size="sm" onClick={() => save()}>
                            {isSaving ? (
                                <>
                                    <div className="relative flex items-center justify-center h-full w-full">
                                        <span className="invisible">
                                            Save Product
                                        </span>
                                        <Loader
                                            divClassName="absolute"
                                            size="4"
                                        />
                                    </div>
                                </>
                            ) : (
                                <span>Save Product</span>
                            )}
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>
                                    Lipsum dolor sit amet, consectetur
                                    adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={homeState?.description}
                                            className="min-h-32"
                                            onChange={(e) => {
                                                setHomeState({
                                                    ...homeState,
                                                    description:
                                                        e.currentTarget.value,
                                                } as Required<typeof homeData>)
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card
                            className="overflow-hidden"
                            x-chunk="dashboard-07-chunk-4"
                        >
                            <CardHeader>
                                <CardTitle>Homepage Images</CardTitle>
                                <CardDescription>
                                    Lipsum dolor sit amet, consectetur
                                    adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <div className="flex gap-2 w-full">
                                    <div className="flex flex-col w-full gap-2">
                                        <Label className="text-muted-foreground">
                                            Image
                                        </Label>
                                        <AspectRatio ratio={16 / 9}>
                                            {homeState?.imageId ? (
                                                <ApiImage
                                                    alt="Product image"
                                                    className="w-full rounded-md object-cover h-full"
                                                    identifier={
                                                        homeState?.imageId
                                                    }
                                                    fill
                                                />
                                            ) : (
                                                <Image
                                                    alt="Product image"
                                                    className="w-full rounded-md object-cover h-full"
                                                    src={'/placeholder.svg'}
                                                    fill
                                                />
                                            )}
                                        </AspectRatio>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full gap-2"
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span>Upload</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <FileSelector
                                                    defaultSelectedFileId={
                                                        homeState?.imageId
                                                    }
                                                    files={
                                                        images as ImageType[]
                                                    }
                                                    onFileSelect={(
                                                        image: ImageType
                                                    ) => {
                                                        setHomeState({
                                                            ...(homeState as Awaited<
                                                                ReturnType<
                                                                    typeof getHomeDetails
                                                                >
                                                            >),
                                                            imageId: image.id,
                                                        } as Required<typeof homeData>)
                                                    }}
                                                    onFileUpload={async (
                                                        file
                                                    ) => {
                                                        const formData =
                                                            new FormData()
                                                        formData.append(
                                                            'alt',
                                                            'alt'
                                                        )
                                                        formData.append(
                                                            'image',
                                                            file
                                                        )
                                                        const data =
                                                            createImage(
                                                                formData
                                                            )
                                                        await queryClient.invalidateQueries(
                                                            {
                                                                queryKey: [
                                                                    'images',
                                                                ],
                                                            }
                                                        )
                                                        return data
                                                    }}
                                                    onFileDelete={async (
                                                        image
                                                    ) => {
                                                        deleteImage(image.id)
                                                        await queryClient.invalidateQueries(
                                                            {
                                                                queryKey: [
                                                                    'images',
                                                                ],
                                                            }
                                                        )
                                                    }}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="flex flex-col w-full gap-2">
                                        <Label className="text-muted-foreground">
                                            Video
                                        </Label>
                                        <AspectRatio ratio={16 / 9}>
                                            {homeState?.videoId ? (
                                                <ApiVideo
                                                    alt="Product image"
                                                    className="w-full rounded-md object-cover h-full"
                                                    sourcesIdentifier={homeState?.video?.sources.map(
                                                        (s) => s.id
                                                    )}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    crossOrigin="use-credentials"
                                                />
                                            ) : (
                                                <Image
                                                    alt="Product image"
                                                    className="w-full rounded-md object-cover h-full"
                                                    src={'/placeholder.svg'}
                                                    fill
                                                />
                                            )}
                                        </AspectRatio>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full gap-2"
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span>Upload</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <FileSelector
                                                    inputAccept="video/*"
                                                    renderFile={(video) => {
                                                        return (
                                                            <ApiVideo
                                                                alt="Product image"
                                                                className="w-full rounded-md object-cover h-full"
                                                                sourcesIdentifier={video.sources.map(
                                                                    (s) => s.id
                                                                )}
                                                                autoPlay
                                                                loop
                                                                muted
                                                                width="300"
                                                                height="300"
                                                            />
                                                        )
                                                    }}
                                                    renderFileList={(video) => {
                                                        return (
                                                            <ApiVideo
                                                                alt="Product image"
                                                                className="w-full rounded-md object-cover h-full"
                                                                sourcesIdentifier={video.sources.map(
                                                                    (s) => s.id
                                                                )}
                                                                autoPlay
                                                                loop
                                                                muted
                                                                width="300"
                                                                height="300"
                                                            />
                                                        )
                                                    }}
                                                    defaultSelectedFileId={
                                                        homeState?.videoId
                                                    }
                                                    files={videos}
                                                    onFileSelect={(video) => {
                                                        setHomeState({
                                                            ...(homeState as Awaited<
                                                                ReturnType<
                                                                    typeof getHomeDetails
                                                                >
                                                            >),
                                                            videoId: video.id,
                                                            video: video,
                                                        } as Required<typeof homeData>)
                                                    }}
                                                    onFileUpload={async (
                                                        file
                                                    ) => {
                                                        const formData =
                                                            new FormData()
                                                        formData.append(
                                                            'alt',
                                                            'alt'
                                                        )
                                                        formData.append(
                                                            'sources[]',
                                                            file
                                                        )
                                                        const promise =
                                                            createVideo(
                                                                formData
                                                            )
                                                        toast.promise(promise, {
                                                            loading:
                                                                'Uploading video...',
                                                            success:
                                                                'Video uploaded!',
                                                            error: 'Error uploading video',
                                                        })
                                                        const video =
                                                            await promise
                                                        // formData
                                                        await queryClient.invalidateQueries(
                                                            {
                                                                queryKey: [
                                                                    'videos',
                                                                ],
                                                            }
                                                        )
                                                        return video as VideoType<
                                                            [
                                                                VideoRelations.sources
                                                            ]
                                                        >
                                                    }}
                                                    onFileDelete={async (
                                                        image
                                                    ) => {
                                                        deleteImage(image.id)
                                                        await queryClient.invalidateQueries(
                                                            {
                                                                queryKey: [
                                                                    'images',
                                                                ],
                                                            }
                                                        )
                                                    }}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <Label className="text-muted-foreground">
                                        home comment background image
                                    </Label>
                                    <AspectRatio ratio={16 / 9}>
                                        {homeState?.imageId ? (
                                            <ApiImage
                                                alt="Product image"
                                                className="w-full rounded-md object-cover h-full"
                                                identifier={
                                                    homeState?.commentBackgroundImageId
                                                }
                                                fill
                                            />
                                        ) : (
                                            <Image
                                                alt="Product image"
                                                className="w-full rounded-md object-cover h-full"
                                                src={'/placeholder.svg'}
                                                fill
                                            />
                                        )}
                                    </AspectRatio>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="w-full gap-2"
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Upload className="w-4 h-4" />
                                                <span>Upload</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <FileSelector
                                                defaultSelectedFileId={
                                                    homeState?.commentBackgroundImageId
                                                }
                                                files={images as ImageType[]}
                                                onFileSelect={(
                                                    image: ImageType
                                                ) => {
                                                    setHomeState({
                                                        ...(homeState as Awaited<
                                                            ReturnType<
                                                                typeof getHomeDetails
                                                            >
                                                        >),
                                                        commentBackgroundImageId:
                                                            image.id,
                                                    } as Required<typeof homeData>)
                                                }}
                                                onFileUpload={async (file) => {
                                                    const formData =
                                                        new FormData()
                                                    formData.append(
                                                        'alt',
                                                        'alt'
                                                    )
                                                    formData.append(
                                                        'image',
                                                        file
                                                    )
                                                    const data =
                                                        createImage(formData)
                                                    await queryClient.invalidateQueries(
                                                        {
                                                            queryKey: [
                                                                'images',
                                                            ],
                                                        }
                                                    )
                                                    return data
                                                }}
                                                onFileDelete={async (image) => {
                                                    deleteImage(image.id)
                                                    await queryClient.invalidateQueries(
                                                        {
                                                            queryKey: [
                                                                'images',
                                                            ],
                                                        }
                                                    )
                                                }}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-3">
                            <CardHeader>
                                <CardTitle>Hilight comments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Comments</Label>
                                        <Combobox
                                            keepOpen
                                            multiple
                                            items={comments?.map((comment) => {
                                                return {
                                                    label: comment.text,
                                                    value: comment,
                                                }
                                            })}
                                            value={hilightedComments}
                                            onSelect={(value) =>
                                                setHilightedComments(value)
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Card>
                                            <CardContent className="flex flex-col gap-3 max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent ">
                                                <CardHeader>
                                                    <CardTitle className="text-center">
                                                        Selected
                                                    </CardTitle>
                                                </CardHeader>
                                                {!hilightedComments?.length ? (
                                                    <div className="flex items-center justify-center gap-2 w-full h-full">
                                                        <span className="text-muted-foreground text-center">
                                                            No comments selected
                                                        </span>
                                                    </div>
                                                ) : (
                                                    hilightedComments?.map(
                                                        (comment, index) => (
                                                            <div
                                                                className="py-2"
                                                                key={index}
                                                            >
                                                                <Card>
                                                                    <CardContent className="flex aspect-square items-center justify-center flex-col">
                                                                        <CardHeader>
                                                                            <Label htmlFor="comment">
                                                                                Comment
                                                                            </Label>
                                                                        </CardHeader>
                                                                        <span className="text-muted-foreground w-full">
                                                                            {
                                                                                comment.text
                                                                            }
                                                                        </span>
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        )
                                                    )
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}
