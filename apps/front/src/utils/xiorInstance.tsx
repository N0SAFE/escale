import xior from 'xior'

export const xiorInstance = xior.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})
