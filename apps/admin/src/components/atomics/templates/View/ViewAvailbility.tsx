import { Availability } from '@/types/model/Availability'

type ViewAvailabilityProps<T extends Availability> = {
    value: T
}

export default function ViewAvailability<T extends Availability>({
    value,
}: ViewAvailabilityProps<T>) {
    return <div>{JSON.stringify(value)}</div>
}
