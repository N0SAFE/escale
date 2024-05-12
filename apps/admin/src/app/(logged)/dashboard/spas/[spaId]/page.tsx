import { z } from 'zod'
import { Route } from './page.info'

export default async function SpaDetails({
    params,
}: {
    params: z.output<typeof Route.params>
}) {
    return (
        <iframe
            className="rounded-2xl"
            src={
                process.env.NEXT_PUBLIC_FRONT_URL +
                '/reservation/' +
                params.spaId
            }
            width="100%"
            height="100%"
            allowFullScreen
        ></iframe>
    )
}
