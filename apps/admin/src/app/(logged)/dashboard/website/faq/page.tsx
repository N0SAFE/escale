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
    OnFaqQuestionUpdate,
    OnFaqResponseUpdate,
    useColumns,
} from './columns'
import React, { useCallback, useEffect, useMemo } from 'react'
import {
    CreateFaq,
    Editable,
    Orderable,
    UpdateFaq,
    Uuidable,
} from '@/types/index'
import { v4 as uuid } from 'uuid'
import Loader from '@/components/atomics/atoms/Loader'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { arrayMove } from '@dnd-kit/sortable'
import { DType } from './type'
import { UniqueIdentifier } from '@dnd-kit/core'

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
            })) as DType[]
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
            return await updateFaq(id, data)
        },
    })

    const faqCreateMutation = useMutation({
        mutationFn: async (data: CreateFaq) => {
            await createFaq(data)
        },
    })

    const [editButtonIsOpen, setEditButtonIsOpen] = React.useState(false)

    const [faqsState, setFaqsState] = React.useState<DType[] | undefined>(faqs)

    const faqsStateByRankNotDeleted = useMemo(() => {
        return faqsState
            ?.filter((faq) => !faq.isDeleted)
            ?.sort((a, b) => a.data.rank - b.data.rank)
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

    const onFaqMove = useCallback<
        (activeId: UniqueIdentifier, overId: UniqueIdentifier) => void
    >((activeId, overId) => {
        setFaqsState((faqs) => {
            if (!faqs) return []
            const activeObject = faqs.find((faq) => faq.uuid === activeId)!
            const overObject = faqs.find((faq) => faq.uuid === overId)!
            return faqs.map((faq) => ({
                ...faq,
                data: {
                    ...faq.data,
                    rank:
                        faq.uuid === activeId
                            ? overObject.data.rank
                            : faq.uuid === overId
                            ? activeObject.data.rank
                            : faq.data.rank,
                },
                isEdited:
                    faq.uuid === activeId || faq.uuid === overId
                        ? !faq.isNew
                        : faq.isEdited,
            }))
        })
        // setFaqsState((faqs) => {
        //     if (!faqs) return []
        //     const lastActiveRank = faqs[activeIndex].data.rank
        //     const lastOverRank = faqs[overIndex].data.rank
        //     faqs[activeIndex].data.rank = lastOverRank
        //     faqs[overIndex].data.rank = lastActiveRank
        //     faqs[activeIndex].isEdited = faqs[activeIndex].isNew ? false : true
        //     faqs[overIndex].isEdited = faqs[overIndex].isNew ? false : true
        //     return arrayMove(faqs, activeIndex, overIndex)
        // })
    }, [])

    const useColumnsOptions = useMemo(() => {
        return {
            onFaqQuestionUpdate,
            onFaqResponseUpdate,
            onFaqDelete,
            onFaqMove(movedFaq: DType, direction: 'up' | 'down') {
                if (!faqsStateByRankNotDeleted) return
                const movedFaqIndex = faqsStateByRankNotDeleted?.findIndex(
                    (faq) => faq.uuid === movedFaq.uuid
                )
                const movedFaqUuid =
                    faqsStateByRankNotDeleted[
                        direction === 'up'
                            ? movedFaqIndex - 1
                            : movedFaqIndex + 1
                    ].uuid
                onFaqMove(movedFaq.uuid, movedFaqUuid)
            },
        }
    }, [
        onFaqQuestionUpdate,
        onFaqResponseUpdate,
        onFaqDelete,
        onFaqMove,
        faqsStateByRankNotDeleted,
    ])

    const discard = () => {
        setFaqsState(faqs)
    }

    const save = async () => {
        setIsSaving(true)
        const editedPromises = Promise.all(
            faqsState
                ?.filter((faq) => faq.isEdited)
                ?.map(async (faq) => {
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
                    return await faqCreateMutation.mutateAsync(faq.data)
                }) || []
        )
        const deletedPromises = Promise.all(
            faqsState
                ?.filter((faq) => faq.isDeleted && !faq.isNew)
                ?.map(async (faq) => {
                    return await faqDeleteMutation.mutateAsync(
                        (faq as any).data.id
                    )
                }) || []
        )
        await Promise.all([editedPromises, newPromises, deletedPromises])
        toast.success('Faqs saved')
        setIsSaving(false)
        refetch()
    }

    const columns = useColumns(useColumnsOptions)

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto w-full max-w-[59rem] flex-1 auto-rows-max gap-4 flex flex-col">
                <div className="flex items-center gap-4">
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Edit faq
                    </h1>
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
                                useDragabble
                                rowIsDraggable
                                divClassname="max-h-[500px]"
                                columns={columns}
                                data={faqsStateByRankNotDeleted}
                                isLoading={!isFetched}
                                onReorder={({ active, over }) => {
                                    if (!faqsStateByRankNotDeleted) return
                                    if (
                                        active &&
                                        over &&
                                        active.id !== over.id
                                    ) {
                                        onFaqMove(
                                            faqsStateByRankNotDeleted.findIndex(
                                                (faq) => faq.uuid === active.id
                                            ),
                                            faqsStateByRankNotDeleted.findIndex(
                                                (faq) => faq.uuid === over.id
                                            )
                                        )
                                        setFaqsState((faqs) => {
                                            if (!faqs) return []
                                            const activeObject = faqs.find(
                                                (faq) => faq.uuid === active.id
                                            )!
                                            const overObject = faqs.find(
                                                (faq) => faq.uuid === over.id
                                            )!
                                            return faqs.map((faq) => ({
                                                ...faq,
                                                data: {
                                                    ...faq.data,
                                                    rank:
                                                        faq.uuid === active.id
                                                            ? overObject.data
                                                                  .rank
                                                            : faq.uuid ===
                                                              over.id
                                                            ? activeObject.data
                                                                  .rank
                                                            : faq.data.rank,
                                                },
                                                isEdited:
                                                    faq.uuid === active.id ||
                                                    faq.uuid === over.id
                                                        ? !faq.isNew
                                                        : faq.isEdited,
                                            }))
                                        })
                                    }
                                }}
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
