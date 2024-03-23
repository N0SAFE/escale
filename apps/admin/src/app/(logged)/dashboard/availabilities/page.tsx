import { redirect } from 'next/navigation'

export default function Availabilities() {
    redirect('/dashboard/availabilities/calendar')
}

// function AvailabilitiesPlaceholder() {
//     const {
//         data: spas,
//         error: spasError,
//         isFetched: spasIsFetched,
//     } = useQuery({
//         queryKey: ['spas'],
//         queryFn: async () => {
//             return await getSpas()
//         },
//     })
//     const {
//         data: availabilities,
//         error,
//         isFetched,
//         refetch,
//     } = useQuery({
//         queryKey: ['availabilities'],
//         queryFn: async () =>
//             getAvailabilities({
//                 groups: ['availabilities:spa'],
//                 search: {
//                     spa: 1,
//                 },
//             }),
//     })
//     const availabilityCreateMutation = useMutation({
//         mutationFn: async (availability?: CreateAvailabilityType) => {
//             if (!availability) {
//                 return
//             }
//             if (!availability.startAt || !availability.endAt) {
//                 throw new Error('startAt and endAt are required')
//             }
//             if (availability.spa === -1) {
//                 throw new Error('spa is required')
//             }
//             return await createAvailability(availability)
//         },
//         onError: (error) => {
//             toast.error(error.message)
//         },
//         onSuccess: async (data) => {
//             toast.success('availability created')
//             setIsCreateDialogOpen(false)
//             await refetch()
//         },
//     })
//     const availabilityUpdateMutation = useMutation({
//         mutationFn: async ({
//             id,
//             availability,
//         }: {
//             id: number
//             availability: UpdateAvailability
//         }) => {
//             if (!availability) {
//                 return
//             }
//             return await updateAvailability(id, availability)
//         },
//         onError: (error) => {
//             toast.error('server error')
//         },
//         onSuccess: async (data) => {
//             toast.success('availability updated')
//             await refetch()
//         },
//     })
//     const availabilityDeleteMutation = useMutation({
//         mutationFn: async (id: number) => {
//             return await deleteAvailability(id)
//         },
//         onError: (error) => {
//             toast.error('server error')
//         },
//         onSuccess: async (data) => {
//             toast.success('availability deleted')
//             setIsDeleteDialogOpen(false)
//             await refetch()
//         },
//     })
//     const [createdAvailability, setCreatedAvailability] =
//         React.useState<CreateAvailabilityType>()
//     const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
//     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

//     return (
//         <div className={'w-full h-full'}>
//             <Tabs
//                 defaultValue={'calendar'}
//                 className="w-[inherit] flex flex-col items-center h-full"
//             >
//                 <div className="w-full flex justify-between">
//                     <Button variant="outline" className="invisible">
//                         +
//                     </Button>
//                     <TabsList className="w-fit">
//                         <TabsTrigger value="calendar">calendar</TabsTrigger>
//                         <TabsTrigger value="list">list</TabsTrigger>
//                     </TabsList>
//                     <Dialog
//                         open={isCreateDialogOpen}
//                         onOpenChange={setIsCreateDialogOpen}
//                     >
//                         <DialogTrigger asChild>
//                             <Button variant="outline">+</Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[800px]">
//                             <DialogHeader>
//                                 <DialogTitle>Create availability</DialogTitle>
//                                 <DialogDescription>
//                                     create a new availability and add it to the
//                                     list
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <AvailabilityEdit
//                                 spas={spas}
//                                 availabilities={availabilities}
//                                 onChange={(data) => {
//                                     setCreatedAvailability(data.availability)
//                                 }}
//                             />
//                             <DialogFooter>
//                                 <Button
//                                     className="relative"
//                                     onClick={() => {
//                                         availabilityCreateMutation.mutate(
//                                             createdAvailability
//                                         )
//                                     }}
//                                     disabled={
//                                         availabilityCreateMutation.isPending
//                                     }
//                                 >
//                                     <span
//                                         className={
//                                             availabilityCreateMutation.isPending
//                                                 ? 'invisible'
//                                                 : 'visible'
//                                         }
//                                     >
//                                         Save change
//                                     </span>
//                                     {availabilityCreateMutation.isPending ? (
//                                         <div className="flex items-center justify-center absolute">
//                                             <Loader size={'4'} />
//                                         </div>
//                                     ) : (
//                                         ''
//                                     )}
//                                 </Button>
//                             </DialogFooter>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//                 <div className="w-full h-full">
//                     {isFetched ? (
//                         <>
//                             <TabsContent
//                                 value="calendar"
//                                 className="flex items-center flex-col"
//                             >
//                                 <CalendarView
//                                     onDelete={async (id: number) =>
//                                         availabilityDeleteMutation.mutate(id)
//                                     }
//                                     isDeleting={
//                                         availabilityDeleteMutation.isPending
//                                     }
//                                     onUpdate={async (data) => availabilityUpdateMutation.mutate(data)}
//                                     isUpdating={
//                                         availabilityUpdateMutation.isPending
//                                     }
//                                 />
//                             </TabsContent>
//                             <TabsContent value="list">
//                                 <ListView
//                                     availabilities={availabilities!}
//                                     availabilityDeleteMutation={
//                                         availabilityDeleteMutation
//                                     }
//                                     error={error}
//                                     isFetched={isFetched}
//                                     refetch={refetch}
//                                     isDeleteDialogOpen={isDeleteDialogOpen}
//                                     setIsDeleteDialogOpen={
//                                         setIsDeleteDialogOpen
//                                     }
//                                     onDelete={async (id: number) =>
//                                         availabilityDeleteMutation.mutate(id)
//                                     }
//                                     onUpdate={availabilityUpdateMutation.mutate}
//                                     isUpdating={
//                                         availabilityUpdateMutation.isPending
//                                     }
//                                     isDeleting={
//                                         availabilityDeleteMutation.isPending
//                                     }
//                                 />
//                             </TabsContent>
//                         </>
//                     ) : (
//                         <div className="flex items-center justify-center h-full w-full">
//                             <Loader />
//                         </div>
//                     )}
//                 </div>
//             </Tabs>
//         </div>
//     )
// }

