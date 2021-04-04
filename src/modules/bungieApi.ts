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
  const profileInventories = 102 // profile-level inventories, such as your Vault buckets
  const characters = 200 // summary info about each of the characters in the profile
  const characterInventories = 201 // non-equipped items on the character(s)
  const characterEquipment = 205 // equipped items on the character(s)
  const itemComponents = 300 //  basic info about instanced items
  const itemSockets = 305 // all info relevant to the sockets on items that have them
  const itemReusablePlugs = 310 // what plugs *could* be inserted into a socket
  const components = [
    characterEquipment,
    characterInventories,
    characters,
    itemComponents,
    itemReusablePlugs,
    itemSockets,
    profileInventories,
  ].join(',')
  const url = `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${primaryMembershipId}?components=102,200,201,205,300,302,304,305,301,306,307,308,309,310`

  console.log('Fetching ', url, components)

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
}

export const transferItem = ({
  characterId,
  itemHash,
  itemInstanceId,
  membershipType,
  transferToVault,
}: TransferItemParams): Promise<BungieItemActionResponse> => {
  const body: BungieItemTransferRequest = {
    itemReferenceHash: itemHash, // item id
    stackSize: 1,
    transferToVault,
    itemId: itemInstanceId, // instanceId
    characterId: parseInt(characterId, 10),
    membershipType,
  }

  return fetch(
    'https://www.bungie.net/Platform/Destiny2/Actions/Items/TransferItem/',
    {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  ).then((res) => parseJsonOrThrow(res))
}
