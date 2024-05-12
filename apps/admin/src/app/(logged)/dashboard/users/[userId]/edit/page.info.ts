import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardUsersIdEdit',
    params: z.object({
        userId: z.string(),
    }),
}
