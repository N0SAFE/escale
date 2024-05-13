'use client'

import { getHomeDetails } from '@/actions/home/index'
import ApiImage from '@/components/ApiImage'
import ApiVideo from '@/components/ApiVideo'
import Comment from '@/components/Comment'
import Loader from '@/components/Loader/index'
import { createAttachmentUrl } from '@/hooks/useAttachmentUrl'
import HomeRelations from '@/types/model/Home'
import { useQuery } from '@tanstack/react-query'
import 'react-multi-carousel/lib/styles.css'

export default function Home() {
    const {
        data: homeData,
        error,
        isFetching,
    } = useQuery({
        queryFn: async () => {
            return await getHomeDetails<
                [HomeRelations.image, HomeRelations.commentBackgroundImage]
            >()
        },
        queryKey: ['home'],
    })

    if (isFetching) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Loader />
            </div>
        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between text-white">
            <section>
                <ApiImage
                    identifier={homeData?.imageId!}
                    className="object-cover h-[600px]"
                    alt={homeData?.image?.alt!}
                    height={1080}
                    width={1980}
                />
            </section>
            <section className="py-24 px-4 text-3xl leading-6 text-center md:p-24">
                <p>{homeData?.description}</p>
            </section>
            <section className="max-w-[60%] my-8">
                <ApiVideo
                    sourcesIdentifier={
                        homeData?.video?.sources?.map((s) => s.id)!
                    }
                    alt={homeData?.video?.alt!}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controlsList="nodownload"
                />
            </section>

            <section></section>
            <section
                style={{
                    backgroundImage: `url('${createAttachmentUrl(
                        homeData?.commentBackgroundImageId!,
                        'image'
                    )}')`,
                }}
                className="bg-cover bg-no-reapeat bg-center w-full background-color-[#27355DED] backdrop-filter-blur-[30px] relative"
            >
                <div className="h-full w-full opacity-75 bg-[#525252ED] absolute"></div>
                <Comment
                    comments={
                        homeData?.homeComments?.map((hc) => {
                            return hc.comment
                        }) || []
                    }
                />
            </section>
        </main>
    )
}
