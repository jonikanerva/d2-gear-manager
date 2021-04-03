import {
  bungieInventoryItemDefinition,
  BungieInventoryItemDefinition,
  bungiePlugSetDefinition,
  bungieSocketCategoryDefinition,
  bungieSocketTypeDefinition,
  bungieStatDefinition,
} from '../database'
import { AuthResponse } from '../server/controllers/getAuth'
import {
  BungieProfileResponse,
  BungieTokenResponse,
  BungieUserResponse,
} from './bungieApi'
import { components } from './bungieTypes'

type BungieInventory = components['schemas']['Destiny.Entities.Inventory.DestinyInventoryComponent']
type BungieCharacter = components['schemas']['Destiny.Entities.Characters.DestinyCharacterComponent']
type BungieCharacterInventories = Record<string, BungieInventory>
type BungieItemComponent = components['schemas']['Destiny.Entities.Items.DestinyItemComponent']
type BungieItemComponents = components['schemas']['DestinyItemComponentSetOfint64']

export interface Token extends BungieTokenResponse {
  expires_at: number
}

export const parseToken = (token: BungieTokenResponse): Token => ({
  ...token,
  expires_at: Date.now() + token.expires_in * 1000,
})

interface Character {
  characterId: number
  race: number
  class: number
  emblem: string
}

export const parseCharacters = (
  characters: Record<string, BungieCharacter>
): Character[] =>
  Object.values(characters).map((value) => ({
    characterId: value.characterId || 0,
    race: value.raceType || 0,
    class: value.classType || 0,
    emblem: `https://www.bungie.net${value.emblemBackgroundPath}`,
  }))

export interface CharacterInterface {
  itemHash: number
  itemInstanceId?: number
  name: string
  characterId: string
  stats: Stat[]
  perks: Socket[]
  itemInfo?: any
  itemSockets?: any
  reusablePlugs?: any
}

export const parseProfileInventory = (
  profileInventory: BungieInventory,
  itemComponents: BungieItemComponents
): CharacterInterface[] => {
  if (profileInventory?.items === undefined) {
    return []
  }
  // https://bungie-net.github.io/multi/schema_Destiny-Entities-Items-DestinyItemComponent.html#schema_Destiny-Entities-Items-DestinyItemComponent
  const items: BungieItemComponent[] = profileInventory.items

  return items
    .filter(({ itemHash }) => isWeapon(itemHash))
    .map((item) => {
      const itemHash = item.itemHash || 0
      const itemInstanceId = item.itemInstanceId || undefined
      const weapon = bungieInventoryItemDefinition.get(itemHash)

      // basic info for current random weapon
      const itemInfo =
        itemComponents?.instances?.data?.[`${itemInstanceId}`] || {}

      // calculated stats for the current random weapon (including perks)
      const itemStats =
        itemComponents?.stats?.data?.[`${itemInstanceId}`]?.stats || {}
      const stats = Object.values(itemStats) as DestinyStats[]

      // all available perks for current random weapon
      const reusablePlugs =
        itemComponents.reusablePlugs?.data?.[`${itemInstanceId}`]?.plugs || {}

      // equipped perks for current random weapon
      const itemSockets = itemComponents?.sockets?.data?.[
        `${itemInstanceId}`
      ]?.sockets
        ?.filter((socket) => socket.isVisible === true)
        .map((perk) => {
          const perkstats = getPerk(perk.plugHash || 0)
          return {
            ...perkstats,
          }
        })

      return {
        itemHash,
        itemInstanceId,
        itemInfo: {
          damageTypeHash: itemInfo.damageTypeHash,
          primaryStat: itemInfo.primaryStat,
        },
        itemSockets,
        reusablePlugs,
        name: weapon?.displayProperties?.name || '',
        characterId: '0',
        stats: getStats(stats),
        perks: getSockets(weapon),
        // TODO masterwork: {},
        // TODO intrinsicTraits: {},
        // TODO mods: {},
      }
    })
}

export const parseCharacterInventories = (
  characterInventories: BungieCharacterInventories
): CharacterInterface[] =>
  Object.entries(characterInventories)
    .flatMap(([key, value]) =>
      value?.items?.map((item) => ({
        itemHash: item.itemHash || 0,
        itemInstanceId: item.itemInstanceId || undefined,
        characterId: key,
      }))
    )
    .filter((item) => isWeapon(item?.itemHash))
    .filter((item) => item !== undefined)
    .map((item) => {
      const itemHash = item?.itemHash || 0
      const weapon = bungieInventoryItemDefinition.get(itemHash)
      const itemStats = weapon?.stats?.stats || {}
      const stats =
        Object.values(itemStats)
          .filter((stat) => stat.statHash !== undefined && stat.value !== 0)
          .map((stat) => ({
            statHash: stat.statHash || 0,
            value: stat.value || 0,
          })) || []

      return {
        itemHash,
        itemInstanceId: item?.itemInstanceId,
        name: weapon?.displayProperties?.name || '',
        characterId: item?.characterId || '',
        stats: getStats(stats),
        perks: getSockets(weapon),
      }
    })

