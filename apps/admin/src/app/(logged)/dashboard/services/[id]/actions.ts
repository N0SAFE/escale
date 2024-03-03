"use server";

import { MutatedService } from "@/types/index";
import { axiosInstance } from "@/utils/axiosInstance";

export async function updateService(id: number, data?: MutatedService) {
  "use server";

  if (!data) {
    return;
  }
  const transformedData = {
    label: data.label,
    description: data.description,
    image: data.image?.id,
  };
  await axiosInstance
    .patch(`/services/${id}`, transformedData)
    .catch(function (e) {
      console.log(e);
      throw e;
    });
}
