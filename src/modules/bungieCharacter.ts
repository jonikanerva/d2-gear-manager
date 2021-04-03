import { components } from './bungieTypes'

type BungieCharacter = components['schemas']['Destiny.Entities.Characters.DestinyCharacterComponent']

export interface Character {
  characterId: number
  race: number
  class: number
  emblem: string
}

export const parseCharacters = (
  characters: Record<string, BungieCharacter>
): Character[] =>
  Object.values(characters).map((value) => ({
    characterId: value.characterId || 0,
    race: value.raceType || 0,
    class: value.classType || 0,
    emblem: `https://www.bungie.net${value.emblemBackgroundPath}`,
  }))
