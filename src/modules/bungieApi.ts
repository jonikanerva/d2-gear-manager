import fetch, { Response } from 'node-fetch'

import { config } from '../server/config'
import { components } from './bungieTypes'

export type BungieUserResponse = components['responses']['User.UserMembershipData']['content']['application/json']
export type BungieProfileResponse = components['responses']['Destiny.Responses.DestinyProfileResponse']['content']['application/json']

type BungieItemActionRequest = components['schemas']['Destiny.Requests.Actions.DestinyItemActionRequest']
type BungieItemTransferRequest = components['schemas']['Destiny.Requests.DestinyItemTransferRequest']
type BungieItemActionResponse = components['responses']['int32']['content']['application/json']

export interface BungieTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  membership_id: string
  expires_at: number
}

const parseJsonOrThrow = (res: Response): Promise<any> => {
  if (res.ok === true) {
    return res.json()
  } else {
    throw new Error('Network response was not ok')
  }
}

export const getToken = (code: string): Promise<BungieTokenResponse> =>
  fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
    method: 'post',
    body: `client_id=${config.bungieClientId}&grant_type=authorization_code&code=${code}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then((res) => parseJsonOrThrow(res))

interface GetUserInfoParams {
  access_token: string
  token_type: string
}

export const getUserInfo = ({
  access_token,
  token_type,
}: GetUserInfoParams): Promise<BungieUserResponse> =>
  fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
    headers: {
      'X-API-Key': config.bungieApiKey,
      Authorization: `${token_type} ${access_token}`,
    },
  }).then((res) => parseJsonOrThrow(res))

interface GetUserProfileParams {
  accessToken: string
  tokenType: string
  memberShipType: number
  primaryMembershipId: string
}

export const getUserProfile = ({
  accessToken,
  tokenType,
  memberShipType,
  primaryMembershipId,
}: GetUserProfileParams): Promise<BungieProfileResponse> => {
  // https://bungie-net.github.io/multi/schema_Destiny-DestinyComponentType.html#schema_Destiny-DestinyComponentType
  const profileInventories = 102 //   Response.profileInventory             - profile-level inventories, such as your Vault buckets
  const characters = 200 //           Response.characters                   - summary info about each of the characters in the profile
  const characterInventories = 201 // Response.characterInventories         - non-equipped items on the character(s)
  const characterEquipment = 205 //   Response.characterEquipment           - equipped items on the character(s)
  const itemComponents = 300 //       Response.itemComponents.instances     - basic info about instanced items
  const itemStats = 304 //            Response.itemComponents.stats         - item's stats
  const itemSockets = 305 //          Response.itemComponents.sockets       - all info relevant to the sockets on items that have them
  const itemReusablePlugs = 310 //    Response.itemComponents.reusablePlugs - what plugs *could* be inserted into a socket
  const components = [
    profileInventories,
    characters,
    characterInventories,
    characterEquipment,
    itemComponents,
    itemStats,
    itemSockets,
    itemReusablePlugs,
  ].join(',')
  const url = `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${primaryMembershipId}?components=${components}`

  console.log('Fetching ', url)

  return fetch(url, {
    headers: {
      'X-API-Key': config.bungieApiKey,
      Authorization: `${tokenType} ${accessToken}`,
    },
  }).then((res) => parseJsonOrThrow(res))
}

export interface EquipItemParams {
  itemId: number
  characterId: string
  membershipType: number
}

export const equipItem = ({
  itemId,
  characterId,
  membershipType,
}: EquipItemParams): Promise<BungieItemActionResponse> => {
  const body: BungieItemActionRequest = {
    itemId,
    characterId: parseInt(characterId, 10),
    membershipType,
  }

  return fetch(
    'https://www.bungie.net/Platform/Destiny2/Actions/Items/EquipItem/',
    {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  ).then((res) => parseJsonOrThrow(res))
}

export interface TransferItemParams {
  itemHash: number
  itemInstanceId: number
  transferToVault: boolean
  characterId: string
  membershipType: number
  accessToken: string
  tokenType: string
}

export const transferItem = ({
  characterId,
  itemHash,
  itemInstanceId,
  membershipType,
  transferToVault,
  accessToken,
  tokenType,
}: TransferItemParams): Promise<BungieItemActionResponse> => {
  const body = {
    itemReferenceHash: `${itemHash}`,
    stackSize: '1',
    transferToVault: `${transferToVault}`,
    itemId: `${itemInstanceId}`,
    characterId: `${characterId}`,
    membershipType: `${membershipType}`,
  }
  console.log('transferring body', JSON.stringify(body, null, 2))

  return fetch(
    'https://www.bungie.net/Platform/Destiny2/Actions/Items/TransferItem/',
    {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.bungieApiKey,
        Authorization: `${tokenType} ${accessToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      console.log('response', JSON.stringify(json, null, 2))

      return json
    })
}