// const columns: ColumnDef<AvailabilityType>[] = [
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
//         accessorKey: 'startAt',
//         header: 'Start at',
//         cell: ({ row }) => (
//             <div className="capitalize">{row.original.startAt}</div>
//         ),
//     },
//     {
//         accessorKey: 'endAt',
//         header: 'End at',
//         cell: ({ row }) => (
//             <div className="capitalize">{row.original.endAt}</div>
//         ),
//     },
//     {
//         accessorKey: 'spa',
//         header: 'Spa',
//         cell: ({ row }) =>
//             row.original?.spa?.id ? (
//                 <Link
//                     href={`../spa/${row.original.spa.title}`}
//                     className="lowercase"
//                 >
//                     {row.original.spa.title}
//                 </Link>
//             ) : (
//                 <div className="lowercase">none</div>
//             ),
//     },
//     {
//         id: 'actions',
//         enableHiding: false,
//         header: 'Actions',
//         cell: ({ row, table }) => {
//             const availability = row.original

//             const { setSelectedAvailabilityToDelete } = table.options.meta as {
//                 setSelectedAvailabilityToDelete: (
//                     image: AvailabilityType
//                 ) => void
//             }
//             return (
//                 <div className="flex justify-end">
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
//                                 <SheetTrigger className="w-full text-left">
//                                     Edit
//                                 </SheetTrigger>
//                             </DropdownMenuItem>
//                             <AlertDialogTrigger
//                                 asChild
//                                 className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
//                             >
//                                 <DropdownMenuItem
//                                     onClick={() =>
//                                         setSelectedAvailabilityToDelete(
//                                             availability
//                                         )
//                                     }
//                                 >
//                                     Delete
//                                 </DropdownMenuItem>
//                             </AlertDialogTrigger>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             )
//         },
//     },
// ]

// type ListViewProps = {
//     availabilities: Awaited<ReturnType<typeof getAvailabilities>>
//     error: unknown
//     isFetched: boolean
//     refetch: () => void
//     availabilityDeleteMutation: ReturnType<
//         typeof useMutation<void, Error, number, unknown>
//     >
//     isDeleteDialogOpen: boolean
//     setIsDeleteDialogOpen: (t: boolean) => void
//     onDelete: (id: number) => Promise<void>
//     onUpdate: ({
//         id,
//         availability,
//     }: {
//         id: number
//         availability: UpdateAvailability
//     }) => void
//     isUpdating: boolean
//     isDeleting: boolean
//     spas?: Spa[]
//     isSpaLoading?: boolean
// }

