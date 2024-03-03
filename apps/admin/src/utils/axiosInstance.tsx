import axios from "axios";
import { getSession, isLogin, refreshToken } from "@/lib/auth";
import { headers } from "next/headers";

// You need to be careful in next.js for adding cookies.
// You could be on the server or a client. This code will work for the client assuming you will use it on the client side.
// I believe you are using `parser` to get cookies. get the token.
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 1000,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.jwt?.token;
  const refreshToken = session?.jwt?.refreshToken;
  console.log(`Bearer ${token}`);
  console.log(`refresh_token ${refreshToken}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.refresh_token = refreshToken;
  }
  return config;
});

// if the request does not work with the token, try to use the refresh token to get a new token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error");
    console.log(error.response);
    // console.log(error.response.data)
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const session = await refreshToken(true);
      console.log("token as been refreshed");
      if (await isLogin(session!)) {
        const tokenType = session?.jwt?.type;
        const token = session?.jwt?.token;
        originalRequest.headers.Authorization = `${tokenType} ${token}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
