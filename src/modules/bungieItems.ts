import {
  bungieInventoryItemDefinition,
  bungieStatDefinition,
} from '../database'
import { BungieProfileResponse } from './bungieApi'
import { components } from './bungieTypes'

type BungieItemComponents = components['schemas']['DestinyItemComponentSetOfint64']
type BungieCharacter = components['schemas']['Destiny.Entities.Characters.DestinyCharacterComponent']

interface Character {
  characterId: number
  race: number
  class: number
  emblem: string
}

const parseCharacters = (
  characters: Record<string, BungieCharacter>
): Character[] =>
  Object.values(characters).map((value) => ({
    characterId: value.characterId || 0,
    race: value.raceType || 0,
    class: value.classType || 0,
    emblem: `https://www.bungie.net${value.emblemBackgroundPath}`,
  }))

export interface ItemHash {
  itemHash: number
  itemInstanceId: number
  storedAt: string
  equipped?: boolean
}

const parseItems = (profile: BungieProfileResponse): ItemHash[] => {
  const vaultItemsData = profile?.Response?.profileInventory?.data?.items || []
  const equippedItemsData = profile?.Response?.characterInventories?.data || {}
  const inventoryItemsData = profile?.Response?.characterEquipment?.data || {}

  const vaultItems = vaultItemsData.map(
    (item): ItemHash => ({
      itemHash: item.itemHash || 0,
      itemInstanceId: item.itemInstanceId || 0,
      storedAt: '0',
    })
  )

  const equippedItems = Object.entries(equippedItemsData).flatMap(
    ([key, value]) =>
      value?.items?.map(
        (item): ItemHash => ({
          itemHash: item.itemHash || 0,
          itemInstanceId: item.itemInstanceId || 0,
          storedAt: key,
          equipped: true,
        })
      ) || []
  )

  const inventoryItems = Object.entries(inventoryItemsData).flatMap(
    ([key, value]) =>
      value?.items?.map(
        (item): ItemHash => ({
          itemHash: item.itemHash || 0,
          itemInstanceId: item.itemInstanceId || 0,
          storedAt: key,
        })
      ) || []
  )

  return [...vaultItems, ...equippedItems, ...inventoryItems]
}

export interface Item {
  itemHash: number
  name: string
  icon: string
  type: number
  typeName: string
  tierType: number
  tierTypeName: string
  storedAt: string
  equipped?: boolean
  index: number
  damageType: number
  powerLevel: number
  stats: Stat[]
  equippedPerks: Perk[]
  availablePerks: Perk[]
}

const isWeapon = (itemHash: number): boolean => {
  const item = bungieInventoryItemDefinition.get(itemHash)

  return item?.itemType === 3
}

const prepareItems = (
  items: ItemHash[],
  itemComponents: BungieItemComponents
): Item[] =>
  items
    .filter(
      (item) =>
        item !== undefined &&
        item.itemHash !== 0 &&
        item.itemInstanceId !== 0 &&
        isWeapon(item.itemHash)
    )
    .map((weapon) => {
      const itemInstanceId = weapon.itemInstanceId
      const itemHash = weapon.itemHash
      const weaponInfo = getWeapon(itemHash)

      // basic info for current random weapon
      const itemInfo =
        itemComponents?.instances?.data?.[`${itemInstanceId}`] || {}

      // calculated stats for the current random weapon (including perks)
      const itemStats = Object.values(
        itemComponents?.stats?.data?.[`${itemInstanceId}`]?.stats || {}
      ).map(
        (item): Stat => ({
          ...getStat(item.statHash || 0),
          value: item.value || 0,
        })
      )

      // all available perks for current random weapon
      const reusablePlugs = Object.values(
        itemComponents.reusablePlugs?.data?.[`${itemInstanceId}`]?.plugs || {}
      ).flatMap((value) =>
        value.map(
          ({ plugItemHash }): Perk => ({ ...getPerk(plugItemHash || 0) })
        )
      )

      // equipped perks for current random weapon
      const itemSockets =
        itemComponents?.sockets?.data?.[`${itemInstanceId}`]?.sockets
          ?.filter(
            (socket) =>
              socket.isVisible === true && socket.plugHash !== undefined
          )
          .map(({ plugHash }): Perk => ({ ...getPerk(plugHash || 0) })) || []

      return {
        itemHash: weapon.itemHash,
        name: weaponInfo.name,
        icon: weaponInfo.icon,
        type: weaponInfo.type,
        typeName: weaponInfo.typeName,
        tierType: weaponInfo.tierType,
        tierTypeName: weaponInfo.tierTypeName,
        storedAt: weapon.storedAt,
        equipped: weapon.equipped,
        index: weaponInfo.index,
        damageType: itemInfo.damageType || 0,
        powerLevel: itemInfo.primaryStat?.value || 0,
        stats: itemStats,
        equippedPerks: itemSockets,
        availablePerks: reusablePlugs,
      }
    })

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

const getWeapon = (hash: number): Weapon => {
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

export interface Perk {
  perkHash: number
  name: string
  icon: string
  type: string
  index: number
}

const getPerk = (hash: number): Perk => {
  const perk = bungieInventoryItemDefinition.get(hash)

  return {
    perkHash: hash,
    name: perk?.displayProperties?.name || '',
    icon: perk?.displayProperties?.icon || '',
    type: perk?.itemTypeDisplayName || '',
    index: perk?.index || 0,
  }
}

export interface Stat {
  statHash: number
  name: string
  description: string
  category: number
  index: number
  value: number
}

const getStat = (hash: number): Stat => {
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

export interface Profile {
  characters: Character[]
  items: Item[]
}

export const parseProfile = (profile: BungieProfileResponse): Profile => {
  const characters = profile?.Response?.characters?.data || {}
  const itemComponents = profile?.Response?.itemComponents || {}
  const allItems = parseItems(profile)

  return {
    characters: parseCharacters(characters),
    items: prepareItems(allItems, itemComponents),
  }
}
