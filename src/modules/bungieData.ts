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

interface Vault {
  itemHash: number
}
export const parseProfileInventory = (
  profileInventory: BungieInventory
): Vault[] => {
  if (profileInventory?.items === undefined) {
    return []
  }

  return profileInventory?.items?.map(({ itemHash }) => ({
    itemHash,
  })) as Vault[]
}

interface CharacterInterface {
  itemHash: number
  characterId: string
}

export const parseCharacterInventories = (
  characterInventories: BungieCharacterInventories
): CharacterInterface[] =>
  Object.entries(characterInventories).flatMap(([key, value]) =>
    value?.items?.map((item) => ({
      itemHash: item.itemHash,
      characterId: key,
    }))
  ) as CharacterInterface[]

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
