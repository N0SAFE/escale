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
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Textarea } from '@/components/ui/textarea'
import { createFaq, deleteFaq, getFaqs, updateFaq } from '../actions'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/atomics/organisms/DataTable/index'
import {
    OnFaqDelete,
    OnFaqMove,
    OnFaqQuestionUpdate,
    OnFaqResponseUpdate,
    useColumns,
} from './columns'
import React, { useCallback, useEffect, useMemo } from 'react'
import { CreateFaq, Editable, UpdateFaq, Uuidable } from '@/types/index'
import { v4 as uuid } from 'uuid'
import Loader from '@/components/atomics/atoms/Loader'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export default function FaqWebsitePage() {
    const {
        data: faqs,
        isFetched,
        refetch,
    } = useQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            const faqs = await getFaqs()
            return faqs.map((faq) => ({
                uuid: uuid(),
                data: {
                    ...faq,
                },
                isEdited: false,
                isNew: false,
                isDeleted: false,
            })) as Uuidable<Editable<CreateFaq>>[]
        },
    })

    const [isSaving, setIsSaving] = React.useState(false)

    const faqDeleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await deleteFaq(id)
        },
    })

    const faqUpdateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateFaq }) => {
            console.log('update faq fn')
            return await updateFaq(id, data)
        },
    })

    const faqCreateMutation = useMutation({
        mutationFn: async (data: CreateFaq) => {
            try {
                await createFaq(data)
                console.log('create faq fn')
            } catch (e) {
                console.log(e)
            }
        },
    })

    const [editButtonIsOpen, setEditButtonIsOpen] = React.useState(false)

    const [faqsState, setFaqsState] = React.useState<
        Uuidable<Editable<CreateFaq>>[] | undefined
    >(faqs)

    const faqsStateByRank = useMemo(() => {
        return faqsState?.sort((a, b) => a.data.rank - b.data.rank)
    }, [faqsState])

    useEffect(() => {
        setFaqsState(faqs)
    }, [faqs])

    const lastIndex =
        useMemo(() => {
            return faqsState?.reduce<number>((acc, faq) => {
                return faq.data.rank > acc ? faq.data.rank : acc
            }, 0)
        }, [faqsState]) || 0

    // console.log('faqs', faqsState)

    const onFaqQuestionUpdate = useCallback<OnFaqQuestionUpdate>(
        (editedFaq, question) => {
            const updatedFaqs = faqsState?.map((editableFaq, index) => {
                if (editableFaq.uuid === editedFaq.uuid) {
                    return {
                        ...editableFaq,
                        data: {
                            ...editableFaq.data,
                            question,
                        },
                        isEdited: editableFaq.isNew ? false : true,
                    }
                }
                return editableFaq
            })
            setFaqsState(updatedFaqs)
        },
        [faqsState]
    )

    const onFaqResponseUpdate = useCallback<OnFaqResponseUpdate>(
        (editedFaq, answer) => {
            const updatedFaqs = faqsState?.map((editableFaq, index) => {
                if (editableFaq.uuid === editedFaq.uuid) {
                    return {
                        ...editableFaq,
                        data: {
                            ...editableFaq.data,
                            answer,
                        },
                        isEdited: editableFaq.isNew ? false : true,
                    }
                }
                return editableFaq
            })
            setFaqsState(updatedFaqs)
            console.log('answer', editedFaq, answer)
        },
        [faqsState]
    )

    const onFaqDelete = useCallback<OnFaqDelete>(
        (deletedFaq) => {
            const updatedFaqs = faqsState?.map((editableFaq, index) => {
                if (editableFaq.uuid === deletedFaq.uuid) {
                    return {
                        ...editableFaq,
                        isDeleted: true,
                    }
                }
                return editableFaq
            })
            setFaqsState(updatedFaqs)
        },
        [faqsState]
    )

    const onFaqMove = useCallback<OnFaqMove>(
        (movedFaq, direction) => {
            if (!faqsStateByRank) return
            const movedFaqIndex = faqsStateByRank?.findIndex(
                (faq) => faq.uuid === movedFaq.uuid
            )
            const movedToIndex =
                direction === 'up' ? movedFaqIndex - 1 : movedFaqIndex + 1
            console.log(movedFaqIndex)
            console.log(movedToIndex)
            const updatedFaqs = faqsStateByRank
                ?.map((editableFaq, index) => {
                    if (movedToIndex === index) {
                        return {
                            ...editableFaq,
                            data: {
                                ...editableFaq.data,
                                rank: movedFaq.data.rank,
                            },
                            isEdited: editableFaq.isNew ? false : true,
                        }
                    } else if (editableFaq.uuid === movedFaq.uuid) {
                        return {
                            ...editableFaq,
                            data: {
                                ...editableFaq.data,
                                rank: faqsStateByRank[movedToIndex].data.rank,
                            },
                            isEdited: editableFaq.isNew ? false : true,
                        }
                    }
                    return editableFaq
                })
                ?.sort((a, b) => a.data.rank - b.data.rank)
            console.log(updatedFaqs)
            setFaqsState(updatedFaqs)
        },
        [faqsStateByRank]
    )

    const useColumnsOptions = useMemo(() => {
        console.log('render useColumnsOptions')
        return {
            onFaqQuestionUpdate,
            onFaqResponseUpdate,
            onFaqDelete,
            onFaqMove,
        }
    }, [onFaqQuestionUpdate, onFaqResponseUpdate, onFaqDelete, onFaqMove])

    const columns = useColumns(useColumnsOptions)

    const discard = () => {
        setFaqsState(faqs)
    }

    const save = async () => {
        console.log(faqsState)
        setIsSaving(true)
        console.log('isSaving')
        const editedPromises = Promise.all(
            faqsState
                ?.filter((faq) => faq.isEdited)
                ?.map(async (faq) => {
                    console.log('update ' + (faq as any).id)
                    return await faqUpdateMutation.mutateAsync({
                        id: (faq as any).data.id,
                        data: faq.data,
                    })
                }) || []
        )
        const newPromises = Promise.all(
            faqsState
                ?.filter((faq) => faq.isNew)
                ?.map(async (faq) => {
                    console.log('create')
                    return await faqCreateMutation.mutateAsync(faq.data)
                }) || []
        )
        const deletedPromises = Promise.all(
            faqsState
                ?.filter((faq) => faq.isDeleted && !faq.isNew)
                ?.map(async (faq) => {
                    console.log('delete')
                    return await faqDeleteMutation.mutateAsync(
                        (faq as any).data.id
                    )
                }) || []
        )
        console.log('await promise')
        await Promise.all([editedPromises, newPromises, deletedPromises])
        toast.success('Faqs saved')
        setIsSaving(false)
        refetch()
    }

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto w-full max-w-[59rem] flex-1 auto-rows-max gap-4 flex flex-col">
                <div className="flex items-center gap-4">
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Edit faq
                    </h1>
                    <DropdownMenu
                        open={editButtonIsOpen}
                        onOpenChange={(e) => {
                            console.log(e)
                            setEditButtonIsOpen(e)
                        }}
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => discard()}
                        >
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
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card
                        x-chunk="dashboard-07-chunk-1 h-full"
                        className="overflow-auto"
                    >
                        <CardHeader>
                            <CardTitle>Faqs</CardTitle>
                            <CardDescription>
                                Manage the faqs of the website
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                divClassname="max-h-[500px]"
                                columns={columns}
                                data={faqsStateByRank?.filter(
                                    (faq) => !faq.isDeleted
                                )}
                                isLoading={!isFetched}
                            />
                        </CardContent>
                        <CardFooter className="justify-center border-t p-4">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1"
                                onClick={() => {
                                    setFaqsState(
                                        faqsState
                                            ? [
                                                  {
                                                      uuid: uuid(),
                                                      isEdited: false,
                                                      isNew: true,
                                                      isDeleted: false,
                                                      data: {
                                                          question: '',
                                                          answer: '',
                                                          rank: lastIndex + 1,
                                                      },
                                                  },
                                                  ...faqsState,
                                              ]
                                            : [
                                                  {
                                                      uuid: uuid(),
                                                      isEdited: false,
                                                      isNew: true,
                                                      isDeleted: false,
                                                      data: {
                                                          question: '',
                                                          answer: '',
                                                          rank: lastIndex + 1,
                                                      },
                                                  },
                                              ]
                                    )
                                }}
                            >
                                <PlusCircle className="h-3.5 w-3.5" />
                                Add Question
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    )
}
