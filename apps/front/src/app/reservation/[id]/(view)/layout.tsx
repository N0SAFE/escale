import { Suspense } from 'react'
import Loader from '@/components/Loader'
import { Separator } from '@/components/ui/separator'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { getSpa } from './actions'

export default async function layout({
    children,
    params,
}: React.PropsWithChildren<{ params: { id: string } }>) {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['spa', params.id],
        queryFn: async () => {
            const { data } = await getSpa(Number(+params.id))
            return data
        },
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <main className="flex grow flex-col">
                <section className="bg-[url('/canap.jpg')] bg-center">
                    <div className="flex flex-col items-center justify-center p-36 font-bold italic text-slate-50">
                        <div className="w-fit gap-2">
                            <h1 className="w-fit font-allura text-7xl">
                                Réservations
                            </h1>
                            <Separator className="h-[2px]" />
                        </div>
                    </div>
                </section>
                <section className="flex grow">
                    <Suspense
                        fallback={
                            <div className="flex w-full grow items-center justify-center">
                                <Loader />
                            </div>
                        }
                    >
                        <div className="w-[-webkit-fill-available]">
                            {children}
                        </div>
                    </Suspense>
                </section>
            </main>
        </HydrationBoundary>
    )
}
