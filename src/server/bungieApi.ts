import fetch, { Response } from 'node-fetch'

import { components } from '../bungie'
import { config } from './config'

export type BungieUserResponse = components['responses']['User.UserMembershipData']['content']['application/json']
export type BungieProfileResponse = components['responses']['Destiny.Responses.DestinyProfileResponse']['content']['application/json']

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
}: GetUserProfileParams): Promise<BungieProfileResponse> =>
  fetch(
    `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${primaryMembershipId}?components=102,200,201,205,300,305`,
    {
      headers: {
        'X-API-Key': config.bungieApiKey,
        Authorization: `${tokenType} ${accessToken}`,
      },
    }
  ).then((res) => parseJsonOrThrow(res))
