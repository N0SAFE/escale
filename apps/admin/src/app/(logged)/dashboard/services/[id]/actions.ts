"use server"

import { axiosInstance } from "@/utils/axiosInstance"
import { Service } from "../actions"

export type MutatedService = Partial<Omit<Service, "id">>

export async function updateService(id: number, data?: MutatedService) {
    "use server"
    
    if (!data) {
        return
    }
    await axiosInstance.patch(`/services/${id}`, data).catch(function(e) {
        console.log(e)
        throw e
    })
}