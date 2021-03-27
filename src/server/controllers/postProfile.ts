import { NextFunction, Request, Response } from 'express'

import { getUserProfile, BungieProfileResponse } from '../bungieApi'

export interface ProfileRequest {
  accessToken: string
  tokenType: string
  memberShipType: number
  primaryMembershipId: string
}

export type ProfileResponse = BungieProfileResponse['Response']

const parseRequest = (req: Request): Promise<ProfileRequest> => {
  const body: ProfileRequest = req.body
  const accessToken = body?.accessToken
  const tokenType = body?.tokenType
  const memberShipType = body?.memberShipType
  const primaryMembershipId = body?.primaryMembershipId

  console.log('POST /api/auth', req.body)

  if (
    Number.isInteger(memberShipType) &&
    primaryMembershipId &&
    primaryMembershipId !== '' &&
    accessToken &&
    accessToken !== '' &&
    tokenType &&
    tokenType !== ''
  ) {
    return Promise.resolve({
      accessToken,
      tokenType,
      memberShipType,
      primaryMembershipId,
    })
  } else {
    console.error('ERROR', req.body)

    throw new Error('invalid request')
  }
}

export const postProfile = (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> =>
  parseRequest(req)
    .then((request) => getUserProfile(request))
    .then((response: ProfileResponse) => {
      res.send(response)
    })
    .catch((error) => {
      console.error('request', req.body)
      console.error(error)

      res.status(500).send('Error fetching profile!')
    })
