import { useState } from 'react'
import {
    SearchFilter,
    GroupsFilter,
    DatesFilter,
    PaginationFilter,
} from '../types/filters'

export type Filters = SearchFilter &
    GroupsFilter &
    DatesFilter &
    PaginationFilter

export default function useFilters(
    defaultFilter: SearchFilter &
        GroupsFilter &
        DatesFilter &
        PaginationFilter = {}
) {
    const [filters, setFilters] = useState<
        SearchFilter & GroupsFilter & DatesFilter & PaginationFilter
    >(defaultFilter)

    return [filters, setFilters] as const
}
