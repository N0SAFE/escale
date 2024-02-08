/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'picsum.photos', 'fastly.picsum.photos', 'so-spa.fr', 'supermanager-img.s3.amazonaws.com'],
    },
}

module.exports = nextConfig
