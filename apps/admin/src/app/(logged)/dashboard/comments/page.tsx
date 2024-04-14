'use client'

import * as React from 'react'
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
// import { createImage, deleteImage, getImages } from './actions'
import {
    CreateImage as CreateImageType,
    Image as ImageType,
} from '@/types/index'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import Link from 'next/link'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import FileInput from '@/components/atomics/atoms/FileInput'

type Size = `${number}b` | `${number}kb` | `${number}mb` | `${number}gb`

function fromBytes(bytes: number): Size {
    const units = ['b', 'kb', 'mb', 'gb']
    let value = bytes
    let unit = 0
    while (value > 1024) {
        value /= 1024
        unit++
    }
    return `${value.toFixed()}${units[unit]}` as Size
}

// const columns: ColumnDef<ImageType>[] = [
//     {
//         id: 'select',
//         header: ({ table }) => (
//             <Checkbox
//                 checked={
//                     table.getIsAllPageRowsSelected() ||
//                     (table.getIsSomePageRowsSelected() && 'indeterminate')
//                 }
//                 onCheckedChange={(value: boolean) =>
//                     table.toggleAllPageRowsSelected(!!value)
//                 }
//                 aria-label="Select all"
//             />
//         ),
//         cell: ({ row }) => (
//             <Checkbox
//                 checked={row.getIsSelected()}
//                 onCheckedChange={(value: boolean) =>
//                     row.toggleSelected(!!value)
//                 }
//                 aria-label="Select row"
//             />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//     },
//     {
//         accessorKey: 'image',
//         header: 'Image',
//         cell: ({ row }) => (
//             <Image
//                 src={
//                     process.env.NEXT_PUBLIC_API_URL +
//                     '/attachment/image/' +
//                     row.original.id
//                 }
//                 width={50}
//                 height={50}
//                 alt={row.original.alt}
//             />
//         ),
//     },
//     {
//         accessorKey: 'name',
//         header: ({ column, table }) => {
//             return (
//                 <Button
//                     variant="ghost"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === 'asc')
//                     }
//                 >
//                     name
//                     <CaretSortIcon className="ml-2 h-4 w-4" />
//                 </Button>
//             )
//         },
//         cell: ({ row }) => (
//             <div className="capitalize">{row.original.file.name}</div>
//         ),
//     },
//     {
//         accessorKey: 'size',
//         header: 'Size',
//         cell: ({ row }) => (
//             <div className="lowercase">{fromBytes(row.original.file.size)}</div>
//         ),
//     },
//     {
//         id: 'actions',
//         enableHiding: false,
//         header: 'Actions',
//         cell: ({ row, table }) => {
//             const spa = row.original

//             const { setSelectedImageToDelete } = table.options.meta as {
//                 setSelectedImageToDelete: (image: ImageType) => void
//             }

//             return (
//                 <>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <span className="sr-only">Open menu</span>
//                                 <DotsHorizontalIcon className="h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem>
//                                 <Link
//                                     className="w-full"
//                                     href={`/dashboard/images/${spa.id}`}
//                                 >
//                                     Details
//                                 </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem>
//                                 <Link
//                                     className="w-full"
//                                     href={`/dashboard/images/${spa.id}/edit`}
//                                 >
//                                     Edit
//                                 </Link>
//                             </DropdownMenuItem>
//                             <AlertDialogTrigger
//                                 asChild
//                                 className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
//                             >
//                                 <DropdownMenuItem
//                                     onClick={() =>
//                                         setSelectedImageToDelete(spa)
//                                     }
//                                 >
//                                     Delete
//                                 </DropdownMenuItem>
//                             </AlertDialogTrigger>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </>
//             )
//         },
//     },
// ]

