import { bungieInventoryItemDefinition } from '../database'

export interface Weapon {
  itemHash: number
  name: string
  icon: string
  type: number
  typeName: string
  tierType: number
  tierTypeName: string
  index: number
}

export const getWeapon = (hash: number): Weapon => {
  const weapon = bungieInventoryItemDefinition.get(hash)

  return {
    itemHash: hash,
    name: weapon?.displayProperties?.name || '',
    icon: weapon?.displayProperties?.icon || '',
    type: weapon?.itemType || 0,
    typeName: weapon?.itemTypeDisplayName || '',
    tierType: weapon?.inventory?.tierType || 0,
    tierTypeName: weapon?.inventory?.tierTypeName || '',
    index: weapon?.index || 0,
  }
}

export const isWeapon = (itemHash: number): boolean => {
  const item = bungieInventoryItemDefinition.get(itemHash)

  return item?.itemType === 3
}
