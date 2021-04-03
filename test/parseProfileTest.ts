import { loadDestinyData } from '../src/database'
import { parseProfile } from '../src/modules/bungieItems'
import userProfileJson from './fixtures/userProfile.json'

const userProfile = userProfileJson as any

beforeAll(async () => loadDestinyData())

describe('parseProfile', () => {
  it('parses valid token response', () => {
    const user = parseProfile(userProfile)

    expect(user).toHaveProperty('characters')
    expect(user).toHaveProperty('items')
  })
})
