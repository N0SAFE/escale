'use client'

// import Swiper core and required modules
import { Navigation, Pagination, A11y } from 'swiper/modules'

import { Swiper, SwiperSlide } from 'swiper/react'
import { AvatarImage, Avatar } from '@/components/ui/avatar'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './style.css'
import { createAttachmentUrl } from '@/hooks/useAttachmentUrl'
import { Comment as CommentType } from '@/types/model/Comment'

type Props = {
    comments: CommentType[]
}

export default function Comment({ comments }: Props) {
    return (
        <Swiper
            // install Swiper modules
            style={{
                marginTop: '24px',
                marginBottom: '24px',
                marginLeft: '5%',
                marginRight: '5%',
                paddingTop: '24px',
                paddingBottom: '24px',
                paddingLeft: '2%',
                paddingRight: '2%',
            }}
            breakpoints={{
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 24,
                },
                // when window width is >= 480px
                480: {
                    slidesPerView: 1,
                    spaceBetween: 24,
                },
                // when window width is >= 640px
                640: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 32,
                    slidesPerGroup: 1,
                },
            }}
            modules={[Navigation, A11y]}
            spaceBetween={50}
            slidesPerView={3}
            navigation
        >
            {comments.map((comment) => (
                <SwiperSlide
                    key={comment.id}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <div className="flex flex-col items-center text-center w-80">
                        <Avatar>
                            <AvatarImage
                                alt={'avatar of ' + comment?.user?.username}
                                src={
                                    createAttachmentUrl(
                                        comment?.user?.avatarId!,
                                        'image'
                                    )!
                                }
                            />
                        </Avatar>
                        <p className="mt-4 text-sm text-slate-200">
                            &quot;{comment?.text}&quot;
                        </p>
                        <p className="mt-2 font-semibold text-slate-300">
                            {comment?.user?.username}
                        </p>
                        <p className="text-xs text-slate-100">
                            {comment?.user?.address}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