// function ListView({
//     availabilities,
//     error,
//     isFetched,
//     refetch,
//     availabilityDeleteMutation,
//     isDeleteDialogOpen,
//     setIsDeleteDialogOpen,
//     onDelete,
//     onUpdate,
//     isUpdating,
//     isDeleting,
//     spas,
//     isSpaLoading,
// }: ListViewProps) {
//     const [globalFilter, setGlobalFilter] = React.useState('')
//     const [sheetIsOpen, setSheetIsOpen] = React.useState<false | number>(false)
//     const [updatedAvailability, setUpdatedAvailability] = React.useState<{
//         id: number
//         availability: UpdateAvailability
//     }>()
//     const [sorting, setSorting] = React.useState<SortingState>([])
//     const [columnFilters, setColumnFilters] =
//         React.useState<ColumnFiltersState>([])
//     const [columnVisibility, setColumnVisibility] =
//         React.useState<VisibilityState>({})
//     const [rowSelection, setRowSelection] = React.useState({})
//     const [selectedAvailabilityToDelete, setSelectedAvailabilityToDelete] =
//         React.useState<AvailabilityType>()

//     const table = useReactTable({
//         data: availabilities ?? [],
//         columns,
//         onGlobalFilterChange: setGlobalFilter,
//         globalFilterFn: (row, columnId, value, addMeta) => {
//             value = value.toLowerCase()
//             // check if the value is YYYY-MM-DD
//             if (!value.match(/\d{4}-\d{2}-\d{2}/)) {
//                 return true
//             }

//             const dateTime = DateTime.fromISO(value)
//             const startAtDateTime = DateTime.fromISO(row.original.startAt)
//             const endAtDateTime = DateTime.fromISO(row.original.endAt)

//             if (!dateTime.isValid) {
//                 return true
//             }
//             if (dateTime < startAtDateTime || dateTime > endAtDateTime) {
//                 return false
//             }
//             return true
//         },
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         onColumnVisibilityChange: setColumnVisibility,
//         onRowSelectionChange: setRowSelection,
//         state: {
//             sorting,
//             columnFilters,
//             columnVisibility,
//             rowSelection,
//             globalFilter,
//         },
//         meta: {
//             setSelectedAvailabilityToDelete,
//         },
//     })

