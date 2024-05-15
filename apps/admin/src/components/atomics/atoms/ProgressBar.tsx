'use client'

import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

type ProgressBarProps = {
    out: number
    of: number
    label: string
}

export default function ProgressBar({ out, of, label }: ProgressBarProps) {
    return (
        <div className="flex gap-4">
            <Label htmlFor="progress" className="text-right">
                Progress
            </Label>
            <Progress value={(out / of) * 100} className="w-full" />
            <span>
                {out} / {of} {label}
            </span>
        </div>
    )
}
