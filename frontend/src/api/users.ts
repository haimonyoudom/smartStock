import { http } from './http'
import type { User } from '../types'

export const usersApi = {
  list: () => http<User[]>('/users'),
  get: (id: string) => http<User>(`/users/${id}`),
}
