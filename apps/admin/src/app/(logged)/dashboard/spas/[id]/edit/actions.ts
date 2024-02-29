"use server"

import { axiosInstance } from "@/utils/axiosInstance"
import { File } from "buffer"
import { Spa } from "../../actions"

export async function addImages(spaId: number, formData: FormData) {
    "use server"
    
    console.log(spaId)
    console.log(Array.from(formData.entries()))
    console.log(formData.getAll('images'))
    console.log(formData.get('images') instanceof File)
    console.log(axiosInstance.defaults.baseURL)
    await axiosInstance.post(`/spas/${spaId}/images`, formData).catch(function(e){
        console.log(e)
        throw e
    })
//   return fetch(`/api/spas/${spaId}/images`, {
//     method: "POST",
//     body: formData,
//   });
}

export async function sortImages(spaId: number, sorted: { id: number; order: number }[]) {
    "use server"
    
    await axiosInstance.post(`/spas/${spaId}/images/sort`, {
        sorted
    }).catch(function(e){
        console.log(e)
        throw e
    })
}

export async function deleteImage(spaId: number, imageId: number) {
    "use server"
    
    await axiosInstance.delete(`/spas/${spaId}/images/${imageId}`).catch(function(e){
        console.log(`/spas/${spaId}/images/${imageId}`)
        console.log(e)
        console.log(e.response)
        console.log(e.response.data)
        throw e
    })
}

export type MutatedSpa = Partial<Omit<Spa, "id" | "spaImages">>

export async function setSpa(id: number, data?: MutatedSpa) {
    "use server"
    
    if (!data) {
        return
    }
    await axiosInstance.patch(`/spas/${id}`, data).catch(function(e) {
        console.log(e)
        throw e
    })
}