export const convertUser = (
  token: BungieTokenResponse,
  user: BungieUserResponse
): AuthResponse => {
  console.log('token', JSON.stringify(token, null, 2))
  console.log('user', JSON.stringify(user, null, 2))

  const membershipId = user?.Response?.bungieNetUser?.membershipId
  const memberShipType = user?.Response?.destinyMemberships?.map(
    ({ crossSaveOverride, membershipType }) =>
      crossSaveOverride ? crossSaveOverride : membershipType
  )?.[0]
  const primaryMembershipId =
    user?.Response?.primaryMembershipId ||
    user?.Response?.destinyMemberships?.[0]?.membershipId

  if (
    membershipId === undefined ||
    memberShipType === undefined ||
    primaryMembershipId === undefined
  ) {
    throw new Error('could not fetch profile from bungie')
  }

  return {
    accessToken: token.access_token,
    tokenType: token.token_type,
    expiresAt: token.expires_at,
    primaryMembershipId,
    membershipId,
    memberShipType,
  }
}

export interface Profile {
  characters: Character[]
  vault: CharacterInterface[]
  characterItems: CharacterInterface[]
  characterEquipment: CharacterInterface[]
}

export const parseProfile = (profile: BungieProfileResponse): Profile => {
  const characters = profile?.Response?.characters?.data || {}
  const vault = profile?.Response?.profileInventory?.data || {}
  const characterInventories =
    profile?.Response?.characterInventories?.data || {}
  const characterEquipment = profile?.Response?.characterEquipment?.data || {}
  const itemComponents = profile?.Response?.itemComponents || {}

  return {
    characters: parseCharacters(characters),
    vault: parseProfileInventory(vault, itemComponents),
    characterItems: parseCharacterInventories(characterInventories),
    characterEquipment: parseCharacterInventories(characterEquipment),
  }
}

const isWeapon = (itemHash?: number): boolean => {
  if (itemHash === undefined) {
    return false
  }

  const item = bungieInventoryItemDefinition.get(itemHash)

  return item?.itemType === 3
}

interface Socket {
  socketTypeHash: number
  name: string
  intrinsicPerks: Perk[]
  randomPerks: Perk[]
  curatedPerks: Perk[]
}

export const getSockets = (item?: BungieInventoryItemDefinition): Socket[] => {
  const itemEntries = item?.sockets?.socketEntries

  if (itemEntries === undefined) {
    return []
  }

  const entries = Object.values(itemEntries)
  // const masterworkHash = 2218962841
  // const trackerHash = 1282012138
  // const intrinsicHash = 3956125808
  // const weaponModHash = 711121010
  // const shaderHash = 1288200359

  return entries
    .filter(
      (entry) =>
        entry.socketTypeHash !== 0 && entry.socketTypeHash !== undefined
      //     entry?.socketTypeHash !== intrinsicHash &&
      //     entry?.socketTypeHash !== masterworkHash &&
      //     entry?.socketTypeHash !== shaderHash &&
      //     entry?.socketTypeHash !== trackerHash &&
      //     entry?.socketTypeHash !== weaponModHash
    )
    .map((entry) => {
      const reusablePlugSetHash = entry.reusablePlugSetHash || 0
      const randomizedPlugSetHash = entry.randomizedPlugSetHash || 0
      const socketTypeHash = entry.socketTypeHash || 0
      const socketType = bungieSocketTypeDefinition.get(socketTypeHash)
      const socketCategoryHash = socketType?.socketCategoryHash || 0
      const socketCategory = bungieSocketCategoryDefinition.get(
        socketCategoryHash
      )
      const reusablePlugSet = bungiePlugSetDefinition.get(reusablePlugSetHash)
        ?.reusablePlugItems
      const randomizedPlugSet = bungiePlugSetDefinition.get(
        randomizedPlugSetHash
      )?.reusablePlugItems
      const reusablePlugItems = entry.reusablePlugItems

      return {
        socketTypeHash,
        name: socketCategory?.displayProperties?.name || '',
        intrinsicPerks: getPerkInfo(reusablePlugSet),
        randomPerks: getPerkInfo(randomizedPlugSet),
        curatedPerks: getPerkInfo(reusablePlugItems),
      }
    })
}

interface Stat {
  statHash: number
  value: number
  name: string
}

interface DestinyStats {
  statHash: number | undefined
  value: number | undefined
}

export const getStats = (stats: DestinyStats[]): Stat[] => {
  return stats
    .filter((stat) => stat.value !== 0 && stat.statHash !== undefined)
    .map((stat) => {
      const hash = stat.statHash || 0
      const definition = bungieStatDefinition.get(hash)

      return {
        statHash: definition?.hash || 0,
        name: definition?.displayProperties?.name || '',
        value: stat?.value || 0,
        index: definition?.index || 100,
      }
    })
    .sort((a, b) => a.index - b.index)
    .map(({ statHash, value, name }) => ({
      statHash,
      value,
      name,
    }))
}

interface Perk {
  perkHash: number
  name: string
  stats: Stat[]
}

export const getPerkInfo = (perks?: { plugItemHash?: number }[]): Perk[] => {
  if (Array.isArray(perks) !== true || perks === undefined) {
    return []
  }

  return perks.map((perk) => getPerk(perk.plugItemHash || 0))
}

const getPerk = (hash: number): Perk => {
  const item = bungieInventoryItemDefinition.get(hash)
  const stats =
    item?.investmentStats
      ?.filter((stat) => stat.statTypeHash !== undefined && stat.value !== 0)
      .map((stat) => ({
        statHash: stat.statTypeHash || 0,
        value: stat.value || 0,
      })) || []

  return {
    perkHash: hash,
    name: item?.displayProperties?.name || '',
    stats: getStats(stats),
  }
}
