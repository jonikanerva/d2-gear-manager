import React, { useEffect, useState } from 'react'

import { ProfileResponse } from '../server/controllers/postProfile'
import css from './App.css'
import Weapons from './Weapons'

interface ProfileProps {
  accessToken: string
  tokenType: string
  memberShipType: number
  primaryMembershipId: number
}

const Profile: React.FC<ProfileProps> = ({
  accessToken,
  tokenType,
  memberShipType,
  primaryMembershipId,
}: ProfileProps) => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileResponse>()

  useEffect(() => {
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken,
        tokenType,
        memberShipType,
        primaryMembershipId,
      }),
    })
      .then((response) => response.json())
      .then((json: ProfileResponse) => {
        setProfile(json)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)

        setError(true)
      })
  }, [accessToken, tokenType, memberShipType, primaryMembershipId])

  if (error === true) {
    return (
      <div className={css.centeredHeading}>
        💩 An error occured while fetching profile! 💩
      </div>
    )
  }

  if (loading === true) {
    return <div className={css.centeredHeading}>Loading profile... ⏳</div>
  }

  if (profile === undefined) {
    return <div className={css.centeredHeading}>💩 Profile not found! 💩</div>
  }

  console.log('your profile', profile)

  return (
    <div>
      <Weapons
        profile={profile}
        membershipType={memberShipType}
        accessToken={accessToken}
        tokenType={tokenType}
      />
    </div>
  )
}

export default Profile