//     return (
//         <div className="w-full">
//             <div className="flex items-center py-4 justify-between">
//                 <Input
//                     placeholder="Filter availabilities..."
//                     value={globalFilter ?? ''}
//                     onChange={(event) =>
//                         setGlobalFilter(String(event.target.value))
//                     }
//                     className="max-w-sm"
//                 />
//                 <div className="flex gap-2">
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="outline" className="ml-auto">
//                                 Columns{' '}
//                                 <ChevronDownIcon className="ml-2 h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             {table
//                                 .getAllColumns()
//                                 .filter((column) => column.getCanHide())
//                                 .map((column) => {
//                                     return (
//                                         <DropdownMenuCheckboxItem
//                                             key={column.id}
//                                             className="capitalize"
//                                             checked={column.getIsVisible()}
//                                             onCheckedChange={(value) =>
//                                                 column.toggleVisibility(!!value)
//                                             }
//                                         >
//                                             {column.id}
//                                         </DropdownMenuCheckboxItem>
//                                     )
//                                 })}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </div>
//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => {
//                                     return (
//                                         <TableHead key={header.id}>
//                                             {header.isPlaceholder
//                                                 ? null
//                                                 : flexRender(
//                                                       header.column.columnDef
//                                                           .header,
//                                                       header.getContext()
//                                                   )}
//                                         </TableHead>
//                                     )
//                                 })}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         <AlertDialog
//                             open={isDeleteDialogOpen}
//                             onOpenChange={setIsDeleteDialogOpen}
//                         >
//                             {isFetched ? (
//                                 table.getRowModel().rows?.length ? (
//                                     table.getRowModel().rows.map((row) => (
//                                         <Sheet
//                                             key={row.id}
//                                             open={
//                                                 sheetIsOpen === row.original.id
//                                             }
//                                             onOpenChange={() =>
//                                                 setSheetIsOpen(
//                                                     sheetIsOpen ===
//                                                         row.original.id
//                                                         ? false
//                                                         : row.original.id
//                                                 )
//                                             }
//                                         >
//                                             <TableRow
//                                                 data-state={
//                                                     row.getIsSelected() &&
//                                                     'selected'
//                                                 }
//                                             >
//                                                 {row
//                                                     .getVisibleCells()
//                                                     .map((cell) => (
//                                                         <TableCell
//                                                             key={cell.id}
//                                                         >
//                                                             {flexRender(
//                                                                 cell.column
//                                                                     .columnDef
//                                                                     .cell,
//                                                                 cell.getContext()
//                                                             )}
//                                                         </TableCell>
//                                                     ))}
//                                             </TableRow>
//                                             <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] h-screen flex flex-col justify-between">
//                                                 <div>
//                                                     <SheetHeader>
//                                                         <SheetTitle>
//                                                             Edit profile{' '}
//                                                             {row.original?.id}
//                                                         </SheetTitle>
//                                                         <SheetDescription>
//                                                             Make changes to your
//                                                             profile here. Click
//                                                             save when
//                                                             you&apos;re done.
//                                                         </SheetDescription>
//                                                     </SheetHeader>
//                                                     <AvailabilityEdit
//                                                         spas={spas}
//                                                         isSpaLoading={
//                                                             isSpaLoading
//                                                         }
//                                                         selectedSpa={
//                                                             updatedAvailability
//                                                                 ?.availability
//                                                                 ?.spa
//                                                                 ? spas?.find(
//                                                                       (s) =>
//                                                                           s.id ===
//                                                                           updatedAvailability
//                                                                               ?.availability
//                                                                               ?.spa
//                                                                   )
//                                                                 : undefined
//                                                         }
//                                                         getClostestAvailability={async (
//                                                             date: string
//                                                         ) =>
//                                                             (
//                                                                 await getClosestAvailabilities(
//                                                                     date
//                                                                 )
//                                                             )?.data!
//                                                         }
//                                                         defaultValues={
//                                                             row.original
//                                                         }
//                                                         availabilities={
//                                                             availabilities
//                                                         }
//                                                         onChange={(data) => {
//                                                             setUpdatedAvailability(
//                                                                 {
//                                                                     id: data.id!,
//                                                                     availability:
//                                                                         data.availability,
//                                                                 }
//                                                             )
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 <SheetFooter className="flex sm:justify-between gap-4">
//                                                     <Button
//                                                         onClick={() => {
//                                                             onDelete(
//                                                                 updatedAvailability?.id!
//                                                             ).then(function () {
//                                                                 setSheetIsOpen(
//                                                                     false
//                                                                 )
//                                                             })
//                                                         }}
//                                                         variant={'destructive'}
//                                                     >
//                                                         {isDeleting ? (
//                                                             <div className="relative">
//                                                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                                                                     <Loader size="4" />
//                                                                 </div>
//                                                                 <span className="invisible">
//                                                                     Delete
//                                                                 </span>
//                                                             </div>
//                                                         ) : (
//                                                             'Delete'
//                                                         )}
//                                                     </Button>
//                                                     <Button
//                                                         onClick={() => {
//                                                             onUpdate(
//                                                                 updatedAvailability!
//                                                             )
//                                                         }}
//                                                         className="relative"
//                                                     >
//                                                         {isUpdating ? (
//                                                             <div className="relative">
//                                                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                                                                     <Loader size="4" />
//                                                                 </div>
//                                                                 <span className="invisible">
//                                                                     Save change
//                                                                 </span>
//                                                             </div>
//                                                         ) : (
//                                                             'Save change'
//                                                         )}
//                                                     </Button>
//                                                 </SheetFooter>
//                                             </SheetContent>
//                                         </Sheet>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell
//                                             colSpan={columns.length}
//                                             className="h-24 text-center"
//                                         >
//                                             <span className="flex items-center justify-center">
//                                                 <span>
//                                                     no availability found
//                                                 </span>
//                                             </span>
//                                         </TableCell>
//                                     </TableRow>
//                                 )
//                             ) : (
//                                 <TableRow>
//                                     <TableCell
//                                         colSpan={columns.length}
//                                         className="h-24 text-center"
//                                     >
//                                         <span className="flex items-center justify-center">
//                                             <Loader />
//                                         </span>
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                             <AlertDialogContent>
//                                 <DeleteImage
//                                     onDelete={() =>
//                                         availabilityDeleteMutation.mutate(
//                                             selectedAvailabilityToDelete?.id!
//                                         )
//                                     }
//                                     isLoading={
//                                         availabilityDeleteMutation.isPending
//                                     }
//                                     onCancel={() =>
//                                         setIsDeleteDialogOpen(false)
//                                     }
//                                 />
//                             </AlertDialogContent>
//                         </AlertDialog>
//                     </TableBody>
//                 </Table>
//             </div>
//             <div className="flex items-center justify-end space-x-2 py-4">
//                 <div className="flex-1 text-sm text-muted-foreground">
//                     {table.getFilteredSelectedRowModel().rows.length} of{' '}
//                     {table.getFilteredRowModel().rows.length} row(s) selected.
//                 </div>
//                 <div className="space-x-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.previousPage()}
//                         disabled={!table.getCanPreviousPage()}
//                     >
//                         Previous
//                     </Button>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.nextPage()}
//                         disabled={!table.getCanNextPage()}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export type CalendarViewProps = {
//     onDelete: (id: number) => Promise<void>
//     onUpdate: ({
//         id,
//         availability,
//     }: {
//         id: number
//         availability: UpdateAvailability
//     }) => Promise<any>
//     isUpdating: boolean
//     isDeleting?: boolean
// }

