import { bungieClassDefinition, bungieRaceDefinition } from '../database'
import { components } from './bungieTypes'

type BungieCharacter = components['schemas']['Destiny.Entities.Characters.DestinyCharacterComponent']

export interface Character {
  characterId: string
  race: string
  class: string
  gender: string
  light: number
  emblem: string
}

export const parseCharacters = (
  characters: Record<string, BungieCharacter>
): Character[] =>
  Object.values(characters).map((value) => {
    const classInfo = bungieClassDefinition.get(value?.classHash || 0)
    const raceInfo = bungieRaceDefinition.get(value?.raceHash || 0)

    return {
      characterId: `${value.characterId}`,
      race: raceInfo?.displayProperties?.name || '',
      class: classInfo?.displayProperties?.name || '',
      gender:
        raceInfo?.genderedRaceNamesByGenderHash?.[`${value?.genderHash}`] || '',
      light: value.light || 0,
      emblem: `https://www.bungie.net${value.emblemBackgroundPath}`,
    }
  })
