import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import { Redirect, useLocation } from 'react-router'
import { components } from '../bungie'
import { setItem } from './localStorage'

const bungieClientId = 1502
const bungieApiKey = '7c0484ada8a94ea2abc1bdae7cc8c0ad' // TODO 💩

export interface VaultManagerStorage {
  accessToken: string
  tokenType: string
  expiresAt: number
  primaryMembershipId?: number
  membershipId?: number
  memberShipType?: number
}

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
    body: `client_id=${bungieClientId}&grant_type=authorization_code&code=${code}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then((res) => {
      if (res.ok === true) {
        return res.json()
      } else {
        throw new Error('Network response was not ok')
      }
    })
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
      'X-API-Key': bungieApiKey,
      Authorization: `${token_type} ${access_token}`,
    },
  }).then((res) => {
    if (res.ok === true) {
      return res.json()
    } else {
      throw new Error('Network response was not ok')
    }
  })

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const query = queryString.parse(useLocation().search)?.code?.toString()

  useEffect(() => {
    if (query && query.length > 1) {
      generateToken(query)
        .then((token) =>
          getUserInfo(token)
            .then((user) => ({
              accessToken: token.access_token,
              tokenType: token.token_type,
              expiresAt: token.expires_at,
              primaryMembershipId:
                user?.Response?.primaryMembershipId || undefined,
              membershipId: user?.Response?.bungieNetUser?.membershipId,
              memberShipType: user?.Response?.destinyMemberships?.map(
                ({ crossSaveOverride, membershipType }) =>
                  crossSaveOverride ? crossSaveOverride : membershipType
              )?.[0],
            }))
            .then((authData: VaultManagerStorage) => {
              setItem('donutVaultManager', authData)
              setLoading(false)
            })
        )
        .catch((error) => {
          setError(true)

          console.error(error)
        })
    }
  }, [query, setItem])

  if (error === true) {
    return <h1>💩 An error occured! 💩</h1>
  }

  if (loading === true) {
    return <h1>Authentiacting with Bungie...</h1>
  }

  return <Redirect to="/" />
}

export default Auth
