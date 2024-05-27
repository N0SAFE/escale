import { Reservation } from '@/types/model/Reservation'

type ViewReservationProps<T extends Reservation> = {
    value: T
}

export default function ViewReservation<T extends Reservation>({
    value,
}: ViewReservationProps<T>) {
    return <div>{JSON.stringify(value)}</div>
}
