import { promises as fs } from 'fs'
import fetch from 'node-fetch'

import { components } from '../bungie'
import { config } from './config'

type Manifest = components['schemas']['Destiny.Config.DestinyManifest']

const getManifest = (): Promise<Manifest> =>
  fetch('https://www.bungie.net/Platform/Destiny2/Manifest/', {
    headers: { 'X-API-Key': config.bungieApiKey },
  })
    .then((res) => res.json())
    .then((manifest) => manifest.Response)

const getContent = (path: string) => {
  console.log('Downloading: ', path)

  return fetch(`https://www.bungie.net${path}`)
    .then((res) => res.json())
    .then((json) => JSON.stringify(json, null, 2))
}

const storeToFile = (filename: string, data: string): Promise<void> =>
  fs.writeFile(`./data/${filename}.json`, data)

const storePath = ({
  name,
  path,
}: {
  name: string
  path: string
}): Promise<void> => getContent(path).then((data) => storeToFile(name, data))

const callInSequence = <T>(list: T[], fnc: (arg: T) => Promise<void>) =>
  list.reduce((memo, item) => memo.then(() => fnc(item)), Promise.resolve())

const dumpAll = () =>
  getManifest()
    .then((manifest) => manifest?.jsonWorldComponentContentPaths?.en || {})
    .then((paths) =>
      Object.entries(paths).map(([key, value]) => ({ name: key, path: value }))
    )
    .then((paths) => callInSequence(paths, storePath))
    .catch((error) => console.error(error))

dumpAll()
