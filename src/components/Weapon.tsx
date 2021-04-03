import React from 'react'

import { Item } from '../modules/bungieItems'

interface WeaponProps {
  item: Item
}

const Weapon: React.FC<WeaponProps> = ({ item }: WeaponProps) => {
  return (
    <div>
      stats
      {item.stats.map((stat, key) => {
        return (
          <li key={key}>
            {stat.statHash}: {stat.value}
          </li>
        )
      })}
      <br />
      equipped perks
      {item.equippedPerks.map((perk, key) => {
        return (
          <div key={key}>
            <li>{perk}</li>
          </div>
        )
      })}
      <br />
      available perks
      {item.availablePerks.map((perk, key) => {
        return (
          <div key={key}>
            <li>{perk}</li>
          </div>
        )
      })}
    </div>
  )
}

export default Weapon
