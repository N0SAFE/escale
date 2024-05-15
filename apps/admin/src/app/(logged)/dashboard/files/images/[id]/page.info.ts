import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardImagesId',
    params: z.object({
        id: z.string(),
    }),
}