export default function ServicesTable() {
    // const { data, error, isFetched, refetch } = useQuery({
    //     queryKey: ['images'],
    //     queryFn: async () => getImages(),
    // })
    // const imageCreateMutation = useMutation({
    //     mutationFn: async (service?: CreateImageType) => {
    //         const formData = new FormData()
    //         formData.append('alt', service?.alt!)
    //         formData.append('image', service?.file!)
    //         return await createImage(formData!)
    //     },
    //     onError: (error) => {
    //         toast.error('server error')
    //     },
    //     onSuccess: async (data) => {
    //         toast.success('image created')
    //         setOpen(false)
    //         await refetch()
    //     },
    // })
    // const imageDeleteMutation = useMutation({
    //     mutationFn: async (id: number) => {
    //         return await deleteImage(id)
    //     },
    //     onError: (error) => {
    //         toast.error('server error')
    //     },
    //     onSuccess: async (data) => {
    //         toast.success('image deleted')
    //         setIsDeleteDialogOpen(false)
    //         await refetch()
    //     },
    // })
    // const [open, setOpen] = React.useState(false)
    // const [sorting, setSorting] = React.useState<SortingState>([])
    // const [columnFilters, setColumnFilters] =
    //     React.useState<ColumnFiltersState>([])
    // const [columnVisibility, setColumnVisibility] =
    //     React.useState<VisibilityState>({})
    // const [rowSelection, setRowSelection] = React.useState({})
    // const [selectedImageToDelete, setSelectedImageToDelete] =
    //     React.useState<ImageType>()
    // const [isDeletDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    // const [isDeleting, setIsDeleting] = React.useState(false)

    // console.log({ data, error, isFetched })

    // const table = useReactTable({
    //     data: data ?? [],
    //     columns,
    //     onSortingChange: setSorting,
    //     onColumnFiltersChange: setColumnFilters,
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     onColumnVisibilityChange: setColumnVisibility,
    //     onRowSelectionChange: setRowSelection,
    //     state: {
    //         sorting,
    //         columnFilters,
    //         columnVisibility,
    //         rowSelection,
    //     },
    //     meta: {
    //         setSelectedImageToDelete,
    //     },
    // })

    // console.log(isDeletDialogOpen)

    // return (
    //     <div className="w-full">
    //         <div className="flex items-center py-4 justify-between">
    //             <Input
    //                 placeholder="Filter services..."
    //                 value={
    //                     (table.getColumn('name')?.getFilterValue() as string) ??
    //                     ''
    //                 }
    //                 onChange={(event) =>
    //                     table
    //                         .getColumn('name')
    //                         ?.setFilterValue(event.target.value)
    //                 }
    //                 className="max-w-sm"
    //             />
    //             <div className="flex gap-2">
    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="outline" className="ml-auto">
    //                             Columns{' '}
    //                             <ChevronDownIcon className="ml-2 h-4 w-4" />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end">
    //                         {table
    //                             .getAllColumns()
    //                             .filter((column) => column.getCanHide())
    //                             .map((column) => {
    //                                 return (
    //                                     <DropdownMenuCheckboxItem
    //                                         key={column.id}
    //                                         className="capitalize"
    //                                         checked={column.getIsVisible()}
    //                                         onCheckedChange={(value) =>
    //                                             column.toggleVisibility(!!value)
    //                                         }
    //                                     >
    //                                         {column.id}
    //                                     </DropdownMenuCheckboxItem>
    //                                 )
    //                             })}
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //                 <Dialog open={open} onOpenChange={setOpen}>
    //                     <DialogTrigger asChild>
    //                         <Button variant="outline">+</Button>
    //                     </DialogTrigger>
    //                     <DialogContent className="sm:max-w-[800px]">
    //                         <DialogHeader>
    //                             <DialogTitle>Create service</DialogTitle>
    //                             <DialogDescription>
    //                                 create a new service and add it to the list
    //                             </DialogDescription>
    //                         </DialogHeader>
    //                         <CreateImage
    //                             onSubmit={imageCreateMutation.mutate}
    //                             isLoading={imageCreateMutation.isPending}
    //                         />
    //                     </DialogContent>
    //                 </Dialog>
    //             </div>
    //         </div>
    //         <div className="rounded-md border">
    //             <Table>
    //                 <TableHeader>
    //                     {table.getHeaderGroups().map((headerGroup) => (
    //                         <TableRow key={headerGroup.id}>
    //                             {headerGroup.headers.map((header) => {
    //                                 return (
    //                                     <TableHead key={header.id}>
    //                                         {header.isPlaceholder
    //                                             ? null
    //                                             : flexRender(
    //                                                   header.column.columnDef
    //                                                       .header,
    //                                                   header.getContext()
    //                                               )}
    //                                     </TableHead>
    //                                 )
    //                             })}
    //                         </TableRow>
    //                     ))}
    //                 </TableHeader>
    //                 <TableBody>
    //                     <AlertDialog
    //                         open={isDeletDialogOpen}
    //                         onOpenChange={(t) => {
    //                             console.log('ui')
    //                             setIsDeleteDialogOpen(t)
    //                         }}
    //                     >
    //                         {isFetched ? (
    //                             table.getRowModel().rows?.length ? (
    //                                 table.getRowModel().rows.map((row) => (
    //                                     <TableRow
    //                                         key={row.id}
    //                                         data-state={
    //                                             row.getIsSelected() &&
    //                                             'selected'
    //                                         }
    //                                     >
    //                                         {row
    //                                             .getVisibleCells()
    //                                             .map((cell) => (
    //                                                 <TableCell key={cell.id}>
    //                                                     {flexRender(
    //                                                         cell.column
    //                                                             .columnDef.cell,
    //                                                         cell.getContext()
    //                                                     )}
    //                                                 </TableCell>
    //                                             ))}
    //                                     </TableRow>
    //                                 ))
    //                             ) : (
    //                                 <TableRow>
    //                                     <TableCell
    //                                         colSpan={columns.length}
    //                                         className="h-24 text-center"
    //                                     >
    //                                         <span className="flex items-center justify-center">
    //                                             <span>no image found</span>
    //                                         </span>
    //                                     </TableCell>
    //                                 </TableRow>
    //                             )
    //                         ) : (
    //                             <TableRow>
    //                                 <TableCell
    //                                     colSpan={columns.length}
    //                                     className="h-24 text-center"
    //                                 >
    //                                     <span className="flex items-center justify-center">
    //                                         <Loader />
    //                                     </span>
    //                                 </TableCell>
    //                             </TableRow>
    //                         )}
    //                         <AlertDialogContent>
    //                             <DeleteImage
    //                                 onDelete={() =>
    //                                     imageDeleteMutation.mutate(
    //                                         selectedImageToDelete?.id!
    //                                     )
    //                                 }
    //                                 isLoading={imageDeleteMutation.isPending}
    //                                 onCancel={() =>
    //                                     setIsDeleteDialogOpen(false)
    //                                 }
    //                             />
    //                         </AlertDialogContent>
    //                     </AlertDialog>
    //                 </TableBody>
    //             </Table>
    //         </div>
    //         <div className="flex items-center justify-end space-x-2 py-4">
    //             <div className="flex-1 text-sm text-muted-foreground">
    //                 {table.getFilteredSelectedRowModel().rows.length} of{' '}
    //                 {table.getFilteredRowModel().rows.length} row(s) selected.
    //             </div>
    //             <div className="space-x-2">
    //                 <Button
    //                     variant="outline"
    //                     size="sm"
    //                     onClick={() => table.previousPage()}
    //                     disabled={!table.getCanPreviousPage()}
    //                 >
    //                     Previous
    //                 </Button>
    //                 <Button
    //                     variant="outline"
    //                     size="sm"
    //                     onClick={() => table.nextPage()}
    //                     disabled={!table.getCanNextPage()}
    //                 >
    //                     Next
    //                 </Button>
    //             </div>
    //         </div>
    //     </div>
    // )
}

