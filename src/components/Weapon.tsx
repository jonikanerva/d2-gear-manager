import React, { useState } from 'react'
import { Character } from '../modules/bungieCharacter'

import { Item } from '../modules/bungieItems'
import {
  TransferReponse,
  TransferRequest,
} from '../server/controllers/postTransfer'
import styles from './Weapon.css'

interface WeaponProps {
  item: Item
  characters: Character[]
  membershipType: number
  accessToken: string
  tokenType: string
}

const screenshot = (hash: number) =>
  `https://www.bungie.net/common/destiny2_content/screenshots/${hash}.jpg`

const getCharacter = (hash: string, characters: Character[]): Character =>
  characters.filter(({ characterId }) => characterId === hash)?.[0]

const transferItem = (params: TransferRequest): Promise<TransferReponse> =>
  fetch('/api/transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then((response) => response.json())

const prepareButtons = (
  item: Item,
  characters: Character[],
  membershipType: number
) => {
  const inVault = item.storedAt === '0'

  const moveToCharacters = characters.map((character) => ({
    label: `Transfer to ${character.gender} ${character.class} (${character.light})`,
    characterId: character.characterId,
    itemHash: item.itemHash,
    itemInstanceId: item.itemInstanceId,
    membershipType,
    transferToVault: false,
  }))

  const moveToVault = item.equipped
    ? []
    : [
        {
          label: 'Transfer to Vault',
          characterId: item.storedAt,
          itemHash: item.itemHash,
          itemInstanceId: item.itemInstanceId,
          membershipType,
          transferToVault: true,
        },
      ]

  return inVault ? moveToCharacters : moveToVault
}

const Weapon: React.FC<WeaponProps> = ({
  item,
  characters,
  membershipType,
  accessToken,
  tokenType,
}: WeaponProps) => {
  const src = screenshot(item.itemHash)
  const character = getCharacter(item.storedAt, characters)
  const buttons = prepareButtons(item, characters, membershipType)
  const [transferring, setTransferring] = useState<string>('')

  const handleClick = (params: TransferRequest) => {
    setTransferring('Transferring')

    return transferItem(params)
      .then((json) => {
        setTransferring(json.message)
      })
      .catch((error) => {
        setTransferring(error)
      })
  }

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
      <div className={styles.location}>
        {item.equipped === true ? 'Equipped ' : ''}
        {character === undefined
          ? 'In Vault.'
          : `On ${character.gender} ${character.class} (${character.light}).`}
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
      <div className={styles.transferButtons}>
        {transferring !== '' ? (
          <div>{transferring}</div>
        ) : (
          <div>
            {buttons.length === 0
              ? 'Unequip first to transfer'
              : buttons.map((button, key) => (
                  <button
                    key={key}
                    onClick={() =>
                      handleClick({ ...button, accessToken, tokenType })
                    }
                  >
                    {button.label}
                  </button>
                ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Weapon
