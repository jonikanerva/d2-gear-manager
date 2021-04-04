import { NextFunction, Request, Response } from 'express'

import { transferItem, TransferItemParams } from '../../modules/bungieApi'

export type TransferRequest = TransferItemParams

export interface TransferReponse {
  status: number
  message: string
}

const parseRequest = (req: Request): Promise<TransferRequest> => {
  const body = req.body

  const characterId = body?.characterId
  const itemHash = body?.itemHash
  const itemInstanceId = body?.itemInstanceId
  const membershipType = body?.membershipType
  const transferToVault = body?.transferToVault
  const accessToken = body?.accessToken
  const tokenType = body?.tokenType

  console.log('POST /api/transfer', req.body)

  if (
    Number.isInteger(itemHash) &&
    itemInstanceId &&
    itemInstanceId !== '' &&
    (transferToVault === true || transferToVault === false) &&
    characterId &&
    characterId !== '' &&
    Number.isInteger(membershipType) &&
    accessToken &&
    accessToken !== '' &&
    tokenType &&
    tokenType !== ''
  ) {
    return Promise.resolve({
      characterId,
      itemHash,
      itemInstanceId,
      membershipType,
      transferToVault,
      accessToken,
      tokenType,
    })
  } else {
    console.error('ERROR', req.body)

    throw new Error('invalid request, parameters incorrect')
  }
}

export const postTransfer = (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> =>
  parseRequest(req)
    .then((request) => transferItem(request))
    .then((json) => ({
      message: json.Message || 'unknown',
      status: json.Response || 500,
    }))
    .then((response: TransferReponse) => {
      res.send(response)
    })
    .catch((error) => {
      console.error('request', req.body)
      console.error(error)

      res.status(500).send('Error trasferring item!')
    })
