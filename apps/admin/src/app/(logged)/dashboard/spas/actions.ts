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

export type SpaImage = {
    id: number;
    order: number;
    image: Image
}

export type Spa = {
    id: number;
    title: string;
    description: string;
    location: number;
    google_maps_link: string;
    spaImages: SpaImage[]
};

export async function getSpas() {
    "use server" 

    try {
        // console.log(axiosInstance.defaults.baseURL)
        const { data } = await axiosInstance.get<Spa[]>("/spas")
        // console.log('data')
        // console.log(data)
        return { data }
    } catch (error) {
        return {error}
    }
}

export async function getSpa(id: number) {
    "use server"

    try {
        const { data } = await axiosInstance.get<Spa>(`/spas/${id}`)
        return {data}
    }catch (error) {
        return {error}
    }
}

export async function getImagesBySpa(id: number) {
    "use server"

    try {
        const { data } = await axiosInstance.get<SpaImage[]>(`/spas/${id}/images`)
        return {data}
    }catch (error) {
        return {error}
    }
}