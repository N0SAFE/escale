import axios from 'axios'
import { redirect } from 'next/navigation'

type ReservationType = {
    id: number
}[]

const Reservation = async () => {
    // this page is a placeholder for the first spa reservation
    // console.log(axios.defaults.baseURL)
    const { data } = await axios<ReservationType>('/spas')
    redirect(`/reservation/${data?.[0]?.id}`)
}

export default Reservation
