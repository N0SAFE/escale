import { Spa, Uuidable } from '@/types/index'
import { spasAccessor } from './utils'

export type DType = Uuidable<Awaited<ReturnType<typeof spasAccessor>>[number]>
