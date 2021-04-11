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

  const moveToVault =
    item.equipped || item.bucket === 'Lost Items'
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

  const atPostmaster = item.bucket === 'Lost Items'
  const inVault = character === undefined
  const onCharacter = atPostmaster === false && character !== undefined
  const isEquipped = item.equipped === true

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
        {item.damageTypeName} {item.typeName}, {item.ammoType} Ammo,{' '}
        {item.equipmentSlot} Slot
        <br />
        {isEquipped && 'Equipped '}
        {inVault && 'In Vault'}
        {onCharacter &&
          `On ${character.gender} ${character.class} (${character.light})`}
        {atPostmaster && 'At Postmaster'}
      </div>
      <div className={styles.stats}>
        {item.stats.map((stat, key) => (
          <div key={key}>
            {stat.name}: {stat.value}
          </div>
        ))}
      </div>
      <div className={styles.perks}>
        {item.perks.flatMap((perks, keyi) => (
          <div className={styles.perkCategory} key={keyi}>
            {perks.perks.map((perk, keyy) => (
              <div
                className={styles.perkIcon}
                key={`${keyi}${keyy}`}
                style={
                  perk.isEquipped ? { background: 'rgb(79, 79, 185)' } : {}
                }
              >
                <img
                  alt={perk.name}
                  className={styles.perkImage}
                  src={`https://www.bungie.net${perk.icon}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.perks}>
        {item.perks
          .flatMap((perks) => perks.perks.map(({ name }) => name))
          .join(', ')}
      </div>
      <div className={styles.transferButtons}>
        {transferring !== '' ? (
          <div>{transferring}</div>
        ) : (
          <div>
            {buttons.length === 0
              ? atPostmaster
                ? 'Pull from postmaster first to transfer'
                : 'Unequip first to transfer'
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
