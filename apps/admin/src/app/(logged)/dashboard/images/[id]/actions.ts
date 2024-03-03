"use server";

import { MutatedImage } from "@/types/index";
import { axiosInstance } from "@/utils/axiosInstance";

export async function updateImage(id: number, data?: MutatedImage) {
  "use server";

  if (!data) {
    return;
  }
  const transformedData = {
    alt: data.alt,
    name: data.name,
  };
  await axiosInstance
    .patch(`/images/${id}`, transformedData)
    .catch(function (e) {
      console.log(e);
      throw e;
    });
}
