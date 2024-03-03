/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "picsum.photos",
      "fastly.picsum.photos",
      "so-spa.fr",
      "supermanager-img.s3.amazonaws.com",
      process.env.NEXT_PUBLIC_API_HOSTNAME,
    ],
  },
};

module.exports = nextConfig;
