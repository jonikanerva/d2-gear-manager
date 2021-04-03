import React from 'react'

import { ItemInfo } from '../modules/bungieItems'

interface WeaponProps {
  weapon: ItemInfo
}

const Weapon: React.FC<WeaponProps> = ({ weapon }: WeaponProps) => {
  return (
    <div>
      {weapon.itemHash} ({weapon.storedAt})
      {weapon.stats.map((stat, key) => {
        return (
          <li key={key}>
            {stat.statHash}: {stat.value}
          </li>
        )
      })}
      <br />
      {weapon.equippedPerks.map((perk, key) => {
        return (
          <div key={key}>
            <li>{perk}</li>
          </div>
        )
      })}
      <br />
    </div>
  )
}

export default Weapon
