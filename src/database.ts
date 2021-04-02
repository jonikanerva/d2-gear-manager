import { promises as fs } from 'fs'
import path from 'path'

import { components } from './modules/bungieTypes'

export type BungieInventoryItemDefinition = components['schemas']['Destiny.Definitions.DestinyInventoryItemDefinition']
type BungiePlugSetDefinition = components['schemas']['Destiny.Definitions.Sockets.DestinyPlugSetDefinition']
type BungieStatDefinition = components['schemas']['Destiny.Definitions.DestinyStatDefinition']
type BungieSocketTypeDefinition = components['schemas']['Destiny.Definitions.Sockets.DestinySocketTypeDefinition']
type BungieSocketCategoryDefinition = components['schemas']['Destiny.Definitions.Sockets.DestinySocketCategoryDefinition']

export const bungieInventoryItemDefinition = new Map<
  number,
  BungieInventoryItemDefinition
>()
export const bungiePlugSetDefinition = new Map<
  number,
  BungiePlugSetDefinition
>()
export const bungieStatDefinition = new Map<number, BungieStatDefinition>()
export const bungieSocketTypeDefinition = new Map<
  number,
  BungieSocketTypeDefinition
>()
export const bungieSocketCategoryDefinition = new Map<
  number,
  BungieSocketCategoryDefinition
>()

const readFile = (filename: string, store: Map<any, any>): Promise<void> => {
  console.log('Reading', filename)

  return fs
    .readFile(path.resolve(__dirname, `../data/${filename}`), {
      encoding: 'utf8',
    })
    .then((file) => JSON.parse(file))
    .then((json) => Object.values(json))
    .then((values) => {
      values.forEach((value: any) => {
        store.set(value.hash || 0, value)
      })
    })
}

export const loadDestinyInventoryItemDefinition = (): Promise<void> =>
  readFile('DestinyInventoryItemDefinition.json', bungieInventoryItemDefinition)

export const loadDestinyPlugSetDefinition = (): Promise<void> =>
  readFile('DestinyPlugSetDefinition.json', bungiePlugSetDefinition)

export const loadDestinyStatDefinition = (): Promise<void> =>
  readFile('DestinyStatDefinition.json', bungieStatDefinition)

export const loadDestinySocketTypeDefinition = (): Promise<void> =>
  readFile('DestinySocketTypeDefinition.json', bungieSocketTypeDefinition)

export const loadDestinySocketCategoryDefinition = (): Promise<void> =>
  readFile(
    'DestinySocketCategoryDefinition.json',
    bungieSocketCategoryDefinition
  )

export const loadDestinyData = (): Promise<unknown> =>
  Promise.all([
    loadDestinyInventoryItemDefinition(),
    loadDestinyPlugSetDefinition(),
    loadDestinyStatDefinition(),
    loadDestinySocketTypeDefinition(),
    loadDestinySocketCategoryDefinition(),
  ]).then(() => console.log('All data read to memory.'))
