export const getItem = (id: string): unknown | null => {
  const item = window.localStorage.getItem(id)

  return item !== null ? JSON.parse(item) : null
}

export const setItem = (id: string, value: unknown): void =>
  window.localStorage.setItem(id, JSON.stringify(value))
