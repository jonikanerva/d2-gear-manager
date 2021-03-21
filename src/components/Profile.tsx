import React, { useEffect, useState } from 'react'
import { getItem } from './localStorage'
import { components } from '../bungie'
import { VaultManagerStorage } from './Auth'

type ProfileResponse = components['responses']['Destiny.Responses.DestinyProfileResponse']['content']['application/json']

const bungieApiKey = '7c0484ada8a94ea2abc1bdae7cc8c0ad' // TODO 💩
const getUserInfo = ({
  accessToken,
  tokenType,
  memberShipType,
  primaryMembershipId,
}: VaultManagerStorage): Promise<ProfileResponse> =>
  fetch(
    `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${primaryMembershipId}?components=102,200,201,205,300,305`,
    {
      headers: {
        'X-API-Key': bungieApiKey,
        Authorization: `${tokenType} ${accessToken}`,
      },
    }
  ).then((res) => {
    if (res.ok === true) {
      return res.json()
    } else {
      throw new Error('Network response was not ok')
    }
  })

const Profile: React.FC = () => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileResponse>()
  const [storage, setStorage] = useState<VaultManagerStorage>()

  useEffect(() => {
    const donut = getItem('donutVaultManager') as VaultManagerStorage
    setStorage(donut)
  }, [])

  useEffect(() => {
    if (storage !== undefined) {
      getUserInfo(storage)
        .then((response) => {
          setProfile(response)
          setLoading(false)
        })
        .catch((error) => {
          setError(true)

          console.error(error)
        })
    }
  }, [storage])

  if (error === true) {
    return <h1>💩 An error occured! 💩</h1>
  }

  if (loading === true) {
    return <h1>Loading... ⏳</h1>
  }

  return (
    <div>
      <h1>Your profile</h1>
      {JSON.stringify(profile)}
    </div>
  )
}

export default Profile
