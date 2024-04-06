const PATH = ['/faq', '/contact', '/reglement', '/reservation']

export default async function sitemap() {
    return PATH.map((path) => ({
        url: process.env.NEXT_PUBLIC_FRONT_URL + path,
    }))
}
