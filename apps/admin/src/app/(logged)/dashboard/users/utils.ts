import { getUsers } from '@/actions/Users'

export function usersAccessor() {
    return getUsers()
}
