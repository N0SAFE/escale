import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { servicesAccessor } from './utils'
import Services from './Services'

export default async function UserPage() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['services'],
        queryFn: servicesAccessor,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Services />
        </HydrationBoundary>
    )
}
