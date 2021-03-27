import fetch, { Response } from 'node-fetch'

import { components } from '../bungie'
import { config } from './config'

export type BungieUserResponse = components['responses']['User.UserMembershipData']['content']['application/json']
export type BungieProfileResponse = components['responses']['Destiny.Responses.DestinyProfileResponse']['content']['application/json']
type BungieInventory = components['schemas']['Destiny.Entities.Inventory.DestinyInventoryComponent']
type BungieCharacter = components['schemas']['Destiny.Entities.Characters.DestinyCharacterComponent']
interface BungieCharacterInventories {
  [key: string]: BungieInventory
}

interface Character {
  characterId: number
  race: number
  class: number
  emblem: string
}

interface Vault {
  itemHash: number
}

export interface BungieTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  membership_id: string
  expires_at: number
}

interface GetUserProfileParams {
  accessToken: string
  tokenType: string
  memberShipType: number
  primaryMembershipId: string
}

const parseJsonOrThrow = (res: Response): Promise<any> => {
  if (res.ok === true) {
    return res.json()
  } else {
    throw new Error('Network response was not ok')
  }
}

export const generateToken = (code: string): Promise<BungieTokenResponse> =>
  fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
    method: 'post',
    body: `client_id=${config.bungieClientId}&grant_type=authorization_code&code=${code}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then((res) => parseJsonOrThrow(res))
    .then((json) => ({
      ...json,
      expires_at: Date.now() + json.expires_in * 1000,
    }))

export const getUserInfo = ({
  access_token,
  token_type,
}: BungieTokenResponse): Promise<BungieUserResponse> =>
  fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
    headers: {
      'X-API-Key': config.bungieApiKey,
      Authorization: `${token_type} ${access_token}`,
    },
  }).then((res) => parseJsonOrThrow(res))

export const getUserProfile = ({
  accessToken,
  tokenType,
  memberShipType,
  primaryMembershipId,
}: GetUserProfileParams): Promise<any> => {
  // https://bungie-net.github.io/multi/schema_Destiny-DestinyComponentType.html#schema_Destiny-DestinyComponentType
  const profileInventories = 102 // profile-level inventories, such as your Vault buckets
  const characters = 200 // summary info about each of the characters in the profile
  const characterInventories = 201 // non-equipped items on the character(s)
  const characterEquipment = 205 // equipped items on the character(s)
  const itemSockets = 305 // all info relevant to the sockets on items that have them
  const components = [
    profileInventories,
    characters,
    characterInventories,
    characterEquipment,
    itemSockets,
  ].join(',')
  const url = `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${primaryMembershipId}?components=${components}`

  console.log('fetching profile', url)

  return fetch(url, {
    headers: {
      'X-API-Key': config.bungieApiKey,
      Authorization: `${tokenType} ${accessToken}`,
    },
  })
    .then((res) => parseJsonOrThrow(res))
    .then((json: BungieProfileResponse) => {
      console.log('saatiin response', json)

      const characters = json?.Response?.characters?.data || {}
      const vault = json?.Response?.profileInventory?.data || {}
      const characterInventories =
        json?.Response?.characterInventories?.data || {}
      const characterEquipment = json?.Response?.characterEquipment?.data || {}

      return {
        characters: parseCharacters(characters),
        vault: parseProfileInventory(vault),
        characterItems: parseCharacterInventories(characterInventories),
        characterEquipment: parseCharacterInventories(characterEquipment),
      }
    })
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

const parseProfileInventory = (profileInventory: BungieInventory): Vault[] => {
  if (profileInventory?.items === undefined) {
    return []
  }

  return profileInventory?.items?.map(({ itemHash }) => ({
    itemHash,
  })) as Vault[]
}

const parseCharacterInventories = (
  characterInventories: BungieCharacterInventories
) => {
  return Object.entries(characterInventories).flatMap(([key, value]) =>
    value?.items?.map((item) => ({
      itemHash: item.itemHash,
      characterId: key,
    }))
  )
}
