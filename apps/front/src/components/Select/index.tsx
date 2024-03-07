'use client'

import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

type Checked = DropdownMenuCheckboxItemProps['checked']

type Props = {
    buttonLabel: string
    options: {
        label: string
        value: string
        checked?: boolean
    }[]
    onSelect: (option: string) => void
}

export default function Select({ buttonLabel, options, onSelect }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{buttonLabel}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select a reservation type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {options.map((option, index) => (
                    <DropdownMenuCheckboxItem
                        key={index}
                        checked={option.checked}
                        onCheckedChange={(checked) => {
                            onSelect(option.value)
                        }}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
