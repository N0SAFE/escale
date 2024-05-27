import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import ProgressBar from '@/components/atomics/atoms/ProgressBar'
import Loader from '@/components/atomics/atoms/Loader'

type DeleteDialogProps<T> = React.ComponentProps<typeof AlertDialog> & {
    isLoading: boolean
    deleteContext?: {
        out: number
        of: number
    }
    items: T[]
    label?: string
    onDelete: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        items: T[]
    ) => void | Promise<void>
    onCancel: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        items: T[]
    ) => void | Promise<void>
}

export default function DeleteDialog<T>({
    onOpenChange,
    isLoading,
    deleteContext,
    items,
    onDelete,
    onCancel,
    label,
    ...props
}: DeleteDialogProps<T>) {
    return (
        <AlertDialog onOpenChange={onOpenChange} {...props}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the image and remove the data associated from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {isLoading && deleteContext && (
                    <ProgressBar
                        out={deleteContext.out}
                        of={deleteContext.of}
                        label={label}
                    />
                )}
                <AlertDialogFooter>
                    <Button
                        variant={'outline'}
                        onClick={(e) => onCancel(e, items)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={(e) => onDelete(e, items)}
                    >
                        <span className={isLoading ? 'invisible' : 'visible'}>
                            Continue
                        </span>
                        {isLoading ? (
                            <div className="absolute flex items-center justify-center">
                                <Loader size={'4'} />
                            </div>
                        ) : (
                            ''
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
