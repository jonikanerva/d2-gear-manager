import React from 'react'

import { Profile } from '../modules/bungieItems'
import Weapon from './Weapon'
import styles from './Weapons.css'

interface WeaponProps {
  profile: Profile
}

const Weapons: React.FC<WeaponProps> = ({ profile }: WeaponProps) => {
  const items = profile.items.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div>
      <h2>Weapons</h2>
      <div className={styles.weapons}>
        {items.map((item, key) => (
          <Weapon key={key} item={item} />
        ))}
      </div>
    </div>
  )
}

export default Weapons
