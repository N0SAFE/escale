import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardCommentsIdEdit',
    params: z.object({
        id: z.string(),
    }),
}
