import { NextFunction, Request, Response } from 'express'

import {
  convertUser,
  generateToken,
  getUserInfo,
} from '../../modules/bungieApi'

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
