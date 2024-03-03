"use server";

import { MutatedSpa, Spa } from "@/types/index";
import { axiosInstance } from "@/utils/axiosInstance";
import { File } from "buffer";

// export async function addImages(spaId: number, formData: FormData) {
//     "use server"

//     console.log(spaId)
//     console.log(Array.from(formData.entries()))
//     console.log(formData.getAll('images'))
//     console.log(formData.get('images') instanceof File)
//     console.log(axiosInstance.defaults.baseURL)
//     await axiosInstance.post(`/spas/${spaId}/images`, formData).catch(function(e){
//         console.log(e)
//         throw e
//     })
// //   return fetch(`/api/spas/${spaId}/images`, {
// //     method: "POST",
// //     body: formData,
// //   });
// }

// export async function sortImages(spaId: number, sorted: { id: number; order: number }[]) {
//     "use server"

//     await axiosInstance.post(`/spas/${spaId}/images/sort`, {
//         sorted
//     }).catch(function(e){
//         console.log(e)
//         throw e
//     })
// }

// export async function deleteImage(spaId: number, imageId: number) {
//     "use server"

//     await axiosInstance.delete(`/spas/${spaId}/images/${imageId}`).catch(function(e){
//         console.log(`/spas/${spaId}/images/${imageId}`)
//         console.log(e)
//         console.log(e.response)
//         console.log(e.response.data)
//         throw e
//     })
// }

export async function updateSpa(id: number, data?: MutatedSpa) {
  "use server";

  if (!data) {
    return;
  }
  const transformedData = {
    title: data.title,
    description: data.description,
    location: data.location,
    google_maps_link: data.google_maps_link,
    spaImages:
      data.spaImages?.map((spaImage) => ({
        image: spaImage.image.id,
        order: spaImage.order,
      })) || [],
  };
  await axiosInstance.patch(`/spas/${id}`, transformedData).catch(function (e) {
    console.log(e);
    throw e;
  });
}
