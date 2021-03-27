import React, { useEffect, useState } from 'react'
import { ProfileResponse } from '../server/controllers/postProfile'

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
    return <h1>💩 An error occured! 💩</h1>
  }

  if (loading === true) {
    return <h1>Loading profile... ⏳</h1>
  }

  return (
    <div>
      <h1>Your profile</h1>
      {JSON.stringify(profile)}
    </div>
  )
}

export default Profile
