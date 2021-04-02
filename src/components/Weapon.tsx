import React from 'react'

import { CharacterInterface } from '../modules/bungieData'

interface WeaponProps {
  weapon: CharacterInterface
}

const Weapon: React.FC<WeaponProps> = ({ weapon }: WeaponProps) => {
  return (
    <div>
      {weapon.name}
      {weapon.stats.map((stat, key) => {
        return (
          <li key={key}>
            {stat.name}: {stat.value}
          </li>
        )
      })}
      <br />
    </div>
  )
}

export default Weapon
