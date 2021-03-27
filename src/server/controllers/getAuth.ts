import { NextFunction, Request, Response } from 'express'
import {
  generateToken,
  getUserInfo,
  BungieUserResponse,
  BungieTokenResponse,
} from '../bungieApi'

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresAt: number
  primaryMembershipId: number
  membershipId: number
  memberShipType: number
}

const parseRequest = (req: Request): Promise<string> => {
  const code = (req.query.code || '').toString()

  console.log('GET /api/auth', req.query)

  if (code && code.length > 1) {
    return Promise.resolve(code)
  } else {
    throw new Error("missing query parameter 'code'")
  }
}

const convertUser = (
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

export const getAuth = (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> =>
  parseRequest(req)
    .then((code) => generateToken(code))
    .then((token) =>
      getUserInfo(token)
        .then((user) => convertUser(token, user))
        .then((authData) => {
          res.send(authData)
        })
    )
    .catch((error) => {
      console.error(error)

      res.status(500).send('Authentication error!')
    })
