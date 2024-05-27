'use client'

import { Reservation, UpdateReservation } from '@/types/model/Reservation'
import { Spa } from '@/types/model/Spa'
import React, { useEffect, useMemo } from 'react'
import { getSpas } from '../../actions'
import { useWindowSize } from '@uidotdev/usehooks'
import {
    keepPreviousData,
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { DateTime } from 'luxon'
import {
    deleteReservation,
    updateReservation,
    createReservation,
    getCalendarEvents,
} from '../actions'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import Loader from '@/components/atomics/atoms/Loader'
import { toast } from 'sonner'
import Combobox from '@/components/atomics/molecules/Combobox'
import { parseAsInteger, useQueryState } from 'nuqs'
import { querySpaId } from '../utils'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import CreateReservation from '@/components/atomics/templates/Create/CreateReservation'
import { CreateReservation as CreateReservationType } from '@/types/model/Reservation'
import EditSheet from '@/components/atomics/templates/EditSheet'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import useTableHooks from '@/hooks/useTableHooks'
import EditReservation from '@/components/atomics/templates/Edit/EditReservation'
import { DType, reservationsAccessor, spaAccessor } from '../utils'
import { start } from 'repl'
import { xiorInstance } from '@/utils/xiorInstance'
import { xior } from 'xior'

const ReservationCalendarView = () => {
    const {
        data: spas,
        isFetched: isSpaFetched,
        isError,
    } = useQuery({
        queryKey: ['spas'],
        queryFn: async () => {
            return await spaAccessor()
        },
    })
    const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date())
    const [selectedSpaId, setSelectedSpaId] = useQueryState(
        querySpaId,
        parseAsInteger
    )
    const [selectedReservations, setSelectedReservations] = React.useState<{
        list: Reservation[]
        active?: Reservation
    }>()
    const [updatedReservation, setUpdatedReservation] = React.useState<{
        id: number
        reservation: UpdateReservation
    }>()

    const selectedSpa = useMemo(() => {
        return spas?.find((spa) => spa.id === selectedSpaId)
    }, [spas, selectedSpaId])

    const reservationEditMutation = useMutation({
        mutationFn: async ({
            updatedReservation,
            id,
        }: {
            updatedReservation: UpdateReservation
            id: number
        }) => {
            return await updateReservation(id, updatedReservation)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('Reservation updated')
            await refetch()
        },
    })
    const reservationDeleteMutation = useMutation({
        mutationFn: async (reservations: Reservation[]) => {
            await Promise.all(
                reservations.map(async (r) => {
                    await deleteReservation(r.id)
                    incrementDeleteContext()
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('reservation deleted')
            setIsDeleteDialogOpen(false)
            setIsEditSheetOpen(false)
            await refetch()
        },
    })

    const size = useWindowSize()
    const calendarSize = React.useMemo(
        () =>
            size.width! >= 640
                ? size.width! >= 1280
                    ? size.width! >= 1536
                        ? size.width! >= 1920
                            ? 5
                            : 4
                        : 3
                    : 2
                : 2,
        [size]
    )

    const { data } = useQuery({
        queryKey: [],
        queryFn: async () => {
            return await xior.create().get('http')
        },
    })

    console.log(data)

    const {
        refetch,
        data: [{ data: events }, { data: reservations }],
    } = useQueries({
        combine: (array) => {
            return {
                data: array,
                refetch: () => {
                    array.forEach((query) => {
                        query.refetch()
                    })
                },
            }
        },
        queries: [
            {
                placeholderData: keepPreviousData,
                queryKey: [
                    'events',
                    selectedSpa?.externalCalendar.id,
                    selectedMonth.toISOString(),
                ],
                queryFn: async () => {
                    if (!selectedSpa?.id || selectedSpa?.id === -1) {
                        return []
                    }
                    return getCalendarEvents(selectedSpa.externalCalendar.id, {
                        from: DateTime.fromJSDate(selectedMonth)
                            .minus({ month: 1 })
                            .toISODate()!,
                        to: DateTime.fromJSDate(selectedMonth)
                            .plus({ month: calendarSize + 1 })
                            .toISODate()!,
                    })
                },
            },
            {
                placeholderData: keepPreviousData,
                queryKey: [
                    'reservations',
                    selectedSpa?.id,
                    selectedMonth.toISOString(),
                ],
                queryFn: async () => {
                    if (!selectedSpa?.id || selectedSpa?.id === -1) {
                        return []
                    }
                    const reservations = await reservationsAccessor({
                        search: {
                            spaId: selectedSpa?.id || -1,
                        },
                        dates: {
                            startAt: {
                                after: DateTime.fromJSDate(selectedMonth)
                                    .minus({ month: 1 })
                                    .toISODate()!,
                            },
                            endAt: {
                                before: DateTime.fromJSDate(selectedMonth)
                                    .plus({ month: calendarSize + 1 })
                                    .toISODate()!,
                            },
                        },
                    })
                    return reservations
                },
            },
        ],
    })

    // const { data: events } = useQuery({
    //     placeholderData: keepPreviousData,
    //     queryKey: [
    //         'events',
    //         selectedSpa?.externalCalendar.id,
    //         selectedMonth.toISOString(),
    //     ],
    //     queryFn: async () => {
    //         if (!selectedSpa?.id || selectedSpa?.id === -1) {
    //             return []
    //         }
    //         return getCalendarEvents(selectedSpa.externalCalendar.id, {
    //             from: DateTime.fromJSDate(selectedMonth)
    //                 .minus({ month: 1 })
    //                 .toISODate()!,
    //             to: DateTime.fromJSDate(selectedMonth)
    //                 .plus({ month: calendarSize + 1 })
    //                 .toISODate()!,
    //         })
    //     },
    // })

    // console.log(events)

    // console.log(selectedSpa?.id)

    // const {
    //     data: reservations,
    //     error,
    //     isFetched,
    //     refetch,
    // } = useQuery({
    //     placeholderData: keepPreviousData,
    //     queryKey: [
    //         'reservations',
    //         selectedSpa?.id,
    //         selectedMonth.toISOString(),
    //     ],
    //     queryFn: async () => {
    //         console.log(selectedSpa?.id)
    //         console.log({
    //             search: {
    //                 spaId: selectedSpa?.id || -1,
    //             },
    //             dates: {
    //                 startAt: {
    //                     after: DateTime.fromJSDate(selectedMonth)
    //                         .minus({ month: 1 })
    //                         .toISODate()!,
    //                 },
    //                 endAt: {
    //                     before: DateTime.fromJSDate(selectedMonth)
    //                         .plus({ month: calendarSize + 1 })
    //                         .toISODate()!,
    //                 },
    //             },
    //         })
    //         try {
    //             const reservations = await reservationsAccessor({
    //                 search: {
    //                     spaId: selectedSpa?.id || -1,
    //                 },
    //                 dates: {
    //                     startAt: {
    //                         after: DateTime.fromJSDate(selectedMonth)
    //                             .minus({ month: 1 })
    //                             .toISODate()!,
    //                     },
    //                     endAt: {
    //                         before: DateTime.fromJSDate(selectedMonth)
    //                             .plus({ month: calendarSize + 1 })
    //                             .toISODate()!,
    //                     },
    //                 },
    //             })
    //             console.log(reservations)
    //             return reservations
    //         } catch (error) {
    //             console.log(error)
    //         }

    //     },
    // })

    // console.log(reservations)

    const { blockedEvents, reservedEvents } = events?.reduce<{
        blockedEvents: typeof events
        reservedEvents: typeof events
    }>(
        (acc, e) => ({
            blockedEvents:
                e.type === 'blocked'
                    ? [...acc.blockedEvents, e]
                    : acc.blockedEvents,
            reservedEvents:
                e.type === 'reserved'
                    ? [...acc.reservedEvents, e]
                    : acc.reservedEvents,
        }),
        { blockedEvents: [], reservedEvents: [] }
    ) || {
        blockedEvents: [],
        reservedEvents: [],
    }

    const {
        deleteContext,
        isCreateDialogOpen,
        isDeleteDialogOpen,
        isEditSheetOpen,
        isViewSheetOpen,
        selectedToDelete,
        selectedToEdit,
        selectedToView,
        setDeleteContext,
        setIsCreateDialogOpen,
        setIsDeleteDialogOpen,
        setIsEditSheetOpen,
        setIsViewSheetOpen,
        triggerToDelete,
        triggerToEdit,
        triggerToView,
        incrementDeleteContext,
    } = useTableHooks<DType>()

    // console.log(selectedSpa)
    // console.log(spas)

    return (
        // <Sheet
        //     open={sheetIsOpen}
        //     onOpenChange={() => setSheetIsOpen(!sheetIsOpen)}
        // >
        <>
            <div className="flex w-full justify-center py-4 ">
                <Combobox
                    className="col-span-3"
                    items={spas?.map((spa) => ({
                        label: spa.title,
                        value: spa,
                    }))}
                    isLoading={!isSpaFetched}
                    defaultPreviewText="Select a spa..."
                    value={selectedSpa}
                    onSelect={(spa): void => {
                        setSelectedSpaId(spa?.id || null)
                    }}
                />
            </div>
            <Calendar
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                mode="range"
                className="flex w-full justify-center overflow-hidden"
                selected={undefined}
                numberOfMonths={calendarSize}
                displayedRange={{
                    random: reservations?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
                        fromPortion: { portion: 2, index: 1 },
                        toPortion: { portion: 2, index: 1 },
                        item: a,
                    })),
                    randomColor: [
                        'blue',
                        'green',
                        'yellow',
                        'purple',
                        'orange',
                        'cyan',
                        'pink',
                    ],
                    red: reservedEvents?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
                        fromPortion: { portion: 2, index: 1 },
                        toPortion: { portion: 2, index: 1 },
                    })),
                    gray: blockedEvents?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
                        fromPortion: { portion: 2, index: 1 },
                        toPortion: { portion: 2, index: 1 },
                    })),
                    pickRandomColor: ({ item }) => {
                        return item.id
                    },
                }}
                onDisplayedRangeClick={(displayedReservations) => {
                    if (displayedReservations.length === 0) {
                        return
                    }
                    if (displayedReservations.length === 1) {
                        // setSelectedReservations({
                        //     list: displayedReservations.map((a) => a.item),
                        //     active: displayedReservations[0].item,
                        // })
                        // setUpdatedReservation({
                        //     id: displayedReservations[0].item.id,
                        //     reservation: {
                        //         ...displayedReservations[0].item,
                        //         spaId: displayedReservations[0].item.spaId,
                        //     },
                        // })
                        triggerToEdit(displayedReservations.map((r) => r.item))
                        return
                    }
                    // setUpdatedReservation({
                    //     id: displayedReservations[0].item.id,
                    //     reservation: {
                    //         ...displayedReservations[0].item,
                    //         spaId: displayedReservations[0].item.spaId,
                    //     },
                    // })
                    // setSelectedReservations({
                    //     list: displayedReservations.map((a) => a.item),
                    //     active: displayedReservations[0].item,
                    // })
                    triggerToEdit(displayedReservations.map((r) => r.item))
                    return
                }}
                triggerColorChangeOnHover
            />

            <EditSheet
                open={isEditSheetOpen}
                onOpenChange={setIsEditSheetOpen}
                items={selectedToEdit ?? []}
                isLoading={false}
                label={(item) => `Edit ${item?.id}`}
            >
                {(item) => {
                    console.log(item)
                    return (
                        <EditReservation
                            isUpdating={reservationEditMutation.isPending}
                            onEdit={(updatedReservation) =>
                                reservationEditMutation.mutate({
                                    id: item.id,
                                    updatedReservation,
                                })
                            }
                            onDelete={async (reservation: DType) =>
                                await triggerToDelete([reservation])
                            }
                            state={{
                                spas: spas!,
                            }}
                            defaultValue={item}
                        />
                    )
                }}
            </EditSheet>
            <DeleteDialog
                items={selectedToDelete! || []}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDelete={async (e, items) => {
                    await reservationDeleteMutation.mutateAsync(items!)
                    setIsEditSheetOpen(false)
                }}
                deleteContext={deleteContext}
                isLoading={reservationDeleteMutation.isPending}
                onCancel={(e, items) => setIsDeleteDialogOpen(false)}
            />

            {/* <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] flex flex-col justify-between">
                <div className="overflow-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                    <SheetHeader>
                        <SheetTitle>
                            Edit profile{' '}
                            {selectedReservations?.list?.map(
                                (reservation) => reservation?.id
                            )}
                        </SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </SheetDescription>
                    </SheetHeader>
                    <ReservationEdit
                        spas={spas?.data}
                        isSpaLoading={spas.isLoading}
                        defaultValues={selectedReservations?.active}
                        reservationsList={selectedReservations?.list}
                        onChange={(data) => {
                            setUpdatedReservation({
                                id: data.id!,
                                reservation: data.reservation,
                            })
                        }}
                    />
                </div>
                <SheetFooter className="flex sm:justify-between gap-4">
                    <Button
                        onClick={() => {
                            reservationDeleteMutation.mutate(
                                updatedReservation?.id!
                            )
                        }}
                        variant={'destructive'}
                    >
                        {reservationDeleteMutation.isPending ? (
                            <div className="relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Loader size="4" />
                                </div>
                                <span className="invisible">Delete</span>
                            </div>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                    <Button
                        onClick={() => {
                            reservationUpdateMutation.mutate({
                                id: updatedReservation?.id!,
                                reservation: updatedReservation?.reservation!,
                            })
                        }}
                        className="relative"
                    >
                        {reservationUpdateMutation.isPending ? (
                            <div className="relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Loader size="4" />
                                </div>
                                <span className="invisible">Save change</span>
                            </div>
                        ) : (
                            'Save change'
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent> */}
        </>
        // </Sheet>
    )
}

export default ReservationCalendarView
