export type SearchFilter = {
    search?: {
        [key: string]: string | number | boolean | undefined
    }
}

export type PropertyFilter = {
    property?: {
        [key: string]: string | number | boolean | undefined
    }
}

export type GroupsFilter = {
    groups?: string[] | undefined
}

export type DatesFilter = {
    dates?: {
        [key: string]: {
            after?: string | undefined
            before?: string | undefined
            strictly_after?: string | undefined
            strictly_before?: string | undefined
        }
    }
}

export type PaginationFilter = {
    page?: number
    limit?: number
}

export type OrderFilter = {
    order?: {
        [key: string]: 'asc' | 'desc'
    }
}
