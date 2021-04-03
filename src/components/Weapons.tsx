import React from 'react'

import { Profile } from '../modules/bungieItems'
import Weapon from './Weapon'

interface WeaponProps {
  profile: Profile
}

const Weapons: React.FC<WeaponProps> = ({ profile }: WeaponProps) => {
  const getWeapon = (hash: number) =>
    profile.weapons.filter((weapon) => weapon.itemHash === hash)?.[0]

  // const getPerk = (hash: number) =>
  //   profile.perks.filter((perk) => perk.perkHash === hash)?.[0]

  // const getStat = (hash: number) =>
  //   profile.stats.filter((stat) => stat.statHash === hash)?.[0]

  return (
    <div>
      <h2>Weapons</h2>
      {profile.items.map((item, key) => {
        const weapon = getWeapon(item.itemHash)

        return <Weapon key={key} item={item} weapon={weapon} />
      })}
    </div>
  )
}

export default Weapons
