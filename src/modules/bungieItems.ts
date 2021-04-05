import { bungieInventoryBucketDefinition } from '../database'
import { BungieProfileResponse } from './bungieApi'
import { Character, parseCharacters } from './bungieCharacter'
import { getPerk, Perk } from './bungiePerks'
import { getStat, Stat } from './bungieStats'
import { components } from './bungieTypes'
import { getWeapon, isWeapon } from './bungieWeapons'

type BungieItemComponents = components['schemas']['DestinyItemComponentSetOfint64']
type BungieProfileInventory = components['schemas']['SingleComponentResponseOfDestinyInventoryComponent']
type BungieCharacterInventories = components['schemas']['DictionaryComponentResponseOfint64AndDestinyInventoryComponent']
type BungieCharacterEquipment = components['schemas']['DictionaryComponentResponseOfint64AndDestinyInventoryComponent']

export interface ItemHash {
  itemHash: number
  itemInstanceId: number
  storedAt: string
  bucket: string
  equipped?: boolean
}

const parseVaultItems = (
  vaultItems: BungieProfileInventory | undefined
): ItemHash[] => {
  const vaultItemsData = vaultItems?.data?.items || []

  return vaultItemsData.map(
    (item): ItemHash => {
      const bucket = bungieInventoryBucketDefinition.get(item.bucketHash || 0)

      return {
        itemHash: item.itemHash || 0,
        itemInstanceId: item.itemInstanceId || 0,
        bucket: bucket?.displayProperties?.name || '',
        storedAt: '0',
      }
    }
  )
}

const parseEquippedItems = (
  equippedItems: BungieCharacterInventories | undefined
): ItemHash[] => {
  const equippedItemsData = equippedItems?.data || {}

  return Object.entries(equippedItemsData).flatMap(
    ([key, value]) =>
      value?.items?.map(
        (item): ItemHash => {
          const bucket = bungieInventoryBucketDefinition.get(
            item.bucketHash || 0
          )

          return {
            itemHash: item.itemHash || 0,
            itemInstanceId: item.itemInstanceId || 0,
            storedAt: key,
            bucket: bucket?.displayProperties?.name || '',
            equipped: true,
          }
        }
      ) || []
  )
}

const parseInventoryItemsData = (
  inventoryItems: BungieCharacterEquipment | undefined
): ItemHash[] => {
  const inventoryItemsData = inventoryItems?.data || {}

  return Object.entries(inventoryItemsData).flatMap(
    ([key, value]) =>
      value?.items?.map(
        (item): ItemHash => {
          const bucket = bungieInventoryBucketDefinition.get(
            item.bucketHash || 0
          )

          return {
            itemHash: item.itemHash || 0,
            itemInstanceId: item.itemInstanceId || 0,
            bucket: bucket?.displayProperties?.name || '',
            storedAt: key,
          }
        }
      ) || []
  )
}

export interface Item {
  itemHash: number
  itemInstanceId: number
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
  bucket: string
  stats: Stat[]
  equippedPerks: Perk[]
  availablePerks: Perk[]
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

      // equipped means in character inventory, if item is not in vault
      // and not "equipped" it means that it's actually equipped
      const isEquipped = weapon.storedAt !== '0' && weapon.equipped !== true

      return {
        itemHash: weapon.itemHash,
        itemInstanceId: weapon.itemInstanceId,
        name: weaponInfo.name,
        icon: weaponInfo.icon,
        type: weaponInfo.type,
        typeName: weaponInfo.typeName,
        tierType: weaponInfo.tierType,
        tierTypeName: weaponInfo.tierTypeName,
        storedAt: weapon.storedAt,
        equipped: isEquipped,
        index: weaponInfo.index,
        damageType: itemInfo.damageType || 0,
        powerLevel: itemInfo.primaryStat?.value || 0,
        bucket: weapon.bucket,
        stats: itemStats,
        equippedPerks: itemSockets,
        availablePerks: reusablePlugs,
      }
    })

export interface Profile {
  characters: Character[]
  items: Item[]
}

export const parseProfile = (profile: BungieProfileResponse): Profile => {
  const characters = profile?.Response?.characters?.data || {}
  const itemComponents = profile?.Response?.itemComponents || {}
  const profileInventory = profile?.Response?.profileInventory
  const characterInventories = profile?.Response?.characterInventories
  const characterEquipment = profile?.Response?.characterEquipment

  const vaultItems = parseVaultItems(profileInventory)
  const equippedItems = parseEquippedItems(characterInventories)
  const inventoryItems = parseInventoryItemsData(characterEquipment)
  const allItems = [...vaultItems, ...equippedItems, ...inventoryItems]

  return {
    characters: parseCharacters(characters),
    items: prepareItems(allItems, itemComponents),
  }
}
