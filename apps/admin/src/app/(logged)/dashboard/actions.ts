"use server";

import { Image, MutatedService } from "@/types/index";
import { axiosInstance } from "@/utils/axiosInstance";

export async function getImages() {
  "use server";

  try {
    const { data } = await axiosInstance.get<Image[]>(`/images`);
    return { data };
  } catch (error) {
    return { error };
  }
}
