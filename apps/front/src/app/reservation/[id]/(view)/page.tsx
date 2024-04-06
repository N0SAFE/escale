'use client'

import ImageCarousel from '@/components/ImageCarousel/index'
import { Separator } from '@/components/ui/separator'
import { DateTime, Settings } from 'luxon'
import { DateRange } from 'react-day-picker'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import {
    getSessionUrl,
    getPrice,
    getSpa,
    getAvailabilities,
    getReservations,
    getClosestUnavailabilities,
    getAvailableDates,
    getClosestUnreservable,
} from './actions'
import Loader from '@/components/Loader/index'
import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ApiImage from '@/components/ApiImage'
import { useEffect, useMemo, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import SelectDate from '@/components/SelectDate/index'
import { Button } from '@/components/ui/button'
import { navigate } from '@/app/actions/navigate'
import { RedirectType } from 'next/navigation'
import { toast } from 'sonner'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { SpeakerModerateIcon } from '@radix-ui/react-icons'

// ! exessive rendering
// ! the availabilies and reservations are not updated when the month is changed and the result is that every availabilities and reservations are fetched

const Reservation = ({ params }: { params: { id: string } }) => {
    const { id } = params

    console.log(id)

    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>()
    const [selectedType, setSelectedType] = useState<
        'journey' | 'night' | undefined
    >('night')
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [error, setError] = useState<string | undefined>()
    // const [price, setPrice] = useState<number | undefined>();

    // startAt is the first day of the month inside selectedMonth
    const startAt = DateTime.fromISO(
        DateTime.fromISO(selectedMonth.toISOString()).toISODate()!,
        { zone: 'utc' }
    )
        .set({
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
        })
        .minus({ month: 1 }) as DateTime<true>
    const endAt = startAt.plus({ month: 3 }).minus({ day: 1 })
    const {
        data: spa,
        error: spaError,
        isFetched: isSpaFetched,
    } = useQuery({
        queryKey: ['spa', id],
        queryFn: async () => {
            const { data } = await getSpa(Number(id))
            return data
        },
        enabled: !!id,
    })
    const { data: closestUnavailabilitiesAndReservations } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: [
            'closestUnavailabilities',
            selectedDate?.from?.toISOString(),
        ],
        queryFn: async () => {
            return !selectedDate?.from
                ? undefined
                : await getClosestUnavailabilities(
                      DateTime.fromJSDate(selectedDate?.from).toISODate()!
                  )
        },
        enabled: !!selectedDate?.from,
    })
    console.log(closestUnavailabilitiesAndReservations)
    const {
        data: price,
        error: priceError,
        isFetched: isPriceFetched,
        refetch: refetchPrice,
    } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: ['price', params.id, selectedDate, selectedType],
        queryFn: async () => {
            if (!selectedDate || !selectedType) {
                return null
            }
            const { data } = await getPrice(
                Number(params.id),
                selectedDate as DateRange,
                selectedType
            )
            return data
        },
        enabled: !!id && !!selectedDate && !!selectedType,
    })

    const confirmMutation = useMutation({
        mutationFn: async ({
            type,
            date,
        }: {
            type?: 'night' | 'journey'
            date?: DateRange
        }) => {
            if (!type || !date) {
                throw new Error('type or date is undefined')
            }
            return await getSessionUrl(Number(id), type, date)
        },
        onSuccess: (data) => {
            navigate(data, RedirectType.push)
        },
        onError: (error) => {
            setError(error.message)
        },
    })

    const { data: availableDates } = useQuery({
        queryKey: ['availableDates', id, startAt.toISODate()],
        queryFn: async () => {
            return id
                ? new Map<
                      string,
                      Awaited<ReturnType<typeof getAvailableDates>>[number]
                  >(
                      await getAvailableDates(
                          Number(id),
                          startAt.toISODate()!,
                          endAt.toISODate()!,
                          {
                              includeExternalReservedCalendarEvents: true,
                              includeReservations: true,
                              includeAvailabilities: true,
                              includeExternalBlockedCalendarEvents: true,
                          }
                      ).then((r) => r.map((data) => [data.date, data]))
                  )
                : new Map<
                      string,
                      Awaited<ReturnType<typeof getAvailableDates>>[number]
                  >()
        },
        enabled: !!id,
    })

    console.log('availableDates', availableDates)

    const { data: closestUnreservableDate } = useQuery({
        queryKey: ['closestAllReservations', selectedDate?.from?.toISOString()],
        queryFn: async () => {
            const closestUnreservablilities = id
                ? await getClosestUnreservable?.(
                      Number(id),
                      DateTime.fromJSDate(selectedDate?.from!).toISODate()!,
                      [],
                      {
                          includeExternalReservedCalendarEvents: true,
                          includeExternalBlockedCalendarEvents: true,
                          includeUnavailabilities: true,
                      }
                  )
                : {}

            return {
                past: closestUnreservablilities.past
                    ? DateTime.fromISO(closestUnreservablilities.past)
                    : undefined,
                future: closestUnreservablilities.future
                    ? DateTime.fromISO(closestUnreservablilities.future)
                    : undefined,
            }
        },
        enabled: !!selectedDate?.from,
    })

    console.log('closestUnreservableDate', {
        past: closestUnreservableDate?.past?.toISODate(),
        future: closestUnreservableDate?.future?.toISODate(),
    })

    // const availableDates = useMemo(() => {
    //     if (!reservations || !availabilities) {
    //         return new Set()
    //     }
    //     const numberOfDays = endAt.diff(startAt, 'days').days + 1
    //     const array = Array.from({ length: numberOfDays }, (_, i) => {
    //         const date = startAt.plus({ days: i })

    //         if (selectedDate?.from) {
    //             const isBooked = !!reservations.find((reservation) => {
    //                 return (
    //                     date >
    //                         (!selectedDate?.to
    //                             ? DateTime.fromISO(reservation.startAt, {
    //                                   zone: 'utc',
    //                               })
    //                             : DateTime.fromISO(reservation.startAt, {
    //                                   zone: 'utc',
    //                               }).minus({ days: 1 })) &&
    //                     date <
    //                         DateTime.fromISO(reservation.endAt, { zone: 'utc' })
    //                 )
    //             })

    //             const isAvailable = !!availabilities.find((availability) => {
    //                 return (
    //                     date >=
    //                         DateTime.fromISO(availability.startAt, {
    //                             zone: 'utc',
    //                         }) &&
    //                     date <=
    //                         (!selectedDate?.to
    //                             ? DateTime.fromISO(availability.endAt, {
    //                                   zone: 'utc',
    //                               }).plus({ days: 1 })
    //                             : DateTime.fromISO(availability.endAt, {
    //                                   zone: 'utc',
    //                               }))
    //                 )
    //             })

    //             const isInClosestUnavailability = !(
    //                 (closestUnavailabilitiesAndReservations?.unavailabilities
    //                     ?.down?.startAt
    //                     ? DateTime.fromISO(
    //                           closestUnavailabilitiesAndReservations
    //                               ?.unavailabilities?.down?.startAt,
    //                           { zone: 'utc' }
    //                       )! >= date
    //                     : false) &&
    //                 (closestUnavailabilitiesAndReservations?.unavailabilities
    //                     ?.up?.endAt
    //                     ? DateTime.fromISO(
    //                           closestUnavailabilitiesAndReservations
    //                               ?.unavailabilities?.up?.endAt,
    //                           { zone: 'utc' }
    //                       ) <= date
    //                     : false)
    //             )

    //             const isInClosestReservation = !(
    //                 (closestUnavailabilitiesAndReservations?.reservations?.down
    //                     ?.startAt
    //                     ? DateTime.fromISO(
    //                           closestUnavailabilitiesAndReservations
    //                               ?.reservations?.down?.startAt,
    //                           { zone: 'utc' }
    //                       )! >= date
    //                     : false) &&
    //                 (closestUnavailabilitiesAndReservations?.reservations?.up
    //                     ?.endAt
    //                     ? DateTime.fromISO(
    //                           closestUnavailabilitiesAndReservations
    //                               ?.reservations?.up?.endAt,
    //                           { zone: 'utc' }
    //                       ) <= date
    //                     : false)
    //             )

    //             return {
    //                 date: date.toISODate(),
    //                 available:
    //                     !isBooked &&
    //                     isAvailable &&
    //                     !isInClosestUnavailability &&
    //                     !isInClosestReservation,
    //             }
    //         }

    //         const isBooked = !!reservations.find((reservation) => {
    //             return (
    //                 date >
    //                     DateTime.fromISO(reservation.startAt, {
    //                         zone: 'utc',
    //                     }).minus({ days: 1 }) &&
    //                 date < DateTime.fromISO(reservation.endAt, { zone: 'utc' })
    //             )
    //         })

    //         const isAvailable = !!availabilities.find((availability) => {
    //             // check if the date is between the start and end of the availability
    //             return (
    //                 date >=
    //                     DateTime.fromISO(availability.startAt, {
    //                         zone: 'utc',
    //                     }) &&
    //                 date <=
    //                     DateTime.fromISO(availability.endAt, { zone: 'utc' })
    //             )
    //         })

    //         return {
    //             date: date.toISODate(),
    //             available: !isBooked && isAvailable,
    //         }
    //     })
    //     return array.reduce((acc, date) => {
    //         if (date.available === true) {
    //             acc.add(date.date)
    //         }
    //         return acc
    //     }, new Set<string>())
    // }, [
    //     reservations,
    //     availabilities,
    //     startAt,
    //     closestUnavailabilitiesAndReservations,
    // ])

    console.log(availableDates)

    useEffect(() => {
        refetchPrice()
    }, [selectedType, selectedDate, refetchPrice])

    useEffect(() => {
        if (selectedDate?.from) {
            if (
                availableDates?.get(
                    DateTime.fromJSDate(selectedDate.from).toISODate() as string
                )?.partial === 'departure'
            ) {
                setSelectedDate({
                    from: DateTime.fromJSDate(selectedDate.from)
                        .minus({ day: 1 })
                        .toJSDate(),
                    to: selectedDate.from,
                })
            }
        }
    }, [selectedDate, availableDates])

    // useEffect(() => {
    //     if (
    //         spaError ||
    //         availabilitiesError ||
    //         reservationsError ||
    //         priceError
    //     ) {
    //         toast.error('an error occure on the client')
    //     }
    // }, [spaError, availabilitiesError, reservationsError, priceError])

    // console.log(price)

    // async function onConfirm(selected: "night" | "journey" | undefined, date: Date | DateRange | undefined): Promise<string | undefined> {
    //     return confirm(Number(id), selected, date);
    // }

    // console.log(availableDates)
    // console.log(reservations, availabilities)
    // console.log(selectedMonth)

    if (!isSpaFetched) {
        // ! try to know why the data is not loaded the same way in the admin part than in this part (prefetching data not here)
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    // console.log(availableDates)

    if (!spa) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <h1>Spa not found</h1>
            </div>
        )
    }

    return (
        <>
            <div className="mx-4 mt-4">
                <div className="md:hidden">
                    {/* <DatePickerSmall onConfirm={onConfirm} getPrice={onGetPrice} getAvailableDates={onGetAvailableDates} /> */}
                </div>
                <ImageCarousel
                    images={
                        spa?.spaImages.map(function (spaImage) {
                            return (
                                process.env.NEXT_PUBLIC_API_URL +
                                '/attachment/image/' +
                                spaImage.image.id
                            )
                        })!
                    }
                />
                <div className="xl:mx-46 lg:mx-24 md:mx-0 flex gap-8 flex-row py-8">
                    <div className="w-full lg:w-2/3 md:w-1/2">
                        <div>
                            <h1 className="text-6xl my-8">{spa.title}</h1>
                            <div className="mb-4">
                                <Link
                                    className="underline underline-offset-4"
                                    href={spa.googleMapsLink}
                                    target="_blank"
                                >
                                    {spa.location}
                                </Link>
                            </div>
                            {/* <div className="grid-cols-3 grid">
                                {spa.tags.map((tag, index) => (
                                    <div key={index} className="flex gap-2">
                                        <FontAwesomeIcon icon={tag.icon as IconProp} width={30} height={30} />
                                        <span>
                                            {tag.number} {tag.label}
                                        </span>
                                    </div>
                                ))}
                            </div> */}
                            <div className="py-16">
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: spa.description,
                                    }}
                                ></p>
                            </div>
                            <h3 className="text-2xl">Les Services</h3>
                            <div className="grid grid-cols-3 gap-4 pt-8 md:grid-cols-3 lg:grid-cols-4">
                                {spa.services.map((service, index) => (
                                    <div key={index}>
                                        <AspectRatio ratio={4 / 3}>
                                            <ApiImage
                                                identifier={service.image.id}
                                                alt={service.label}
                                                width={300}
                                                height={100}
                                                className="rounded-lg h-full w-full"
                                            />
                                        </AspectRatio>
                                        <p>{service.label}</p>
                                    </div>
                                ))}
                            </div>
                            {/* <img src={spa.image} alt={spa.name} /> */}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 md:w-1/2 h-fit gap-8 hidden md:flex">
                        <Separator orientation="vertical" className="h-auto" />
                        <div>
                            <span className="text-2xl font-bold">
                                à partir de 150 €
                            </span>
                            <div className={'flex flex-col gap-2 w-full mt-4'}>
                                <div className="flex gap-2 items-center">
                                    <span className="text-nowrap">
                                        réserver pour :{' '}
                                    </span>
                                    <Select
                                        defaultValue="night"
                                        onValueChange={(value) => {
                                            setSelectedType(
                                                value as 'journey' | 'night'
                                            )
                                        }}
                                    >
                                        <SelectTrigger className="max-w-[190px] w-full bg-white text-black">
                                            <SelectValue placeholder="select a reservation time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectItem value="journey">plusieurs jours</SelectItem> */}
                                                <SelectItem value="night">
                                                    la nuit
                                                </SelectItem>
                                                {/* <SelectItem value="afternoon">l&apos;après-midi</SelectItem> */}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <SelectDate
                                    multiple
                                    onSelect={setSelectedDate}
                                    onMonthChange={function (date) {
                                        setSelectedMonth(date)
                                    }}
                                    disableDateFunction={(date) => {
                                        // console.log(date)
                                        // console.log( new Date() > date)
                                        // console.log(availableDates)
                                        // console.log(DateTime.fromJSDate(
                                        //     date
                                        // ).toSQLDate())
                                        // console.log(!availableDates.has(
                                        //     DateTime.fromJSDate(
                                        //         date
                                        //     ).toSQLDate() as string
                                        // ))
                                        return (
                                            !availableDates?.get(
                                                DateTime.fromJSDate(
                                                    date
                                                ).toSQLDate() as string
                                            )?.isAvailable ||
                                            new Date() > date ||
                                            (closestUnreservableDate?.past
                                                ? date <
                                                  closestUnreservableDate.past.toJSDate()
                                                : false) ||
                                            (closestUnreservableDate?.future
                                                ? date >
                                                  closestUnreservableDate.future.toJSDate()
                                                : false)
                                        )
                                    }}
                                    defaultValue={{ date: selectedDate }}
                                />
                                {error && (
                                    <p className="text-red-600">{error}</p>
                                )}
                                <Collapsible
                                    title="Détails"
                                    className="flex flex-col gap-4"
                                >
                                    <div className="flex justify-between">
                                        <Button
                                            disabled={confirmMutation.isPending}
                                            onClick={() =>
                                                confirmMutation.mutate({
                                                    type: selectedType,
                                                    date: selectedDate,
                                                })
                                            }
                                        >
                                            {confirmMutation.isPending ? (
                                                <div className="flex items-center justify-center gap-1 p-4">
                                                    <Loader className="p-1" />
                                                </div>
                                            ) : (
                                                'confirmer'
                                            )}
                                        </Button>
                                        {price ? (
                                            <CollapsibleTrigger>
                                                details
                                            </CollapsibleTrigger>
                                        ) : null}
                                    </div>
                                    <CollapsibleContent className="flex-col gap-8">
                                        {price?.details.toPrice.map(function (
                                            { price, number },
                                            index
                                        ) {
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex justify-between"
                                                >
                                                    <div className="flex gap-2">
                                                        <span>{number}</span>*
                                                        <span>
                                                            {price / 100}€
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span>
                                                            {(price * number) /
                                                                100}
                                                            €
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </CollapsibleContent>
                                    <div className="flex justify-between">
                                        <span>total</span>
                                        <span className="font-bold">
                                            {price?.price! / 100 || 0}€
                                        </span>
                                    </div>
                                </Collapsible>
                            </div>
                            {/* <DatePicker onConfirm={onConfirm} getPrice={onGetPrice} getAvailableDates={onGetAvailableDates} className="mt-4" /> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reservation
