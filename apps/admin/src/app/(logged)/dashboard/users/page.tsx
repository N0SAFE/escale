'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createUser, deleteUser, getUsers } from '@/actions/Users'
import { useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import { Progress } from '@/components/ui/progress'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CreateUser as CreateUserType } from '@/types/model/User'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Combobox from '@/components/atomics/molecules/Combobox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Reorder } from 'framer-motion'
import { getImages, getServices } from '../actions'
import ApiImage from '@/components/atomics/atoms/ApiImage'
import { Card } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useColumns } from './columns'
import { DataTable } from '@/components/atomics/organisms/DataTable'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import { DType } from './type'
import { usersAccessor } from './utils'
import ProgressBar from '@/components/atomics/atoms/ProgressBar'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'

export default function UsersTable() {
    const {
        data: users,
        isFetched,
        refetch,
    } = useQuery({
        queryKey: ['users'],
        queryFn: async () =>
            usersAccessor().then((users) =>
                users.map((u) => ({ ...u, uuid: u.id }))
            ) as Promise<DType[]>,
    })
    const userCreateMutation = useMutation({
        mutationFn: async (spa?: CreateUserType) => {
            return await createUser(spa!)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('user created')
            setIsCreateDialogOpen(false)
            await refetch()
        },
    })
    const userDeleteMutation = useMutation({
        mutationFn: async (id: number[]) => {
            let count = 0
            await Promise.all(
                id.map(async (i) => {
                    await deleteUser(i)
                    count++
                    setDeleteContext({
                        numberOfSelectedRows:
                            deleteContext?.numberOfSelectedRows!,
                        numberOfDeletedRows: count,
                    })
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('user deleted')
            setIsDeleteDialogOpen(false)
            await refetch()
        },
    })

    const tableRef = React.useRef<Table<DType>>(null)

    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [deleteContext, setDeleteContext] = React.useState<{
        numberOfSelectedRows: number
        numberOfDeletedRows: number
    }>()
    const [selectedUserToDelete, setSelectedUserToDelete] =
        React.useState<DType[]>()

    const columns = useColumns({
        onRowDelete: async (row) => {
            setDeleteContext({
                numberOfSelectedRows: 1,
                numberOfDeletedRows: 0,
            })
            setSelectedUserToDelete([row.original])
            setIsDeleteDialogOpen(true)
        },
        onMultipleRowDelete: async (rows) => {
            setDeleteContext({
                numberOfSelectedRows: rows.length,
                numberOfDeletedRows: 0,
            })
            setSelectedUserToDelete(rows.map((r) => r.original))
            setIsDeleteDialogOpen(true)
        },
        useLoaderOnRowDelete: true,
    })

    return (
        <div className="w-full h-full">
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <DeleteSpa
                        onDelete={() =>
                            userDeleteMutation.mutate(
                                selectedUserToDelete?.map((u) => u?.id)!
                            )
                        }
                        deleteContext={deleteContext}
                        isLoading={userDeleteMutation.isPending}
                        onCancel={() => setIsDeleteDialogOpen(false)}
                    />
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col gap-4 h-full">
                <DataTableProvider columns={columns} data={users ?? []}>
                    <div className="flex justify-end">
                        <div className="flex gap-2">
                            <DataTableViewOptions className="h-full" />
                            <Dialog
                                open={isCreateDialogOpen}
                                onOpenChange={setIsCreateDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline">+</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Create service
                                        </DialogTitle>
                                        <DialogDescription>
                                            create a new service and add it to
                                            the list
                                        </DialogDescription>
                                    </DialogHeader>
                                    <CreateSpa
                                        onSubmit={userCreateMutation.mutate}
                                        isLoading={userCreateMutation.isPending}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <DataTable
                        isLoading={!isFetched}
                        notFound="no spas found"
                    />
                    <DataTablePagination />
                </DataTableProvider>
            </div>
        </div>
    )
}

type DeleteImageProps = {
    isLoading?: boolean
    deleteContext?: {
        numberOfSelectedRows: number
        numberOfDeletedRows: number
    }
    onDelete?: () => void
    onCancel?: () => void
}

function DeleteSpa({
    isLoading,
    deleteContext,
    onDelete,
    onCancel,
}: DeleteImageProps) {
    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the image and remove the data associated from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            {isLoading && deleteContext && (
                <ProgressBar
                    out={deleteContext.numberOfDeletedRows}
                    of={deleteContext.numberOfSelectedRows}
                    label="users"
                />
            )}
            <AlertDialogFooter>
                <Button variant={'outline'} onClick={onCancel}>
                    Cancel
                </Button>
                <Button disabled={isLoading} onClick={onDelete}>
                    <span className={isLoading ? 'invisible' : 'visible'}>
                        Continue
                    </span>
                    {isLoading ? (
                        <div className="flex items-center justify-center absolute">
                            <Loader size={'4'} />
                        </div>
                    ) : (
                        ''
                    )}
                </Button>
            </AlertDialogFooter>
        </>
    )
}

type CreateUserProps = {
    isLoading?: boolean
    onSubmit?: (data?: CreateUserType) => void
}

function CreateSpa({ isLoading, onSubmit }: CreateUserProps) {
    const [userState, setUserState] = React.useState<CreateUserType>({
        email: '',
        password: '',
    })
    return (
        <div>
            <div className="grid gap-4 grid-cols-2">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Email
                    </Label>
                    <Input
                        id="title"
                        value={userState.email}
                        className="col-span-3"
                        onChange={(e) =>
                            setUserState({
                                ...userState,
                                email: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Password
                    </Label>
                    <Input
                        id="location"
                        value={userState.password}
                        className="col-span-3"
                        onChange={(e) =>
                            setUserState({
                                ...userState,
                                password: e.target.value,
                            })
                        }
                    />
                </div>
            </div>
            <DialogFooter>
                <Button
                    className="relative"
                    onClick={() => onSubmit?.(userState)}
                    disabled={isLoading}
                >
                    <span className={isLoading ? 'invisible' : 'visible'}>
                        Save change
                    </span>
                    {isLoading ? (
                        <div className="flex items-center justify-center absolute">
                            <Loader size={'4'} />
                        </div>
                    ) : (
                        ''
                    )}
                </Button>
            </DialogFooter>
        </div>
    )
}
