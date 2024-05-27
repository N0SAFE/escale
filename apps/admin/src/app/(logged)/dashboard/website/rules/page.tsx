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
import FaqWebsitePage from './Faq'
import { DType } from './type'
import { getFaqs } from '../actions'
import { v4 as uuid } from 'uuid'

export default async function Page() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            const faqs = await getFaqs()
            return faqs.map((faq) => ({
                uuid: uuid(),
                data: {
                    ...faq,
                },
                isEdited: false,
                isNew: false,
                isDeleted: false,
            })) as DType[]
        },
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FaqWebsitePage />
        </HydrationBoundary>
    )
}