// function CalendarView({
//     onDelete,
//     isDeleting,
//     onUpdate,
//     isUpdating,
// }: CalendarViewProps) {
//     const size = useWindowSize()
//     const {
//         data: spas,
//         isFetched: isSpaFetched,
//     } = useQuery({
//         queryKey: ['spas'],
//         queryFn: async () => {
//             return await getSpas()
//         },
//     })

//     const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date())
//     const [selectedSpa, setSelectedSpa] = React.useState<Spa>()
//     const [sheetIsOpen, setSheetIsOpen] = React.useState(false)
//     const [selectedAvailability, setSelectedAvailability] =
//         React.useState<AvailabilityType>()
//     const [updatedAvailability, setUpdatedAvailability] = React.useState<{
//         id: number
//         availability: UpdateAvailability
//     }>()
//     console.log(DateTime.fromJSDate(selectedMonth).toISODate())
//     console.log(
//         'get data from ' + (selectedMonth
//             ? DateTime.fromJSDate(selectedMonth)
//                   .minus({ month: 1 })
//                   .toISODate()!
//             : undefined) + ' to ' + (selectedMonth
//             ? DateTime.fromJSDate(selectedMonth)
//                   .plus({
//                       month:
//                           ((size.width! >= 640
//                               ? size.width! >= 1280
//                                   ? size.width! >= 1536
//                                       ? size.width! >= 1920
//                                           ? 5
//                                           : 4
//                                       : 3
//                                   : 2
//                               : 2) +
//                               1),
//                   })
//                   .toISODate()!
//             : undefined)
//     )

//     const {
//         data: availabilities,
//         error,
//         isFetched,
//         refetch,
//     } = useQuery({
//         placeholderData: keepPreviousData,
//         queryKey: [
//             'availabilities',
//             selectedMonth.toISOString(),
//             selectedSpa?.id,
//         ],
//         queryFn: async () =>
//             await getAvailabilities({
//                 groups: ['availabilities:spa'],
//                 search: {
//                     spa: selectedSpa?.id,
//                 },
//                 dates: {
//                     endAt: {
//                         after: selectedMonth
//                             ? DateTime.fromJSDate(selectedMonth)
//                                   .minus({ month: 1 })
//                                   .toISODate()!
//                             : undefined,
//                     },
//                     startAt: {
//                         before: selectedMonth
//                             ? DateTime.fromJSDate(selectedMonth)
//                                   .plus({
//                                       month:
//                                           ((size.width! >= 640
//                                               ? size.width! >= 1280
//                                                   ? size.width! >= 1536
//                                                       ? size.width! >= 1920
//                                                           ? 5
//                                                           : 4
//                                                       : 3
//                                                   : 2
//                                               : 2) +
//                                               1),
//                                   })
//                                   .toISODate()!
//                             : undefined,
//                     },
//                 },
//             }),

//     })

//     console.log(availabilities?.length)

