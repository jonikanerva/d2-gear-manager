import { bungieStatDefinition } from '../database'

export interface Stat {
  statHash: number
  name: string
  description: string
  category: number
  index: number
  value: number
}

export const getStat = (hash: number): Stat => {
  const stat = bungieStatDefinition.get(hash)

  return {
    statHash: hash,
    name: stat?.displayProperties?.name || '',
    description: stat?.displayProperties?.description || '',
    category: stat?.statCategory || 0,
    index: stat?.index || 0,
    value: 0,
  }
}
