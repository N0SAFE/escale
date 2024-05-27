import { Service } from '@/types/index'

type ViewServiceProps<T extends Service> = {
    value: T
}

export default function ViewService<T extends Service>({
    value,
}: ViewServiceProps<T>) {
    return <div>{JSON.stringify(value)}</div>
}
