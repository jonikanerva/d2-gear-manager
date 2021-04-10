import { promises as fs } from 'fs'
import path from 'path'

import { components } from './modules/bungieTypes'

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
    .then(() => {
      store.delete(0)
    })
}

export type BungieInventoryItemDefinition = components['schemas']['Destiny.Definitions.DestinyInventoryItemDefinition']
type BungiePlugSetDefinition = components['schemas']['Destiny.Definitions.Sockets.DestinyPlugSetDefinition']
type BungieStatDefinition = components['schemas']['Destiny.Definitions.DestinyStatDefinition']
type BungieSocketTypeDefinition = components['schemas']['Destiny.Definitions.Sockets.DestinySocketTypeDefinition']
type BungieSocketCategoryDefinition = components['schemas']['Destiny.Definitions.Sockets.DestinySocketCategoryDefinition']
type BungieClassDefinition = components['schemas']['Destiny.Definitions.DestinyClassDefinition']
type BungieRaceDefinition = components['schemas']['Destiny.Definitions.DestinyRaceDefinition']
type BungieInventoryBucketDefinition = components['schemas']['Destiny.Definitions.DestinyInventoryBucketDefinition']
type BungieDamageTypeDefinition = components['schemas']['Destiny.Definitions.DestinyDamageTypeDefinition']
type BungieEquipmentSlotDefinition = components['schemas']['Destiny.Definitions.DestinyEquipmentSlotDefinition']

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
export const bungieClassDefinition = new Map<number, BungieClassDefinition>()
export const bungieRaceDefinition = new Map<number, BungieRaceDefinition>()
export const bungieInventoryBucketDefinition = new Map<
  number,
  BungieInventoryBucketDefinition
>()
export const bungieDamageTypeDefinition = new Map<
  number,
  BungieDamageTypeDefinition
>()
export const bungieEquipmentSlotDefinition = new Map<
  number,
  BungieEquipmentSlotDefinition
>()

const loadDestinyInventoryItemDefinition = (): Promise<void> =>
  readFile('DestinyInventoryItemDefinition.json', bungieInventoryItemDefinition)

const loadDestinyPlugSetDefinition = (): Promise<void> =>
  readFile('DestinyPlugSetDefinition.json', bungiePlugSetDefinition)

const loadDestinyStatDefinition = (): Promise<void> =>
  readFile('DestinyStatDefinition.json', bungieStatDefinition)

const loadDestinySocketTypeDefinition = (): Promise<void> =>
  readFile('DestinySocketTypeDefinition.json', bungieSocketTypeDefinition)

const loadDestinySocketCategoryDefinition = (): Promise<void> =>
  readFile(
    'DestinySocketCategoryDefinition.json',
    bungieSocketCategoryDefinition
  )

const loadDestinyClassDefinition = (): Promise<void> =>
  readFile('DestinyClassDefinition.json', bungieClassDefinition)

const loadDestinyRaceDefinition = (): Promise<void> =>
  readFile('DestinyRaceDefinition.json', bungieRaceDefinition)

const loadDestinyInventoryBucketDefinition = (): Promise<void> =>
  readFile(
    'DestinyInventoryBucketDefinition.json',
    bungieInventoryBucketDefinition
  )

const loadDestinyDamageTypeDefinition = (): Promise<void> =>
  readFile('DestinyDamageTypeDefinition.json', bungieDamageTypeDefinition)

const loadDestinyEquipmentSlotDefinition = (): Promise<void> =>
  readFile('DestinyEquipmentSlotDefinition.json', bungieEquipmentSlotDefinition)

export const loadDestinyData = (): Promise<unknown> =>
  Promise.all([
    loadDestinyClassDefinition(),
    loadDestinyInventoryItemDefinition(),
    loadDestinyPlugSetDefinition(),
    loadDestinyRaceDefinition(),
    loadDestinySocketCategoryDefinition(),
    loadDestinySocketTypeDefinition(),
    loadDestinyStatDefinition(),
    loadDestinyInventoryBucketDefinition(),
    loadDestinyDamageTypeDefinition(),
    loadDestinyEquipmentSlotDefinition(),
  ]).then(() => console.log('All data read to memory.'))
