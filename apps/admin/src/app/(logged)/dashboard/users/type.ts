import { Uuidable } from '@/types/index'
import { usersAccessor } from './utils'

export type DType = Uuidable<Awaited<ReturnType<typeof usersAccessor>>[number]>
