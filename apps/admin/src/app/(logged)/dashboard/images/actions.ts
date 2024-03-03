"use server";

import { Image } from "@/types/index";
import { axiosInstance } from "@/utils/axiosInstance";

export async function getImages() {
  "use server";

  try {
    // console.log(axiosInstance.defaults.baseURL)
    const { data } = await axiosInstance.get<Image[]>("/images");
    // console.log('data')
    // console.log(data)
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function getImage(id: number) {
  "use server";

  try {
    const { data } = await axiosInstance.get<Image>(`/images/${id}`);
    return { data };
  } catch (error) {
    return { error };
  }
}
