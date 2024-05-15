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
                HomeRelations.commentBackgroundImage
            ]
        >
    >('/home', { cache: 'no-store' })
    return (
        <main className="flex min-h-screen flex-col items-center justify-between text-white">
            <section>
                <ApiImage
                    path={homeData?.image?.path!}
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
