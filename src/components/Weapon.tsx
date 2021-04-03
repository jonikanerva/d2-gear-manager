import React from 'react'

import { Item } from '../modules/bungieItems'

interface WeaponProps {
  item: Item
}

const Weapon: React.FC<WeaponProps> = ({ item }: WeaponProps) => {
  return (
    <div>
      <img src={`https://www.bungie.net${item.icon}`} />
    </div>
  )
}

export default Weapon
