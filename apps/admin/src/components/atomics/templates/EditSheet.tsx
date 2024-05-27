import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import Loader from '@/components/atomics/atoms/Loader'
import React, { useEffect } from 'react'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'

type EditSheetProps<T> = Omit<
    React.ComponentProps<typeof Sheet>,
    'children'
> & {
    isLoading: boolean
    items: T[]
    label?: React.ReactNode | ((item: T) => React.ReactNode)
    children: (item: T) => React.ReactNode
}

export default function EditSheet<T>({
    open,
    onOpenChange,
    isLoading,
    items,
    children,
    label,
    ...props
}: EditSheetProps<T>) {
    const [page, setPage] = React.useState(0)

    useEffect(() => {
        setPage(0)
    }, [open, items.length])

    useEffect(() => {
        if (page > items.length - 1) {
            setPage(0)
        }
        if (items.length === 0 && page !== 0) {
            setPage(0)
        }
    }, [items, page])

    return (
        <Sheet open={open} onOpenChange={onOpenChange} {...props}>
            <SheetContent className="flex w-[100vw] flex-col justify-between sm:max-w-lg md:max-w-xl">
                <div className="flex h-full flex-col overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
                    <SheetHeader>
                        <SheetTitle>
                            {label
                                ? typeof label === 'function'
                                    ? items.length
                                        ? label(items[page])
                                        : 'Edit'
                                    : label
                                : 'Edit'}
                        </SheetTitle>
                        <SheetDescription>
                            Make changes here. Click save when you&apos;re done.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="flex h-full w-full items-center justify-center">
                            <Loader size="4" />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto pt-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary">
                            {items.length === 0 ? (
                                <div className="text-center text-gray-500">
                                    No items to show
                                </div>
                            ) : (
                                children(items[page]!)
                            )}
                        </div>
                    )}
                </div>
                {items.length > 1 && (
                    <SheetFooter>
                        <div className="flex w-full flex-row items-center justify-between gap-4 sm:flex-col sm:justify-center">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => setPage(0)}
                                    disabled={page === 0}
                                >
                                    <span className="sr-only">
                                        Go to first page
                                    </span>
                                    <DoubleArrowLeftIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 0}
                                >
                                    <span className="sr-only">
                                        Go to previous page
                                    </span>
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === items.length - 1}
                                >
                                    <span className="sr-only">
                                        Go to next page
                                    </span>
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => setPage(items.length - 1)}
                                    disabled={page === items.length - 1}
                                >
                                    <span className="sr-only">
                                        Go to last page
                                    </span>
                                    <DoubleArrowRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                Page {page + 1} of {items.length || 0}
                            </div>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