type DeleteImageProps = {
    isLoading?: boolean
    onDelete?: () => void
    onCancel?: () => void
}

function DeleteImage({ isLoading, onDelete, onCancel }: DeleteImageProps) {
    // return (
    //     <>
    //         <AlertDialogHeader>
    //             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    //             <AlertDialogDescription>
    //                 This action cannot be undone. This will permanently delete
    //                 the image and remove the data associated from our servers.
    //             </AlertDialogDescription>
    //         </AlertDialogHeader>
    //         <AlertDialogFooter>
    //             <Button variant={'outline'} onClick={onCancel}>
    //                 Cancel
    //             </Button>
    //             <Button disabled={isLoading} onClick={onDelete}>
    //                 <span className={isLoading ? 'invisible' : 'visible'}>
    //                     Continue
    //                 </span>
    //                 {isLoading ? (
    //                     <div className="flex items-center justify-center absolute">
    //                         <Loader size={'4'} />
    //                     </div>
    //                 ) : (
    //                     ''
    //                 )}
    //             </Button>
    //         </AlertDialogFooter>
    //     </>
    // )
}

type CreateImageProps = {
    isLoading?: boolean
    onSubmit?: (data?: CreateImageType) => void
}

function CreateImage({ isLoading, onSubmit }: CreateImageProps) {
    // const { data: images, isFetched: isImagesFetched } = useQuery({
    //     queryKey: ['images'],
    //     queryFn: async () => getImages(),
    // })

    // const [imageState, setImageState] = React.useState<CreateImageType>({
    //     alt: '',
    // })
    // return (
    //     <div>
    //         <div className="grid gap-4 py-4  w-full">
    //             <div className="grid grid-cols-4 items-center gap-4">
    //                 <Label htmlFor="alt" className="text-right">
    //                     alt
    //                 </Label>
    //                 <Input
    //                     id="alt"
    //                     value={imageState.alt}
    //                     className="col-span-3"
    //                     onChange={(e) =>
    //                         setImageState({
    //                             ...imageState,
    //                             alt: e.target.value,
    //                         })
    //                     }
    //                 />
    //             </div>
    //             <div className="grid grid-cols-4 items-center gap-4">
    //                 <Label htmlFor="file" className="text-right">
    //                     file
    //                 </Label>
    //                 <FileInput
    //                     onUpload={(files) =>
    //                         setImageState({
    //                             ...imageState,
    //                             file: files?.[0]!,
    //                             name: imageState.name
    //                                 ? imageState.name
    //                                 : files?.[0]
    //                                 ? files?.[0].name
    //                                 : imageState.name,
    //                         })
    //                     }
    //                     className="col-span-3 w-full"
    //                 />
    //             </div>
    //             <div className="grid grid-cols-4 items-center gap-4">
    //                 <Label htmlFor="name" className="text-right">
    //                     name
    //                 </Label>
    //                 <Input
    //                     id="name"
    //                     value={imageState.name}
    //                     className="col-span-3"
    //                     onChange={(e) =>
    //                         setImageState({
    //                             ...imageState,
    //                             name: e.target.value,
    //                         })
    //                     }
    //                 />
    //             </div>
    //         </div>
    //         <DialogFooter>
    //             <Button
    //                 className="relative"
    //                 onClick={() => onSubmit?.(imageState)}
    //                 disabled={isLoading}
    //             >
    //                 <span className={isLoading ? 'invisible' : 'visible'}>
    //                     Save change
    //                 </span>
    //                 {isLoading ? (
    //                     <div className="flex items-center justify-center absolute">
    //                         <Loader size={'4'} />
    //                     </div>
    //                 ) : (
    //                     ''
    //                 )}
    //             </Button>
    //         </DialogFooter>
    //     </div>
    // )
}
