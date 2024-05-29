import {
    DefaultError,
    QueryKey,
    useMutation,
    useQuery,
} from '@tanstack/react-query'

export type UseQueryOptions<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
> = Parameters<typeof useQuery<TQueryFnData, TError, TData, TQueryKey>>[0]
export type UseMutationOptions<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown,
> = Parameters<typeof useMutation<TData, TError, TVariables, TContext>>[0]
