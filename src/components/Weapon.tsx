import React from 'react'

import { Item, Weapon } from '../modules/bungieItems'

interface WeaponProps {
  item: Item
  weapon: Weapon
}

const Weapon: React.FC<WeaponProps> = ({ item, weapon }: WeaponProps) => {
  return (
    <div>
      {weapon.name}
      <img src={`https://www.bungie.net${weapon.icon}`} />
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
