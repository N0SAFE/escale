import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardUsersId',
    params: z.object({
        userId: z.string(),
    }),
}
