import { AuthResponse } from '../server/controllers/getAuth'

const storageKey = 'donutGearManager'

export const getAuth = (): AuthResponse | null => {
  const item = window.localStorage.getItem(storageKey)

  return item !== null ? JSON.parse(item) : null
}

export const setAuth = (value: AuthResponse): void =>
  window.localStorage.setItem(storageKey, JSON.stringify(value))