//     return (
//         <Sheet
//             open={sheetIsOpen}
//             onOpenChange={() => setSheetIsOpen(!sheetIsOpen)}
//         >
//             <ContextMenu>
//                 <ContextMenuTrigger>
//                     <Calendar
//                         month={selectedMonth}
//                         onMonthChange={setSelectedMonth}
//                         mode="range"
//                         className="w-full overflow-hidden flex justify-center"
//                         selected={undefined}
//                         numberOfMonths={
//                             size.width! >= 640
//                                 ? size.width! >= 1280
//                                     ? size.width! >= 1536
//                                         ? size.width! >= 1920
//                                             ? 5
//                                             : 4
//                                         : 3
//                                     : 2
//                                 : 2
//                         }
//                         displayedRange={{
//                             random: availabilities?.map((a) => ({
//                                 from: DateTime.fromISO(a.startAt),
//                                 to: DateTime.fromISO(a.endAt),
//                                 item: a,
//                                 onClick: (availability: AvailabilityType) => {
//                                     setSelectedAvailability(availability)
//                                     setSheetIsOpen(true)
//                                 },
//                             })),
//                             randomColor: [
//                                 'blue',
//                                 'green',
//                                 'yellow',
//                                 'purple',
//                                 'orange',
//                                 'cyan',
//                                 'pink',
//                             ],
//                         }}
//                     />
//                 </ContextMenuTrigger>
//                 <ContextMenuContent className="w-64">
//                     <ContextMenuItem inset>
//                         {/* {hoveredDay?.toDateString()} */}
//                     </ContextMenuItem>
//                 </ContextMenuContent>
//             </ContextMenu>
//             <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] h-screen flex flex-col justify-between">
//                 <div>
//                     <SheetHeader>
//                         <SheetTitle>
//                             Edit profile {selectedAvailability?.id}
//                         </SheetTitle>
//                         <SheetDescription>
//                             Make changes to your profile here. Click save when
//                             you&apos;re done.
//                         </SheetDescription>
//                     </SheetHeader>
//                     <AvailabilityEdit
//                         spas={spas}
//                         isSpaLoading={!isSpaFetched}
//                         selectedSpa={
//                             updatedAvailability?.availability?.spa
//                                 ? spas?.find(
//                                       (s) =>
//                                           s.id ===
//                                           updatedAvailability?.availability?.spa
//                                   )
//                                 : undefined
//                         }
//                         getClostestAvailability={async (date: string) =>
//                             (await getClosestAvailabilities(date))?.data!
//                         }
//                         defaultValues={selectedAvailability}
//                         availabilities={availabilities}
//                         onChange={(data) => {
//                             setUpdatedAvailability({
//                                 id: data.id!,
//                                 availability: data.availability,
//                             })
//                         }}
//                     />
//                 </div>
//                 <SheetFooter className="flex sm:justify-between gap-4">
//                     <Button
//                         onClick={() => {
//                             onDelete(updatedAvailability?.id!).then(
//                                 function () {
//                                     refetch()
//                                     setSheetIsOpen(false)
//                                 }
//                             )
//                         }}
//                         variant={'destructive'}
//                     >
//                         {isDeleting ? (
//                             <div className="relative">
//                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                                     <Loader size="4" />
//                                 </div>
//                                 <span className="invisible">Delete</span>
//                             </div>
//                         ) : (
//                             'Delete'
//                         )}
//                     </Button>
//                     <Button
//                         onClick={() => {
//                             onUpdate(updatedAvailability!).then(function() {
//                                 console.log("refetch")
//                                 refetch()
//                             })
//                         }}
//                         className="relative"
//                     >
//                         {isUpdating ? (
//                             <div className="relative">
//                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                                     <Loader size="4" />
//                                 </div>
//                                 <span className="invisible">Save change</span>
//                             </div>
//                         ) : (
//                             'Save change'
//                         )}
//                     </Button>
//                 </SheetFooter>
//             </SheetContent>
//         </Sheet>
//     )
// }

// type DeleteImageProps = {
//     isLoading?: boolean
//     onDelete?: () => void
//     onCancel?: () => void
// }

// function DeleteImage({ isLoading, onDelete, onCancel }: DeleteImageProps) {
//     return (
//         <>
//             <AlertDialogHeader>
//                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                     This action cannot be undone. This will permanently delete
//                     the image and remove the data associated from our servers.
//                 </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//                 <Button variant={'outline'} onClick={onCancel}>
//                     Cancel
//                 </Button>
//                 <Button disabled={isLoading} onClick={onDelete}>
//                     <span className={isLoading ? 'invisible' : 'visible'}>
//                         Continue
//                     </span>
//                     {isLoading ? (
//                         <div className="flex items-center justify-center absolute">
//                             <Loader size={'4'} />
//                         </div>
//                     ) : (
//                         ''
//                     )}
//                 </Button>
//             </AlertDialogFooter>
//         </>
//     )
// }
