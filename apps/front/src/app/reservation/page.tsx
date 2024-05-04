import { axiosInstance } from '@/lib/axiosInstance'
import { redirect } from 'next/navigation'

type ReservationType = {
    id: number
}[]

const Reservation = async () => {
    // this page is a placeholder for the first spa reservation
    const { data } = await axiosInstance<ReservationType>('/spas')
    redirect(`/reservation/${data?.[0]?.id}`)
}

export default Reservation
