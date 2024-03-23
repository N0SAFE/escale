export * from './images/actions'
export * from './services/actions'
export * from './spas/actions'
import { getSpas } from './spas/actions'

export async function getFirstSpa() {
    return getSpas({
        page: 1,
        limit: 1,
    }).then(function (spas) {
        return spas?.[0]
    })
}
