import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardImagesIdEdit',
    params: z.object({
        id: z.string(),
    }),
}
