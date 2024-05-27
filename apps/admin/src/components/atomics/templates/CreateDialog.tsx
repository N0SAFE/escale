import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type CreateDialogProps<T> = React.ComponentProps<typeof Dialog> & {
    title?: string
    description?: string
}

export default function CreateDialog<T>({
    title,
    description,
    open,
    onOpenChange,
    children,
}: CreateDialogProps<T>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={'max-h-screen overflow-y-auto lg:max-w-screen-lg'}
            >
                <DialogHeader>
                    <DialogTitle>{title || 'Create'}</DialogTitle>
                    <DialogDescription>
                        {description || 'Create a new item'}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
