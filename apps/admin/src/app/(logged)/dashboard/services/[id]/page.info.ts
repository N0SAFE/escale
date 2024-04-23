import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardServicesId',
    params: z.object({
        id: z.string(),
    }),
}
