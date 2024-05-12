import { getUser } from '@/actions/Users'
import { Route } from './page.info'
import { z } from 'zod'

export default async function UserView({
    params,
}: {
    params: z.output<typeof Route.params>
}) {
    const user = await getUser(+params.userId)
    return <div>{JSON.stringify(user)}</div>
}
