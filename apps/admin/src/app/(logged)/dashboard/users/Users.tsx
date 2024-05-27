'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createUser, deleteUser, getUsers, updateUser } from '@/actions/Users'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import Loader from '@/components/atomics/atoms/Loader'
import {
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CreateUser as CreateUserType, UpdateUser } from '@/types/model/User'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ColumnOptions, useColumns } from './columns'
import { DataTable } from '@/components/atomics/organisms/DataTable'
import { DataTableViewOptions } from '@/components/atomics/organisms/DataTable/DataTableViewOptions'
import { usersAccessor, DType } from './utils'
import ProgressBar from '@/components/atomics/atoms/ProgressBar'
import { DataTablePagination } from '@/components/atomics/organisms/DataTable/DataTablePagination'
import { DataTableProvider } from '@/components/atomics/organisms/DataTable/DataTableContext'
import useTableHooks from '@/hooks/useTableHooks'
import CreateDialog from '@/components/atomics/templates/CreateDialog'
import useTableRef from '@/hooks/useTableRef'
import ViewSheet from '@/components/atomics/templates/ViewSheet'
import EditSheet from '@/components/atomics/templates/EditSheet'
import DeleteDialog from '@/components/atomics/templates/DeleteDialog'
import ViewUser from '@/components/atomics/templates/View/ViewUser'
import EditUser from '@/components/atomics/templates/Edit/EditUser'
import { CreateUser } from '@/components/atomics/templates/Create/CreateUser'
import { functionalUpdate, PaginationState } from '@tanstack/react-table'
import { parseAsInteger, parseAsJson, useQueryState } from 'nuqs'

export default function Users() {
    // const [pagination, setPagination] = useQueryState(
    //     'p',
    //     parseAsJson<PaginationState>().withDefault({
    //         pageIndex: 0,
    //         pageSize: 10,
    //     } as PaginationState)
    // ) @flag server-side-pagination
    const {
        data: users,
        isFetched,
        isPlaceholderData,
        refetch,
    } = useQuery({
        // placeholderData: keepPreviousData, @flag server-side-pagination ['users', pagination]
        queryKey: ['users'], // @flag server-side-pagination ['users', pagination]
        queryFn: () =>
            usersAccessor({
                // page: pagination.pageIndex + 1, @flag server-side-pagination
                // limit: pagination.pageSize,
            }),
    })

    console.log(isFetched)

    console.log(users)

    const userCreateMutation = useMutation({
        mutationFn: async (spa?: CreateUserType) => {
            return await createUser(spa!)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('user created')
            tableRef.current?.resetRowSelection()
            setIsCreateDialogOpen(false)
            await refetch()
        },
    })
    const userEditMutation = useMutation({
        mutationFn: async ({
            updatedUser,
            id,
        }: {
            updatedUser: UpdateUser
            id: number
        }) => {
            return await updateUser(id, updatedUser)
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('user updated')
            await refetch()
        },
    })
    const userDeleteMutation = useMutation({
        mutationFn: async (users: DType[]) => {
            let count = 0
            setDeleteContext({
                of: users.length,
                out: 0,
            })
            await Promise.all(
                users.map(async (u) => {
                    await deleteUser(u.id)
                    count++
                    setDeleteContext({
                        of: users.length,
                        out: count,
                    })
                })
            )
        },
        onError: (error) => {
            toast.error('server error')
        },
        onSuccess: async (data) => {
            toast.success('user deleted')
            tableRef.current?.resetRowSelection()
            setIsDeleteDialogOpen(false)
            setIsEditSheetOpen(false)
            await refetch()
        },
    })

    const tableRef = useTableRef<DType>()

    const {
        deleteContext,
        isCreateDialogOpen,
        isDeleteDialogOpen,
        isEditSheetOpen,
        isViewSheetOpen,
        selectedToDelete,
        selectedToEdit,
        selectedToView,
        setDeleteContext,
        setIsCreateDialogOpen,
        setIsDeleteDialogOpen,
        setIsEditSheetOpen,
        setIsViewSheetOpen,
        triggerToDelete,
        triggerToEdit,
        triggerToView,
    } = useTableHooks<DType>()

    const columnsOptions: ColumnOptions = {
        onRowDelete: triggerToDelete,
        onRowEdit: triggerToEdit,
        onRowView: triggerToView,
    }

    const columns = useColumns(columnsOptions)

    console.log(users)

    return (
        <div className="h-full w-full overflow-hidden">
            <div className="flex h-full flex-col gap-4">
                <DataTableProvider
                    columns={columns}
                    data={users ?? []}
                    tableRef={tableRef}
                    // tableOptions={{ // @flag server-side-pagination
                    //     manualPagination: true,
                    //     rowCount: context?.paginator?.total,
                    //     state: {
                    //         pagination: pagination,
                    //     },
                    //     onPaginationChange: async (udpater) => {
                    //         setPagination((last) =>
                    //             functionalUpdate(udpater, last)
                    //         )
                    //     },
                    // }}
                >
                    <div className="flex justify-end">
                        <div className="flex gap-2">
                            <DataTableViewOptions className="h-full" />
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        isLoading={!isFetched && !isPlaceholderData}
                        isLoadingMore={isPlaceholderData}
                        notFound="no spas found"
                    />
                    <DataTablePagination />
                </DataTableProvider>
                <CreateDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <CreateUser
                        isLoading={userCreateMutation.isPending}
                        onCreate={(data) => userCreateMutation.mutate(data)}
                    />
                </CreateDialog>
                <ViewSheet
                    open={isViewSheetOpen}
                    onOpenChange={setIsViewSheetOpen}
                    items={selectedToView ?? []}
                    isLoading={false}
                    label={(item) => `View ${item?.email}`}
                >
                    {(item) => {
                        return <ViewUser value={item} />
                    }}
                </ViewSheet>
                <EditSheet
                    open={isEditSheetOpen}
                    onOpenChange={setIsEditSheetOpen}
                    items={selectedToEdit ?? []}
                    isLoading={false}
                    label={(item) => `Edit ${item?.email}`}
                >
                    {(item) => {
                        return (
                            <EditUser
                                defaultValue={item}
                                isUpdating={userEditMutation.isPending}
                                onEdit={(updatedUser) =>
                                    userEditMutation.mutate({
                                        id: item.id,
                                        updatedUser,
                                    })
                                }
                                onDelete={async (image) =>
                                    await triggerToDelete([image])
                                }
                            />
                        )
                    }}
                </EditSheet>
                <DeleteDialog
                    items={selectedToDelete! || []}
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onDelete={async (e, items) => {
                        await userDeleteMutation.mutateAsync(items!)
                        setIsEditSheetOpen(false)
                    }}
                    deleteContext={deleteContext}
                    isLoading={userDeleteMutation.isPending}
                    onCancel={(e, items) => setIsDeleteDialogOpen(false)}
                />
            </div>
        </div>
    )
}
