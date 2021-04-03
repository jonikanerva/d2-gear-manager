import { bungieInventoryItemDefinition } from '../database'

export interface Perk {
  perkHash: number
  name: string
  icon: string
  type: string
  index: number
}

export const getPerk = (hash: number): Perk => {
  const perk = bungieInventoryItemDefinition.get(hash)

  return {
    perkHash: hash,
    name: perk?.displayProperties?.name || '',
    icon: perk?.displayProperties?.icon || '',
    type: perk?.itemTypeDisplayName || '',
    index: perk?.index || 0,
  }
}
