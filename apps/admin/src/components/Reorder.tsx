import { Reorder as R, useDragControls } from 'framer-motion'
import { useEffect, useState } from 'react'

type ReorderProps<T> = {
    onReorder: (items: T[]) => void
    items: T[]
    renderItem: (item: T, index: number) => React.ReactNode
}

export default function Reorder<T>({
    items,
    onReorder,
    renderItem,
}: ReorderProps<T>) {
    const handleReorder = (values: T[]) => {
        setItemsState(values)
        onReorder(values)
    }
    const dragControls = useDragControls()
    const [itemsState, setItemsState] = useState(items)

    useEffect(() => {
        console.log(items)
        setItemsState(items)
    }, [items])

    return (
        <R.Group values={itemsState} onReorder={handleReorder}>
            {itemsState.map((item, index) => (
                <R.Item dragControls={dragControls} value={item} key={index}>
                    <div
                        data-id={index}
                        onPointerDown={(e) => dragControls.start(e)}
                        style={{ cursor: 'grab' }}
                    >
                        {renderItem(item, index)}
                    </div>
                </R.Item>
            ))}
        </R.Group>
    )
}
