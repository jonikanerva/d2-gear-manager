import { bungieInventoryItemDefinition } from '../database'

export interface Perk {
  perkHash: number
  name: string
  icon: string
  index: number
  category: string
  isEquipped: boolean
}

export interface PerkSet {
  category: string
  perks: Perk[]
}

export const getPerk = (hash: number): Perk => {
  const perk = bungieInventoryItemDefinition.get(hash)

  return {
    perkHash: hash,
    name: perk?.displayProperties?.name || '',
    icon: perk?.displayProperties?.icon || '',
    index: perk?.index || 0,
    category: perk?.plug?.plugCategoryIdentifier || '',
    isEquipped: false,
  }
}

export const preparePerks = (
  availablePerks: number[],
  equippedPerks: number[]
): PerkSet[] => {
  const perkSet = new Map<string, Perk[]>()
  const checkPerks = availablePerks.length > 0 ? availablePerks : equippedPerks

  checkPerks.forEach((hash) => {
    const perk = {
      ...getPerk(hash),
      isEquipped: equippedPerks.includes(hash),
    }
    const perks = perkSet.get(perk.category)
    const perkArray = perks ? [...perks, perk] : [perk]

    perkSet.set(perk.category, perkArray)
  })

  const perks = [...perkSet].map(([key, value]) => ({
    category: key,
    perks: value,
  }))

  return perks
}
