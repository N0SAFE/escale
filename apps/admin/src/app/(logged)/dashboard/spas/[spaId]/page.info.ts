import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardSpasId',
    params: z.object({
        spaId: z.number(),
    }),
}
