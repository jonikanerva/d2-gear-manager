import { bungieInventoryItemDefinition } from '../database'
import { BungieProfileResponse } from './bungieApi'
import { components } from './bungieTypes'

type BungieItemComponents = components['schemas']['DestinyItemComponentSetOfint64']
type BungieCharacter = components['schemas']['Destiny.Entities.Characters.DestinyCharacterComponent']

export interface Item {
  itemHash: number
  itemInstanceId: number
  storedAt: string
  equipped?: boolean
}

const isWeapon = (itemHash: number): boolean => {
  const item = bungieInventoryItemDefinition.get(itemHash)

  return item?.itemType === 3
}

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

const parseItems = (profile: BungieProfileResponse): Item[] => {
  const vaultItemsData = profile?.Response?.profileInventory?.data?.items || []
  const equippedItemsData = profile?.Response?.characterInventories?.data || {}
  const inventoryItemsData = profile?.Response?.characterEquipment?.data || {}

  const vaultItems = vaultItemsData.map(
    (item): Item => ({
      itemHash: item.itemHash || 0,
      itemInstanceId: item.itemInstanceId || 0,
      storedAt: '0',
    })
  )

  const equippedItems = Object.entries(equippedItemsData).flatMap(
    ([key, value]) =>
      value?.items?.map(
        (item): Item => ({
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
        (item): Item => ({
          itemHash: item.itemHash || 0,
          itemInstanceId: item.itemInstanceId || 0,
          storedAt: key,
        })
      ) || []
  )

  return [...vaultItems, ...equippedItems, ...inventoryItems]
}

export interface ItemInfo {
  itemHash: number
  itemInstanceId: number
  storedAt: string
  equipped?: boolean
  name: string
  damageType: number
  powerLevel: number
  stats: {
    statHash: number
    value: number
  }[]
  equippedPerks: number[]
  availablePerks: number[]
}

const prepareItems = (
  items: Item[],
  itemComponents: BungieItemComponents
): ItemInfo[] =>
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
      const weaponInfo = bungieInventoryItemDefinition.get(itemHash)

      // basic info for current random weapon
      const itemInfo =
        itemComponents?.instances?.data?.[`${itemInstanceId}`] || {}

      // calculated stats for the current random weapon (including perks)
      const itemStats = Object.values(
        itemComponents?.stats?.data?.[`${itemInstanceId}`]?.stats || {}
      ).map((item) => ({
        statHash: item.statHash || 0,
        value: item.value || 0,
      }))

      // all available perks for current random weapon
      const reusablePlugs = Object.values(
        itemComponents.reusablePlugs?.data?.[`${itemInstanceId}`]?.plugs || {}
      ).flatMap((value) => value.map(({ plugItemHash }) => plugItemHash || 0))

      // equipped perks for current random weapon
      const itemSockets =
        itemComponents?.sockets?.data?.[`${itemInstanceId}`]?.sockets
          ?.filter(
            (socket) =>
              socket.isVisible === true && socket.plugHash !== undefined
          )
          .map((item) => item.plugHash || 0) || []

      return {
        ...weapon,
        name: weaponInfo?.displayProperties?.name || '',
        damageType: itemInfo.damageType || 0,
        powerLevel: itemInfo.primaryStat?.value || 0,
        stats: itemStats,
        equippedPerks: itemSockets,
        availablePerks: reusablePlugs,
      }
    })

export interface Profile {
  characters: Character[]
  items: ItemInfo[]
}

export const parseProfile = (profile: BungieProfileResponse): Profile => {
  const characters = profile?.Response?.characters?.data || {}
  const itemComponents = profile?.Response?.itemComponents || {}
  const items = parseItems(profile)

  return {
    characters: parseCharacters(characters),
    items: prepareItems(items, itemComponents),
  }
}
