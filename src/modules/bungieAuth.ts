import { AuthResponse } from '../server/controllers/getAuth'
import { BungieTokenResponse, BungieUserResponse } from './bungieApi'

interface Token extends BungieTokenResponse {
  expires_at: number
}

export const parseToken = (token: BungieTokenResponse): Token => ({
  ...token,
  expires_at: Date.now() + token.expires_in * 1000,
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
