import { parseProfile } from '../src/modules/bungieData'
import userProfileJson from './fixtures/userProfile.json'

const userProfile = userProfileJson as any

describe('parseProfile', () => {
  it('parses valid token response', () => {
    const user = parseProfile(userProfile)

    expect(user).toHaveProperty('characters')
    expect(user).toHaveProperty('vault')
    expect(user).toHaveProperty('characterItems')
    expect(user).toHaveProperty('characterEquipment')
  })
})
