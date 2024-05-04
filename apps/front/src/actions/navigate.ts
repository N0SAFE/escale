'use server'

import { redirect } from 'next/navigation'

export const navigate: typeof redirect = (...args) => {
    redirect(...args)
}
