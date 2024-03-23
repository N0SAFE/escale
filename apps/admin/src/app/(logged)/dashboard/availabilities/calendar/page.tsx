'use client'

import { Availability, Spa, UpdateAvailability } from '@/types/index'
import React from 'react'
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
} from '../actions'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Calendar } from '@/components/ui/calendar'
import AvailabilityEdit from '@/components/AvailabillityEdit'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import Combobox from '@/components/Combobox'

const AvailabilityCalendarView = () => {
    const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date())
    const [selectedSpa, setSelectedSpa] = React.useState<Spa>()
    const [sheetIsOpen, setSheetIsOpen] = React.useState(false)
    const [selectedAvailability, setSelectedAvailability] =
        React.useState<Availability>()
    const [updatedAvailability, setUpdatedAvailability] = React.useState<{
        id: number
        availability: UpdateAvailability
    }>()

    const { data: spas, isFetched: isSpaFetched } = useQuery({
        queryKey: ['spas'],
        queryFn: async () => {
            return await getSpas()
        },
    })

    const availabilityUpdateMutation = useMutation({
        mutationFn: async ({
            id,
            availability,
        }: {
            id: number
            availability: UpdateAvailability
        }) => {
            if (!availability) {
                return
            }
            return await updateAvailability(id, availability)
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
        mutationFn: async (id: number) => {
            return await deleteAvailability(id)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('availability deleted')
            setSheetIsOpen(false)
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
        queryKey: ['availabilities', selectedMonth.toISOString(), selectedSpa],
        queryFn: async () =>
            selectedSpa
                ? await getAvailabilities({
                      groups: ['availabilities:spa'],
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

    return (
        <Sheet
            open={sheetIsOpen}
            onOpenChange={() => setSheetIsOpen(!sheetIsOpen)}
        >
            <div className="w-full py-4 flex justify-center ">
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
                        setSelectedSpa(spa)
                    }}
                />
            </div>
            <Calendar
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                mode="range"
                className="w-full overflow-hidden flex justify-center"
                selected={undefined}
                numberOfMonths={calendarSize}
                displayedRange={{
                    random: availabilities?.map((a) => ({
                        from: DateTime.fromISO(a.startAt),
                        to: DateTime.fromISO(a.endAt),
                        item: a,
                        onClick: (availability: Availability) => {
                            setSelectedAvailability(availability)
                            setSheetIsOpen(true)
                        },
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
            />
            <SheetContent className="sm:max-w-lg md:max-w-xl w-[100vw] h-screen flex flex-col justify-between">
                <div>
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
                            updatedAvailability?.availability?.spa
                                ? spas?.find(
                                      (s) =>
                                          s.id ===
                                          updatedAvailability?.availability?.spa
                                  )
                                : undefined
                        }
                        getClostestAvailabilities={async (date: string) =>
                            (await getClosestAvailabilities(date))?.data!
                        }
                        defaultValues={selectedAvailability}
                        onChange={(data) => {
                            setUpdatedAvailability({
                                id: data.id!,
                                availability: data.availability,
                            })
                        }}
                    />
                </div>
                <SheetFooter className="flex sm:justify-between gap-4">
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
                            availabilityUpdateMutation.mutate({
                                id: updatedAvailability?.id!,
                                availability:
                                    updatedAvailability?.availability!,
                            })
                        }}
                        className="relative"
                    >
                        {availabilityUpdateMutation.isPending ? (
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
            </SheetContent>
        </Sheet>
    )
}

export default AvailabilityCalendarView
