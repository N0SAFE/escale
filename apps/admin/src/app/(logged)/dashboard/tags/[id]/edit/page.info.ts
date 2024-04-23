import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardTagsIdEdit',
    params: z.object({
        id: z.string(),
    }),
}
