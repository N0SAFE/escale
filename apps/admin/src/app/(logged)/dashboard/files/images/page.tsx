import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { imagesAccessor } from './utils'
import Images from './Images'

export default async function UserPage() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['images'],
        queryFn: imagesAccessor,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Images />
        </HydrationBoundary>
    )
}
