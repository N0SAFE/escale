import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardTagsId',
    params: z.object({
        id: z.string(),
    }),
}
