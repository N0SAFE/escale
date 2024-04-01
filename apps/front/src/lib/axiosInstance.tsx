import axios from 'axios'

// You need to be careful in next.js for adding cookies.
// You could be on the server or a client. This code will work for the client assuming you will use it on the client side.
// I believe you are using `parser` to get cookies. get the token.
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})
