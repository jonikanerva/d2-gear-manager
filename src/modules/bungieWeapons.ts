import {
  bungieEquipmentSlotDefinition,
  bungieInventoryItemDefinition,
} from '../database'

export interface Weapon {
  itemHash: number
  name: string
  icon: string
  type: number
  typeName: string
  tierType: number
  tierTypeName: string
  ammoType: string
  equipmentSlot: string
  index: number
}

const getAmmoType = (type: number): string => {
  if (type === 1) {
    return 'Kinetic'
  } else if (type === 2) {
    return 'Special'
  } else if (type === 3) {
    return 'Heavy'
  } else {
    return 'Unkown'
  }
}

export const getWeapon = (hash: number): Weapon => {
  const weapon = bungieInventoryItemDefinition.get(hash)
  const slot = bungieEquipmentSlotDefinition.get(
    weapon?.equippingBlock?.equipmentSlotTypeHash || 0
  )
  const ammoType = getAmmoType(weapon?.equippingBlock?.ammoType || 0)

  return {
    itemHash: hash,
    name: weapon?.displayProperties?.name || '',
    icon: weapon?.displayProperties?.icon || '',
    type: weapon?.itemType || 0,
    typeName: weapon?.itemTypeDisplayName || '',
    tierType: weapon?.inventory?.tierType || 0,
    tierTypeName: weapon?.inventory?.tierTypeName || '',
    ammoType: ammoType,
    equipmentSlot: slot?.displayProperties?.name || '',
    index: weapon?.index || 0,
  }
}

export const isWeapon = (itemHash: number): boolean => {
  const item = bungieInventoryItemDefinition.get(itemHash)

  return item?.itemType === 3
}
