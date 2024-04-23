import { z } from 'zod'

export const Route = {
    name: 'LoggedDashboardRulesIdEdit',
    params: z.object({
        id: z.string(),
    }),
}
