import React from 'react'
import { Character } from '../modules/bungieCharacter'

import { Item } from '../modules/bungieItems'
import styles from './Weapon.css'

interface WeaponProps {
  item: Item
  characters: Character[]
  membershipType: number
}

const screenshot = (hash: number) =>
  `https://www.bungie.net/common/destiny2_content/screenshots/${hash}.jpg`

const getCharacter = (hash: string, characters: Character[]): Character =>
  characters.filter(({ characterId }) => characterId === hash)?.[0]

const Weapon: React.FC<WeaponProps> = ({ item, characters }: WeaponProps) => {
  const src = screenshot(item.itemHash)
  const character = getCharacter(item.storedAt, characters)

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
        <br />
        {item.equipped === true ? 'Equipped ' : ''}
        {character === undefined
          ? 'In Vault.'
          : `On ${character.gender} ${character.class} (${character.light}).`}
      </div>
    </div>
  )
}

export default Weapon
