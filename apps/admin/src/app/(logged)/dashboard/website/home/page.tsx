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
import { ChevronLeft, PlusCircle, Upload } from 'lucide-react'
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
import { Comment, Home, Image as ImageType } from '@/types/index'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getHomeDetails } from '../actions'
import { getComments } from '../../comments/actions'
import { getImages } from '../../images/actions'
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

export default function HomeWebsitePage() {
    const { data: homeData } = useQuery({
        queryKey: ['home'],
        queryFn: async () => getHomeDetails(),
    })
    console.log(homeData)

    const { data: comments } = useQuery({
        queryKey: ['comments'],
        queryFn: async () => getComments(),
    })
    console.log(comments)

    const { data: images } = useQuery({
        queryKey: ['images'],
        queryFn: async () => getImages(),
    })

    console.log(homeData?.comments)

    const [hilightedComments, setHilightedComments] = useState<
        Comment[] | undefined
    >(homeData?.comments)

    console.log(hilightedComments)

    const [homeState, setHomeState] = useState<Home | undefined>(homeData)

    useEffect(() => {
        setHilightedComments(homeData?.comments)
    }, [homeData])

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
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                        <Button size="sm">Save Product</Button>
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
                                            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                                            className="min-h-32"
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
                            <CardContent>
                                <div className="flex gap-2 w-full">
                                    <div className="flex flex-col w-full gap-2">
                                        <Label className="text-muted-foreground">
                                            Image
                                        </Label>
                                        <AspectRatio ratio={16 / 9}>
                                            <Image
                                                alt="Product image"
                                                className="w-full rounded-md object-cover h-full"
                                                height="300"
                                                src={
                                                    homeState
                                                        ? process.env
                                                              .NEXT_PUBLIC_API_URL +
                                                          '/attachment/image/' +
                                                          homeState.imageId
                                                        : '/placeholder.svg'
                                                }
                                                width="300"
                                            ></Image>
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
                                                <FileSelector files={images as ImageType[]} />
                                                {/* <Command className="rounded-lg border shadow-md">
                                                    <CommandList className="gap-2 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                                                        <CommandEmpty className="text-slate-400">
                                                            please upload a file
                                                            before selecting one
                                                            <LoggedDashboardImages.Link className="underline decoration-pink-500">
                                                                here
                                                            </LoggedDashboardImages.Link>
                                                        </CommandEmpty>
                                                        {images?.map(
                                                            (image, index) => {
                                                                return (
                                                                    <CommandItem
                                                                        className="flex justify-center items-center text-xs h-full"
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={`${image.id}`}
                                                                    >
                                                                        <TooltipProvider>
                                                                            <Tooltip
                                                                                disableHoverableContent
                                                                            >
                                                                                <TooltipTrigger>
                                                                                    <Button
                                                                                        className="w-full max-w-full h-full"
                                                                                        variant={
                                                                                            'ghost'
                                                                                        }
                                                                                    >
                                                                                        <span className="sr-only">
                                                                                            Select
                                                                                            image
                                                                                        </span>
                                                                                        <Image
                                                                                            alt="Product image"
                                                                                            className="w-16 rounded-md object-cover h-16"
                                                                                            src={
                                                                                                process
                                                                                                    .env
                                                                                                    .NEXT_PUBLIC_API_URL +
                                                                                                '/attachment/image/' +
                                                                                                image.id
                                                                                            }
                                                                                            width="200"
                                                                                            height="200"
                                                                                        />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <p className="bg-slate-900 text-white p-2 rounded-md">
                                                                                        {
                                                                                            image
                                                                                                .file
                                                                                                .name
                                                                                        }
                                                                                    </p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    </CommandItem>
                                                                )
                                                            }
                                                        )}
                                                    </CommandList>
                                                </Command> */}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="flex flex-col w-full gap-2">
                                        <Label className="text-muted-foreground">
                                            Video
                                        </Label>
                                        <AspectRatio ratio={16 / 9}>
                                            <InputVideo
                                                className="w-full rounded-md object-cover h-full"
                                                src="localhost:3000/video_lescale.mp4"
                                                defaultImageProps={{
                                                    alt: 'Product image',
                                                    className:
                                                        'w-full rounded-md object-cover h-full',
                                                    height: '300',
                                                    src: '/placeholder.svg',
                                                    width: '300',
                                                }}
                                            />
                                        </AspectRatio>
                                    </div>
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
                                            defaultValue={hilightedComments}
                                            onSelect={(value) => {
                                                setHilightedComments(value)
                                            }}
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
                                                {!hilightedComments ? (
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
                <div className="flex items-center justify-center gap-2 md:hidden">
                    <Button variant="outline" size="sm">
                        Discard
                    </Button>
                    <Button size="sm">Save Product</Button>
                </div>
            </div>
        </main>
    )
}
