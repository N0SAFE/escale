"use server";

import { Spa, SpaImage } from "@/types/index";
import { axiosInstance } from "@/utils/axiosInstance";

export async function getSpas() {
  "use server";

  try {
    // console.log(axiosInstance.defaults.baseURL)
    const { data } = await axiosInstance.get<Spa[]>("/spas");
    // console.log('data')
    // console.log(data)
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function getSpa(id: number) {
  "use server";

  try {
    const { data } = await axiosInstance.get<Spa>(`/spas/${id}`);
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function getImagesBySpa(id: number) {
  "use server";

  try {
    const { data } = await axiosInstance.get<SpaImage[]>(`/spas/${id}/images`);
    return { data };
  } catch (error) {
    return { error };
  }
}
