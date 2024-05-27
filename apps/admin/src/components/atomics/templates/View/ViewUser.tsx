import { User } from '@/types/model/User'

type ViewUserProps<T extends User> = {
    value: T
}

export default function ViewUser<T extends User>({ value }: ViewUserProps<T>) {
    return <div>{JSON.stringify(value)}</div>
}
