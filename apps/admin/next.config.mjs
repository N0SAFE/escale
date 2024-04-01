import MillionLint from '@million/lint'
import million from 'million/compiler'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'localhost',
            'picsum.photos',
            'fastly.picsum.photos',
            process.env.NEXT_PUBLIC_API_HOSTNAME,
        ],
    },
}

const millionConfig = {
    auto: { rsc: true },
    rsc: true,
}

export default MillionLint.next({ rsc: true })(
    million.next(nextConfig, millionConfig)
)

// export default million.next(nextConfig, millionConfig)
