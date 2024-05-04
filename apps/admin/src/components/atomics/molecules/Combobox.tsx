'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import Loader from '../atoms/Loader'
import { ScrollArea } from '../../ui/scroll-area'
import { nextTick } from 'process'

type ComboboxMultipleProps<T> = {
    defaultValue?: T[]
    value?: T[]
    onSelect?: (value: T[]) => void
    preview?: (value: T[]) => React.ReactNode
    multiple: true
}

type ComboboxSingleProps<T> = {
    defaultValue?: T
    value?: T
    onSelect?: (value: T | undefined) => void
    preview?: (value: T) => React.ReactNode
    multiple?: false
}

type ComboboxProps<T extends { id: number }> = (
    | ComboboxMultipleProps<T>
    | ComboboxSingleProps<T>
) & {
    items?: {
        label: string
        value: T
    }[]
    notFoundText?: string
    defaultPreviewText?: string
    defaultSearchText?: string
    isLoading?: boolean
    keepOpen?: boolean
    onRender?: (item: T) => React.ReactNode
}

export default function Combobox<T extends { id: number }>({
    items,
    isLoading,
    defaultValue,
    onSelect,
    defaultPreviewText = 'Select an item...',
    preview,
    notFoundText,
    multiple,
    value,
    keepOpen,
    defaultSearchText,
    className,
    onRender,
}: ComboboxProps<T> &
    Omit<React.ComponentProps<typeof Button>, keyof ComboboxProps<T>>) {
    const [open, setOpen] = React.useState(false)
    const [val, setVal] = React.useState(defaultValue)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    React.useEffect(() => {
        nextTick(() => {
            if (value === val) return
            if (value === undefined && !isMounted) {
                return
            }
            setVal(value)
        })
    }, [value, val, isMounted])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('justify-between', className)}
                >
                    {multiple ? (
                        <span className="overflow-hidden text-ellipsis">
                            {val
                                ? preview
                                    ? preview(val as T[])
                                    : (val as T[]).length + ' items selected'
                                : defaultPreviewText}
                        </span>
                    ) : (
                        <span className="overflow-hidden text-ellipsis">
                            {val
                                ? preview
                                    ? preview(val as T)
                                    : items?.find(
                                          (framework) =>
                                              framework.value.id ===
                                              (val as T).id
                                      )?.label || defaultPreviewText
                                : defaultPreviewText}
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />

                    {/* <span className="overflow-hidden text-ellipsis">{value ? preview ? preview(value) : items.find((framework) => framework.value === value)?.label : defaultPreviewText}</span> <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder={
                            defaultSearchText
                                ? defaultSearchText
                                : 'Search items...'
                        }
                    />
                    {!isLoading && (
                        <CommandEmpty>
                            {notFoundText ? notFoundText : 'No item found.'}
                        </CommandEmpty>
                    )}
                    <CommandGroup>
                        {isLoading ? (
                            <div className="h-[300px] flex justify-center items-center">
                                <Loader />
                            </div>
                        ) : (
                            <ScrollArea className="h-[300px]">
                                {multiple === true
                                    ? items?.map((item) => {
                                          const lastValue = val as
                                              | T[]
                                              | undefined
                                          return (
                                              <CommandItem
                                                  key={item.value.id}
                                                  onSelect={() => {
                                                      const newValue =
                                                          lastValue?.includes(
                                                              item.value
                                                          )
                                                              ? lastValue.filter(
                                                                    (i) =>
                                                                        i !==
                                                                        item.value
                                                                )
                                                              : [
                                                                    ...(lastValue ||
                                                                        []),
                                                                    item.value,
                                                                ]
                                                      setVal(newValue)
                                                      if (!keepOpen) {
                                                          setOpen(false)
                                                      }
                                                      onSelect?.(newValue)
                                                  }}
                                              >
                                                  {onRender?.(item.value) ||
                                                      `${item.value.id}. ${item.label}`}
                                                  <Check
                                                      className={cn(
                                                          'ml-auto h-4 w-4',
                                                          lastValue?.includes(
                                                              item.value
                                                          )
                                                              ? 'opacity-100'
                                                              : 'opacity-0'
                                                      )}
                                                  />
                                              </CommandItem>
                                          )
                                      })
                                    : items?.map((item) => {
                                          const lastValue = val as T | undefined
                                          return (
                                              <CommandItem
                                                  key={item.value.id}
                                                  value={item.label}
                                                  onSelect={(newValue) => {
                                                      setVal(
                                                          item.value ===
                                                              lastValue
                                                              ? undefined
                                                              : item.value
                                                      )
                                                      if (!keepOpen) {
                                                          setOpen(false)
                                                      }
                                                      onSelect?.(
                                                          item.value ===
                                                              lastValue
                                                              ? undefined
                                                              : item.value
                                                      )
                                                  }}
                                              >
                                                  {onRender?.(item.value) ||
                                                      item.value.id}
                                                  <Check
                                                      className={cn(
                                                          'ml-auto h-4 w-4',
                                                          lastValue ===
                                                              item.value
                                                              ? 'opacity-100'
                                                              : 'opacity-0'
                                                      )}
                                                  />
                                              </CommandItem>
                                          )
                                      })}
                            </ScrollArea>
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
