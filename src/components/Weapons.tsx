import React from 'react'

import { Profile } from '../modules/bungieItems'
import Weapon from './Weapon'

interface WeaponProps {
  profile: Profile
}

const Weapons: React.FC<WeaponProps> = ({ profile }: WeaponProps) => {
  return (
    <div>
      <h2>Weapons</h2>
      {profile.items.map((item, key) => {
        return <Weapon key={key} item={item} />
      })}
    </div>
  )
}

export default Weapons
