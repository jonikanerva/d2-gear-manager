import {
  bungieInventoryItemDefinition,
  bungiePlugSetDefinition,
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

export const parseProfileInventory = (
  profileInventory: BungieInventory
): CharacterInterface[] => {
  if (profileInventory?.items === undefined) {
    return []
  }

  return profileInventory.items
    .map(({ itemHash }) => ({ itemHash }))
    .filter(({ itemHash }) => isWeapon(itemHash))
    .map((item: any) => {
      const weapon = bungieInventoryItemDefinition.get(item.itemHash)

      return {
        itemHash: item.itemHash,
        characterId: '',
        stats: getStats(weapon),
        perks: getSockets(weapon),
        // TODO masterwork: {},
        // TODO intrinsicTraits: {},
        // TODO mods: {},
      }
    })
}

interface CharacterInterface {
  itemHash: number
  characterId: string
  stats: any
  perks: any
}

export const parseCharacterInventories = (
  characterInventories: BungieCharacterInventories
): CharacterInterface[] =>
  Object.entries(characterInventories)
    .flatMap(([key, value]) =>
      value?.items?.map((item) => ({
        itemHash: item.itemHash || 0,
        characterId: key,
      }))
    )
    .filter((item) => isWeapon(item?.itemHash))
    .filter((item) => item !== undefined)
    .map((item: any) => {
      const weapon = bungieInventoryItemDefinition.get(item.itemHash)

      return {
        itemHash: item.itemHash,
        characterId: item.characterId,
        stats: getStats(weapon),
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
  characters: any
  vault: any
  characterItems: any
  characterEquipment: any
}

export const parseProfile = (profile: BungieProfileResponse): Profile => {
  const characters = profile?.Response?.characters?.data || {}
  const vault = profile?.Response?.profileInventory?.data || {}
  const characterInventories =
    profile?.Response?.characterInventories?.data || {}
  const characterEquipment = profile?.Response?.characterEquipment?.data || {}

  return {
    characters: parseCharacters(characters),
    vault: parseProfileInventory(vault),
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

const getSockets = (item: any) => {
  const itemEntries = item?.sockets?.socketEntries || {}
  const entries = Object.values(itemEntries)
  // const masterworkHash = 2218962841
  // const trackerHash = 1282012138
  // const intrinsicHash = 3956125808
  // const weaponModHash = 711121010
  // const shaderHash = 1288200359

  return entries
    .filter(
      (entry: any) => entry?.socketTypeHash !== 0
      //     entry?.socketTypeHash !== intrinsicHash &&
      //     entry?.socketTypeHash !== masterworkHash &&
      //     entry?.socketTypeHash !== shaderHash &&
      //     entry?.socketTypeHash !== trackerHash &&
      //     entry?.socketTypeHash !== weaponModHash
    )
    .map((entry: any) => {
      const reusablePlugSet: any = bungiePlugSetDefinition.get(
        entry.reusablePlugSetHash
      )?.reusablePlugItems
      const randomizedPlugSet: any = bungiePlugSetDefinition.get(
        entry.randomizedPlugSetHash
      )?.reusablePlugItems
      const reusablePlugItems: any = entry.reusablePlugItems

      return {
        socketTypeHash: entry.socketTypeHash,
        intrinsicPerks: getPerkInfo(reusablePlugSet),
        randomPerks: getPerkInfo(randomizedPlugSet),
        curatedPerks: getPerkInfo(reusablePlugItems),
      }
    })
}

const getStats = (item: any) => {
  const itemStats = item?.stats?.stats || {}
  const stats = Object.values(itemStats)

  return stats
    .filter((stat: any) => stat.value !== 0)
    .map((stat: any) => {
      const definition = bungieStatDefinition.get(stat.statHash)

      return {
        statHash: definition?.hash,
        value: stat?.value,
        index: definition?.index,
      }
    })
    .sort((a: any, b: any) => a.index - b.index)
    .map(({ statHash, value }: any) => ({ statHash, value }))
}

const getPerkInfo = (perks?: { plugItemHash: number }[]) => {
  if (Array.isArray(perks) !== true || perks === undefined) {
    return []
  }

  return perks.map((perk) => {
    const hash = perk.plugItemHash
    const item = bungieInventoryItemDefinition.get(hash)
    const stats = item?.investmentStats || []
    const investmentStats = stats
      .filter((stat: any) => stat.value !== 0)
      .map((stat: any) => {
        const definition = bungieStatDefinition.get(stat.statTypeHash)

        return {
          statHash: definition?.hash,
          value: stat?.value,
          index: definition?.index,
        }
      })
      .sort((a: any, b: any) => a.index - b.index)
      .map(({ statHash, value }: any) => ({ statHash, value }))

    return {
      perkHash: hash,
      stats: investmentStats,
    }
  })
}
