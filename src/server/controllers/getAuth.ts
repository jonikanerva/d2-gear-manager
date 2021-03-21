import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'

import { components } from '../../bungie'
import { config } from '../config'

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  membership_id: string
  expires_at: number
}

type UserResponse = components['responses']['User.UserMembershipData']['content']['application/json']

const generateToken = (code: string): Promise<TokenResponse> =>
  fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
    method: 'post',
    body: `client_id=${config.bungieClientId}&grant_type=authorization_code&code=${code}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then((res) => res.json())
    .then((json) => ({
      ...json,
      expires_at: Date.now() + json.expires_in * 1000,
    }))

const getUserInfo = ({
  access_token,
  token_type,
}: TokenResponse): Promise<UserResponse> =>
  fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
    headers: {
      'X-API-Key': config.bungieApiKey,
      Authorization: `${token_type} ${access_token}`,
    },
  }).then((res) => res.json())

export const getAuth = (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const code = (req.query.code || '').toString()

  return generateToken(code)
    .then((token) =>
      getUserInfo(token).then((user) => {
        const primaryMembershipId = user?.Response?.primaryMembershipId
        const membershipId = user?.Response?.bungieNetUser?.membershipId
        const memberShipType = user?.Response?.destinyMemberships?.map(
          ({ crossSaveOverride, membershipType }) =>
            crossSaveOverride ? crossSaveOverride : membershipType
        )?.[0]
        const tokenType = token.token_type
        const accessToken = token.access_token
        const expiresAt = token.expires_at

        res.cookie('tokenType', tokenType)
        res.cookie('accessToken', accessToken)
        res.cookie('expiresAt', expiresAt)
        res.cookie('memberShipType', memberShipType)
        res.cookie('primaryMembershipId', primaryMembershipId)
        res.cookie('membershipId', membershipId)
        res.redirect('/')
      })
    )
    .catch((error) => {
      console.error(error)

      res.status(500).send({ error: 'internal server error' })
    })
}
