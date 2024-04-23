import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardSpasIdEdit',
    params: z.object({
        spaId: z.number(),
    }),
}
