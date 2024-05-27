import { getHomeDetails } from '@/actions/home/index'
import ApiImage from '@/components/ApiImage'
import ApiVideo from '@/components/ApiVideo'
import Comment from '@/components/Comment'
import Loader from '@/components/Loader/index'
import { createAttachmentUrl } from '@/hooks/useAttachmentUrl'
import HomeRelations, { Home as HomeType } from '@/types/model/Home'
import { useQuery } from '@tanstack/react-query'
import 'react-multi-carousel/lib/styles.css'
import VideoRelations from '@/types/model/Video'
import { xiorInstance } from '@/utils/xiorInstance'

export default async function Home() {
    const { data: homeData } = await xiorInstance.get<
        HomeType<
            [
                HomeRelations.homeComments,
                HomeRelations.video,
                VideoRelations.sources,
                HomeRelations.image,
                HomeRelations.commentBackgroundImage,
            ]
        >
    >('/home', { cache: 'no-store' })
    return (
        <main className="flex min-h-screen flex-col items-center justify-between text-white">
            <section>
                <ApiImage
                    path={homeData?.image?.path!}
                    className="h-[600px] object-cover"
                    alt={homeData?.image?.alt!}
                    height={1080}
                    width={1980}
                />
            </section>
            <section className="px-4 py-24 text-center text-3xl leading-6 md:p-24">
                <p>{homeData?.description}</p>
            </section>
            <section className="my-8 max-w-[60%]">
                <ApiVideo
                    sourcesPath={homeData?.video?.sources?.map((s) => s.path)!}
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
                        homeData?.commentBackgroundImage.path!
                    )}')`,
                }}
                className="bg-no-reapeat background-color-[#27355DED] backdrop-filter-blur-[30px] relative w-full bg-cover bg-center"
            >
                <div className="absolute h-full w-full bg-[#525252ED] opacity-75"></div>
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
