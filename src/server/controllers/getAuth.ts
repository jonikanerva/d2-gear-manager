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

  if (code && code.length > 1) {
    return Promise.resolve(code)
  } else {
    throw new Error("missing query parameter 'code'")
  }
}

const convertUser = (
  token: BungieTokenResponse,
  user: BungieUserResponse
): AuthResponse => ({
  accessToken: token.access_token,
  tokenType: token.token_type,
  expiresAt: token.expires_at,
  primaryMembershipId: user?.Response?.primaryMembershipId || 0,
  membershipId: user?.Response?.bungieNetUser?.membershipId || 0,
  memberShipType:
    user?.Response?.destinyMemberships?.map(
      ({ crossSaveOverride, membershipType }) =>
        crossSaveOverride ? crossSaveOverride : membershipType
    )?.[0] || 0,
})

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
