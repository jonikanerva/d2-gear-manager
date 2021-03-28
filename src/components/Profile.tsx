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

  console.log('your profile', profile)

  return (
    profile && (
      <div>
        <h1>Your profile</h1>
        <h2>Characters</h2>
        {profile.characters.map((character, key) => {
          return (
            <div key={key}>
              <img src={character.emblem} />
            </div>
          )
        })}
        <h2>Equipped</h2>
        {profile.characterEquipment.length} weapons
        <h2>Vault</h2>
        {profile.vault.length} weapons
        <h2>Inventory</h2>
        {profile.characterItems.length} weapons
      </div>
    )
  )
}

export default Profile
