'use client'

// import Swiper core and required modules
import { Navigation, Pagination, A11y } from 'swiper/modules'

import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './style.css'

type Props = {
    images: string[]
}

export default function ImageCarousel({ images }: Props) {
    return (
        <Swiper
            className="select-none"
            // install Swiper modules
            style={{
                margin: '0',
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
                    slidesPerView: 1,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                    slidesPerGroup: 1,
                },
            }}
            modules={[Navigation, A11y]}
            spaceBetween={50}
            slidesPerView={3}
            navigation
            onSwiper={(swiper) => console.log(swiper)}
        >
            {images.map((image, index) => (
                <SwiperSlide
                    key={index}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Image
                        src={image}
                        alt="carousel image"
                        style={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                        }}
                        height={1080}
                        width={1920}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
