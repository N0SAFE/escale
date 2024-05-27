import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CreateFaq, Editable, Uuidable } from '@/types/index'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import React, { memo, useEffect } from 'react'
import { DType } from './type'

export type OnFaqQuestionUpdate = (data: DType, question: string) => void
export type OnFaqResponseUpdate = (data: DType, answer: string) => void
export type OnFaqDelete = (data: DType) => void
export type OnFaqMove = (data: DType, direction: 'up' | 'down') => void

export type ColumnOptions = {
    onFaqQuestionUpdate: OnFaqQuestionUpdate
    onFaqResponseUpdate: OnFaqResponseUpdate
    onFaqDelete: OnFaqDelete
    onFaqMove: OnFaqMove
}

export const useColumns = (options?: ColumnOptions) => {
    const columns: ColumnDef<DType>[] = [
        {
            accessorKey: 'question',
            header: 'Question',
            cell: ({ row, table, getValue, cell, column }) => {
                const onUpdateCallback = (value: string) => {
                    options?.onFaqQuestionUpdate(row.original, value)
                }
                return (
                    <QuestionCell
                        defaultValue={row.original.data.question}
                        onUpdate={onUpdateCallback}
                    />
                )
            },
        },
        {
            accessorKey: 'answer',
            header: 'Answer',
            cell: ({ row }) => {
                const onUpdateCallback = (value: string) => {
                    options?.onFaqResponseUpdate(row.original, value)
                }
                return (
                    <ResponseCell
                        defaultValue={row.original.data.answer}
                        onUpdate={onUpdateCallback}
                    />
                )
            },
        },
        {
            accessorKey: 'actions',
            header: () => <div className="flex justify-end">Actions</div>,
            cell: ({ row }) => (
                <div className="flex h-12 justify-end">
                    <Button
                        variant="destructive"
                        className="h-full"
                        onClick={() => {
                            options?.onFaqDelete(row.original)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex h-full flex-col justify-center">
                        {/* button arrow up and down */}
                        <Button
                            variant="ghost"
                            onClick={() =>
                                options?.onFaqMove(row.original, 'up')
                            }
                        >
                            <ChevronUp />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                options?.onFaqMove(row.original, 'down')
                            }
                        >
                            <ChevronDown />
                        </Button>
                    </div>
                </div>
            ),
        },
    ]
    return columns
}

type QuestionCellProps = {
    defaultValue: string
    onUpdate: (value: string) => void
}

const QuestionCell = memo(function QuestionCell({
    defaultValue,
    onUpdate,
}: QuestionCellProps) {
    const [value, setValue] = React.useState(defaultValue)

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    const onBlur = () => {
        onUpdate(value)
    }

    return (
        <Input
            value={value}
            onChange={(e) => {
                console.log('onChange')
                setValue(e.target.value)
            }}
            onBlur={onBlur}
        />
    )
})

type ResponseCellProps = {
    defaultValue: any
    onUpdate: (value: any) => void
}

const ResponseCell = memo(function ResponseCell({
    defaultValue,
    onUpdate,
}: ResponseCellProps) {
    const ref = React.useRef<HTMLTextAreaElement>(null)

    const onBlur = () => {
        onUpdate(ref.current?.value)
    }

    return <Textarea ref={ref} defaultValue={defaultValue} onBlur={onBlur} />
})
