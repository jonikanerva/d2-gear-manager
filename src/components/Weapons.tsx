import { debounce } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'

import { Item, Profile } from '../modules/bungieItems'
import Weapon from './Weapon'
import styles from './Weapons.css'

type Event = React.ChangeEvent<HTMLInputElement>
type MouseEvent = React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>

interface WeaponProps {
  profile: Profile
  membershipType: number
  accessToken: string
  tokenType: string
}

const Weapons: React.FC<WeaponProps> = ({
  profile,
  membershipType,
  accessToken,
  tokenType,
}: WeaponProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [weapons, setWeapons] = useState<Item[]>(profile.items)

  useEffect(() => {
    if (searchTerm.length > 2) {
      const search = searchWeapons(searchTerm)

      setWeapons(search)
    } else {
      setWeapons(profile.items)
    }
  }, [searchTerm, profile])

  const handleSearchOnChange = debounce((event: Event) => {
    setSearchTerm(event.target.value)
  }, 200)

  const clearSearch = (event: MouseEvent) => {
    event.preventDefault()

    const searchField = document.getElementById(
      'searchField'
    ) as HTMLInputElement

    if (searchField !== null) {
      searchField.value = ''
    }

    setSearchTerm('')
  }

  const searchWeapons = useCallback(
    (searchTerm: string): Item[] =>
      profile.items.filter((weapon): boolean => {
        const searchableFields = [
          weapon.name,
          weapon.typeName,
          weapon.tierTypeName,
          weapon.damageTypeName,
          weapon.itemInstanceId,
          weapon.storedAt !== '0' ? weapon.storedAt : '',
          ...weapon.perks.flatMap((perks) =>
            perks.perks.map(({ name }) => name)
          ),
          ...weapon.stats.map(({ name }) => name),
        ].join(' ')

        return new RegExp(searchTerm, 'i').test(searchableFields)
      }),
    [searchTerm, profile]
  )

  const sortWeapons = useCallback(
    (weapons: Item[]): Item[] =>
      weapons.sort((a, b) => a.name.localeCompare(b.name)),
    [weapons]
  )

  const items = sortWeapons(weapons)

  console.log('weapons', items)

  return (
    <div>
      <div className={styles.heading}>Weapons</div>
      <div className={styles.searchArea}>
        <input
          id="searchField"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          type="text"
          className={styles.searchBox}
          onChange={handleSearchOnChange}
        />
        <a
          href="/"
          className={styles.clearButton}
          onClick={(e) => clearSearch(e)}
        >
          ❌
        </a>
      </div>
      <div className={styles.weapons}>
        {items.map((item) => {
          const key = `${item.itemHash}${item.itemInstanceId}`

          return (
            <Weapon
              item={item}
              key={key}
              characters={profile.characters}
              membershipType={membershipType}
              accessToken={accessToken}
              tokenType={tokenType}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Weapons
