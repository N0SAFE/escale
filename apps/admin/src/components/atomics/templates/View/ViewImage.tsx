import { Image } from '@/types/index'

type ViewImageProps<T extends Image> = {
    value: T
}

export default function ViewImage<T extends Image>({
    value,
}: ViewImageProps<T>) {
    return <div>{JSON.stringify(value)}</div>
}
