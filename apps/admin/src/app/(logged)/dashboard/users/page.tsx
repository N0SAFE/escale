'use server'

import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import Users from './Users'
import { usersAccessor } from './utils'

export default async function UserPage() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['users'],
        queryFn: () => usersAccessor(),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Users />
        </HydrationBoundary>
    )
}
