import {
    DatesFilter,
    GroupsFilter,
    OrderFilter,
    PaginationFilter,
    PropertyFilter,
    SearchFilter,
} from '@/types/filters'
import {
    DefaultError,
    DefinedInitialDataOptions,
    QueryFunction,
    QueryKey,
    UndefinedInitialDataOptions,
    UseMutateFunction,
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQuery,
    UseQueryResult,
} from '@tanstack/react-query'
import { UseQueryOptions } from './type'

export function filtersToParams(
    filters?: GroupsFilter &
        PropertyFilter &
        SearchFilter &
        DatesFilter &
        PaginationFilter &
        OrderFilter
) {
    return {
        ...(filters?.search || {}),
        ...(filters?.dates || {}),
        ...(filters?.order || {}),
        limit: filters?.limit || undefined,
        page: filters?.page || undefined,
        groups: filters?.groups || [],
        property: filters?.property || {},
    }
}
export const useModelQuery = <TError = DefaultError, TData = unknown>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TData, QueryKey, QueryKey>,
    {
        filters,
        params,
    }: {
        filters?: GroupsFilter &
            PropertyFilter &
            SearchFilter &
            DatesFilter &
            PaginationFilter &
            OrderFilter
        params?: any
    } = {},
    options?:
        | Omit<
              UseQueryOptions<TData, TError, TData, QueryKey>,
              'queryKey' | 'queryFn'
          >
        | UndefinedInitialDataOptions<TData, TError, TData, QueryKey>
        | DefinedInitialDataOptions<TData, TError, TData, QueryKey>,
    queryClient?: Parameters<typeof useQuery>[1]
): UseQueryResult<TData, TError> => {
    const finalQueryKey: QueryKey = [...queryKey, { filters, params }]

    return useQuery<TData, TError, TData, QueryKey>(
        {
            queryKey: finalQueryKey,
            queryFn: queryFn,
            ...options,
        },
        queryClient
    )
}

export type MutationFnType<TData, TVariables> = (
    variables: TVariables
) => Promise<TData>

export const useModelMutation = <
    TData,
    TError = unknown,
    TVariables = void,
    TContext = unknown,
>(
    mutationFn: UseMutateFunction<TData, TError, TVariables, TContext>,
    options?: Omit<
        UseMutationOptions<TData, TError, TVariables, TContext>,
        'mutationFn'
    >
): UseMutationResult<TData, TError, TVariables, TContext> => {
    return useMutation<TData, TError, TVariables, TContext>({
        mutationFn: mutationFn as unknown as MutationFnType<TData, TVariables>,
        ...options,
    })
}
