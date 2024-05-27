import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    useQuery,
} from '@tanstack/react-query'
import { getHomeDetails } from '@/actions/Home'
import { getComments } from '@/actions/Comment'
import { getImages } from '@/actions/Image'
import { getVideos } from '@/actions/Video'
import HomeWebsitePage from './Home'

export default async function Page() {
    const queryClient = new QueryClient()

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ['home'],
            queryFn: async () => getHomeDetails(),
        }),
        queryClient.prefetchQuery({
            queryKey: ['comments'],
            queryFn: async () => getComments(),
        }),
        queryClient.prefetchQuery({
            queryKey: ['images'],
            queryFn: async () => getImages(),
        }),
        queryClient.prefetchQuery({
            queryKey: ['videos'],
            queryFn: async () => getVideos(),
        }),
    ])

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <HomeWebsitePage />
        </HydrationBoundary>
    )
}
