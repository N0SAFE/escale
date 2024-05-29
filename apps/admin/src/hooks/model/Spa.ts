// import {
//     GroupsFilter,
//     PaginationFilter,
//     PropertyFilter,
//     SearchFilter,
// } from '@/types/filters'
// import { CreateSpa, Spa, UpdateSpa } from '@/types/model/Spa'
// import { SpaImage } from '@/types/model/SpaImage'
// import { Pretify } from '@/types/utils'
// import { xiorInstance } from '@/utils/xiorInstance'
// import {
//     DefaultError,
//     UseMutationOptions,
//     useQuery,
// } from '@tanstack/react-query'
// import {
//     filtersToParams,
//     MutationFnType,
//     useModelMutation,
//     useModelQuery,
// } from './index'
// import { Uuidable } from '@/types/index'

// export async function getSpas<G extends string[] = []>(
//     filters?: Pretify<
//         GroupsFilter<G> & SearchFilter & PropertyFilter & PaginationFilter
//     >
// ) {
//     const { data } = await xiorInstance
//         .get<Uuidable<Spa<Exclude<G, undefined>>>[]>('/spas', {
//             params: filtersToParams(filters),
//         })
//         .then(({ data, ...rest }) => ({
//             ...rest,
//             data: data.map((spa) => ({
//                 ...spa,
//                 id: spa.uuid,
//             })),
//         }))
//     return data
// }

// export async function getSpa(
//     id: number,
//     filters?: Pretify<
//         GroupsFilter & SearchFilter & PropertyFilter & PaginationFilter
//     >
// ) {
//     const { data } = await xiorInstance.get<Spa>(`/spas/${id}`, {
//         params: filtersToParams(filters),
//     })
//     return data
// }

// export async function getImagesBySpa<G extends string[] = []>(
//     id: number,
//     filters?: Pretify<
//         GroupsFilter<G> & SearchFilter & PropertyFilter & PaginationFilter
//     >
// ) {
//     const { data } = await xiorInstance
//         .get<Uuidable<SpaImage<Exclude<G, undefined>>>[]>(`/spas/${id}/images`, {
//             params: filtersToParams(filters),
//         })
//         .then(({ data, ...rest }) => ({
//             ...rest,
//             data: data.map((spa) => ({
//                 ...spa,
//                 id: spa.uuid,
//             })),
//         }))
//     return data
// }

// export async function createSpa({ spa }: { spa: CreateSpa }) {
//     const transformedData = {
//         title: spa.title,
//         description: spa.description,
//         location: spa.location,
//         googleMapsLink: spa.googleMapsLink,
//         spaImages:
//             spa.spaImages?.map((spaImage) => ({
//                 image: spaImage.image.id,
//                 order: spaImage.order,
//             })) || [],
//         services: spa.services?.map((service) => service.id) || [],
//     }
//     const { data } = await xiorInstance.post<Spa>('/spas', transformedData)
//     return data
// }

// export async function updateSpa({
//     id,
//     data,
// }: {
//     id: number
//     data?: UpdateSpa
// }) {
//     if (!data) {
//         return
//     }
//     const transformedData = {
//         title: data.title,
//         description: data.description,
//         location: data.location,
//         googleMapsLink: data.googleMapsLink,
//         spaImages:
//             data.spaImages?.map((spaImage) => ({
//                 image: spaImage.image.id,
//                 order: spaImage.order,
//             })) || [],
//         services: data.services?.map((service) => service.id) || [],
//     }
//     await xiorInstance.patch(`/spas/${id}`, transformedData)
// }

// export async function deleteSpa(id: number) {
//     await xiorInstance.delete(`/spas/${id}`)
// }

// export const useGetSpas = <
//     G extends string[] = [],
//     TError = DefaultError,
//     TData = unknown,
// >(
//     options?: Parameters<typeof useModelQuery>[3] & {
//         filters?: Pretify<
//             GroupsFilter<G> & SearchFilter & PropertyFilter & PaginationFilter
//         >
//     },
//     queryClient?: Parameters<typeof useQuery>[1]
// ) =>
//     useModelQuery(
//         ['spas'],
//         () => getSpas<G>(options?.filters),
//         { filters: options?.filters },
//         options,
//         queryClient
//     )

//     useGetSpa().data

// export const useGetSpa = <TError = DefaultError, TData = unknown>(
//     id: number,
//     options?: Parameters<typeof useModelQuery>[3] & {
//         filters?: Pretify<
//             GroupsFilter & SearchFilter & PropertyFilter & PaginationFilter
//         >
//     },
//     queryClient?: Parameters<typeof useQuery>[1]
// ) =>
//     useModelQuery<TError, TData>(
//         ['spa'],
//         () => getSpa(id, options?.filters) as TData,
//         { params: { id }, filters: options?.filters },
//         options,
//         queryClient
//     )

// export const useGetImagesBySpa = <
//     G extends string[] = [],
//     TError = DefaultError,
//     TData = unknown,
// >(
//     id: number,
//     options?: Parameters<typeof useModelQuery>[3] & {
//         filters?: Pretify<
//             GroupsFilter<G> & SearchFilter & PropertyFilter & PaginationFilter
//         >
//     },
//     queryClient?: Parameters<typeof useQuery>[1]
// ) =>
//     useModelQuery(
//         ['spasImage', id],
//         () => getImagesBySpa<G>(id, options?.filters),
//         { params: { id }, filters: options?.filters },
//         options,
//         queryClient
//     )

// export const useCreateSpa = <
//     TFn extends MutationFnType<
//         ReturnType<typeof createSpa>,
//         Parameters<typeof createSpa>[0]
//     >,
//     TData extends ReturnType<TFn>,
//     TError = unknown,
//     TVariables extends Parameters<TFn>[0] = Parameters<TFn>[0],
//     TContext = unknown,
// >(
//     options?: Omit<
//         UseMutationOptions<TData, TError, TVariables, TContext>,
//         'mutationFn'
//     >
// ) => useModelMutation((arg) => createSpa(arg), options)

// export const useUpdateSpa = <
//     TFn extends MutationFnType<
//         ReturnType<typeof updateSpa>,
//         Parameters<typeof updateSpa>[0]
//     >,
//     TData extends ReturnType<TFn>,
//     TError = unknown,
//     TVariables extends Parameters<TFn>[0] = Parameters<TFn>[0],
//     TContext = unknown,
// >(
//     options?: Omit<
//         UseMutationOptions<TData, TError, TVariables, TContext>,
//         'mutationFn'
//     >
// ) => useModelMutation((arg) => updateSpa(arg), options)

// export const useDeleteSpa = <
//     TFn extends MutationFnType<
//         ReturnType<typeof deleteSpa>,
//         Parameters<typeof deleteSpa>[0]
//     >,
//     TData extends ReturnType<TFn>,
//     TError = unknown,
//     TVariables extends Parameters<TFn>[0] = Parameters<TFn>[0],
//     TContext = unknown,
// >(
//     options?: Omit<
//         UseMutationOptions<TData, TError, TVariables, TContext>,
//         'mutationFn'
//     >
// ) => useModelMutation((arg) => deleteSpa(arg), options)
