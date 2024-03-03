"use server";

import { Service } from "@/types/index";
import { axiosInstance } from "@/utils/axiosInstance";

export async function getServices() {
  "use server";

  try {
    // console.log(axiosInstance.defaults.baseURL)
    const { data } = await axiosInstance.get<Service[]>("/services");
    // console.log('data')
    // console.log(data)
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function getService(id: number) {
  "use server";

  try {
    const { data } = await axiosInstance.get<Service>(`/services/${id}`);
    return { data };
  } catch (error) {
    return { error };
  }
}
