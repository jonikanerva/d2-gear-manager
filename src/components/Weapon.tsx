import React from 'react'

import { Item } from '../modules/bungieItems'
import styles from './Weapon.css'

interface WeaponProps {
  item: Item
}

const screenshot = (hash: number) =>
  `https://www.bungie.net/common/destiny2_content/screenshots/${hash}.jpg`

const Weapon: React.FC<WeaponProps> = ({ item }: WeaponProps) => {
  const src = screenshot(item.itemHash)

  return (
    <div
      className={styles.weaponTile}
      style={{
        backgroundImage: `url("${src}")`,
      }}
    >
      <div className={styles.weaponName}>
        {item.name} ({item.powerLevel})
      </div>
      <div className={styles.stats}>
        {item.stats.map((stat, key) => (
          <div key={key}>
            {stat.name}: {stat.value}
          </div>
        ))}
      </div>
      <div className={styles.perks}>
        Perks: {item.equippedPerks.map((perk) => perk.name).join(', ')}
      </div>
    </div>
  )
}

export default Weapon
