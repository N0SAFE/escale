"use server"

import { axiosInstance } from "@/utils/axiosInstance";

export type File = {
    id: number;
    uuid: string;
    name: string;
    extname: string;
    size: number;
    path: string;

}

export type Image = {
    id: number;
    alt: string;
    file: File;
}

export type Service = {
    id: number;
    label: string;
    description: string;
    image: Image;
}

export async function getServices() {
    "use server" 

    try {
        // console.log(axiosInstance.defaults.baseURL)
        const { data } = await axiosInstance.get<Service[]>("/services")
        // console.log('data')
        // console.log(data)
        return { data }
    } catch (error) {
        return {error}
    }
}

export async function getService(id: number) {
    "use server"

    try {
        const { data } = await axiosInstance.get<Service>(`/services/${id}`)
        return {data}
    }catch (error) {
        return {error}
    }
}