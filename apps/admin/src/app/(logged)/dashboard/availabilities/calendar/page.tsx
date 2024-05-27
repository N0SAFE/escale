'use client'

import { Availability, UpdateAvailability } from '@/types/model/Availability'
import React, { useMemo } from 'react'
import { getSpas } from '../../actions'
import { useWindowSize } from '@uidotdev/usehooks'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { block } from 'million/react'
import {
    deleteAvailability,
    getAvailabilities,
    getClosestAvailabilities,
    updateAvailability,
} from '@/actions/Availability'
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
import { Select } from '@/components/ui/select'
import { parseAsInteger, useQueryState } from 'nuqs'
import {
    spaAccessor,
    querySpaId,
    DType,
    availabilitiesAccessor,
} from '../utils'
import useTableHooks from '@/hooks/useTableHooks'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import EditSheet from '@/components/atomics/templates/EditSheet'
import EditAvailability from '@/components/atomics/templates/Edit/EditAvailability'
import Relations from '@/types/model/Availability'

const AvailabilityCalendarView = () => {
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
    const [sheetIsOpen, setSheetIsOpen] = React.useState(false)
    const [selectedAvailability, setSelectedAvailability] =
        React.useState<Availability>()
    const [updatedAvailability, setUpdatedAvailability] =
        React.useState<Availability>()

    const selectedSpa = useMemo(() => {
        return spas?.find((spa) => spa.id === selectedSpaId)
    }, [spas, selectedSpaId])

    const availabilityEditMutation = useMutation({
        mutationFn: async ({
            id,
            updatedAvailability,
        }: {
            id: number
            updatedAvailability: UpdateAvailability
        }) => {
            if (!updatedAvailability) {
                return
            }
            return await updateAvailability(id, {
                startAt: updatedAvailability.startAt,
                endAt: updatedAvailability.endAt,
                spaId: updatedAvailability.spaId,
                monPrice: updatedAvailability.monPrice,
                tuePrice: updatedAvailability.tuePrice,
                wedPrice: updatedAvailability.wedPrice,
                thuPrice: updatedAvailability.thuPrice,
                friPrice: updatedAvailability.friPrice,
                satPrice: updatedAvailability.satPrice,
                sunPrice: updatedAvailability.sunPrice,
            })
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability updated')
            await refetch()
        },
    })
    const availabilityDeleteMutation = useMutation({
        mutationFn: async (availabilities: Availability[]) => {
            await Promise.all(
                availabilities.map(async (a) => {
                    await deleteAvailability(a.id)
                    incrementDeleteContext()
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability deleted')
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

    const {
        data: availabilities,
        error,
        isFetched,
        refetch,
    } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: [
            'availabilities',
            selectedMonth.toISOString(),
            selectedSpa?.id,
        ],
        queryFn: async () =>
            selectedSpa
                ? await availabilitiesAccessor({
                      search: {
                          spa: selectedSpa?.id,
                      },
                      dates: {
                          endAt: {
                              after: selectedMonth
                                  ? DateTime.fromJSDate(selectedMonth)
                                        .minus({ month: 1 })
                                        .toISODate()!
                                  : undefined,
                          },
                          startAt: {
                              before: selectedMonth
                                  ? DateTime.fromJSDate(selectedMonth)
                                        .plus({
                                            month: calendarSize + 1,
                                        })
                                        .toISODate()!
                                  : undefined,
                          },
                      },
                  })
                : [],
    })

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
                    onSelect={(spa) => {
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
                    random: availabilities?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
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
                    pickRandomColor: ({ item }) => {
                        return item.id
                    },
                }}
                onDisplayedRangeClick={(displayedAvailabilities) => {
                    if (displayedAvailabilities.length === 0) {
                        return
                    }
                    triggerToEdit(displayedAvailabilities.map((r) => r.item))
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
                    return (
                        <EditAvailability
                            isUpdating={availabilityEditMutation.isPending}
                            onEdit={(updatedAvailability) =>
                                availabilityEditMutation.mutate({
                                    id: item.id,
                                    updatedAvailability,
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
                    await availabilityDeleteMutation.mutateAsync(items!)
                    setIsEditSheetOpen(false)
                }}
                deleteContext={deleteContext}
                isLoading={availabilityDeleteMutation.isPending}
                onCancel={(e, items) => setIsDeleteDialogOpen(false)}
            />
            {/* <SheetContent className="flex w-[100vw] flex-col justify-between sm:max-w-lg md:max-w-xl">
                <div className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
                    <SheetHeader>
                        <SheetTitle>
                            Edit profile {selectedAvailability?.id}
                        </SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </SheetDescription>
                    </SheetHeader>
                    <AvailabilityEdit
                        spas={spas}
                        isSpaLoading={!isSpaFetched}
                        selectedSpa={
                            updatedAvailability?.spa
                                ? spas?.find(
                                      (s) =>
                                          s.id === updatedAvailability?.spa?.id
                                  )
                                : undefined
                        }
                        getClostestAvailabilities={async (date: string) =>
                            (await getClosestAvailabilities(date))?.data!
                        }
                        defaultValues={selectedAvailability as Availability}
                        onChange={(data) => {
                            setUpdatedAvailability(data as Availability)
                        }}
                    />
                </div>
                <SheetFooter className="flex gap-4 sm:justify-between">
                    <Button
                        onClick={() => {
                            availabilityDeleteMutation.mutate(
                                updatedAvailability?.id!
                            )
                        }}
                        variant={'destructive'}
                    >
                        {availabilityDeleteMutation.isPending ? (
                            <div className="relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
                            availabilityUpdateMutation.mutate({
                                id: updatedAvailability?.id!,
                                availability: updatedAvailability!,
                            })
                        }}
                        className="relative"
                    >
                        {availabilityUpdateMutation.isPending ? (
                            <div className="relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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

export default AvailabilityCalendarView
