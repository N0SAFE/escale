import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import Spas from './Spas'
import { spasAccessor } from './utils'

export default async function UserPage() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['spas'],
        queryFn: spasAccessor,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Spas />
        </HydrationBoundary>
    )
}
