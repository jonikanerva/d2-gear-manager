import { promises as fs } from 'fs'
import path from 'path'

import { components } from './modules/bungieTypes'

type BungieInventoryItemDefinition = components['schemas']['Destiny.Definitions.DestinyInventoryItemDefinition']
type BungiePlugSetDefinition = components['schemas']['Destiny.Definitions.Sockets.DestinyPlugSetDefinition']
type BungieStatDefinition = components['schemas']['Destiny.Definitions.DestinyStatDefinition']

export const bungieInventoryItemDefinition = new Map<
  number,
  BungieInventoryItemDefinition
>()
export const bungiePlugSetDefinition = new Map<
  number,
  BungiePlugSetDefinition
>()
export const bungieStatDefinition = new Map<number, BungieStatDefinition>()

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
    .then(() => console.log('done.'))
}

export const loadDestinyData = (): Promise<void> =>
  readFile('DestinyInventoryItemDefinition.json', bungieInventoryItemDefinition)
    .then(() =>
      readFile('DestinyPlugSetDefinition.json', bungiePlugSetDefinition)
    )
    .then(() => readFile('DestinyStatDefinition.json', bungieStatDefinition))
