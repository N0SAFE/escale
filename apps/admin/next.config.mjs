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

export default nextConfig
