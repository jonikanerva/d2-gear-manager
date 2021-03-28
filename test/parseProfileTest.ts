import { loadDestinyData } from '../src/database'
import { parseProfile, parseProfileInventory } from '../src/modules/bungieData'
import userProfileJson from './fixtures/userProfile.json'

const userProfile = userProfileJson as any
const userVault = userProfile.profileInventory.data

beforeAll(async () => loadDestinyData())

describe('parseProfile', () => {
  it('parses valid token response', () => {
    const user = parseProfile(userProfile)

    expect(user).toHaveProperty('characters')
    expect(user).toHaveProperty('vault')
    expect(user).toHaveProperty('characterItems')
    expect(user).toHaveProperty('characterEquipment')
  })
})

describe('parseProfileInventory', () => {
  it('parses valid token response', () => {
    const vault = parseProfileInventory(userVault)

    expect(vault[0].stats).toEqual([
      { statHash: 4284893193, value: 90 },
      { statHash: 2523465841, value: 46 },
      { statHash: 3614673599, value: 55 },
      { statHash: 155624089, value: 55 },
      { statHash: 3871231066, value: 1 },
      { statHash: 943549884, value: 82 },
      { statHash: 4188031367, value: 55 },
      { statHash: 1345609583, value: 80 },
      { statHash: 2715839340, value: 60 },
      { statHash: 3555269338, value: 13 },
    ])
  })
})
