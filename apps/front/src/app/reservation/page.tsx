import { xiorInstance } from '@/utils/xiorInstance'
import { redirect } from 'next/navigation'

type ReservationType = {
    id: number
}[]

const Reservation = async () => {
    // this page is a placeholder for the first spa reservation
    const { data } = await xiorInstance.get<ReservationType>('/spas')
    redirect(`/reservation/${data?.[0]?.id}`)
}

export default Reservation
