import { convertUser } from '../src/modules/bungieData'
import tokenResponseJson from './fixtures/tokenResponse.json'
import bobmursuJson from './fixtures/userInfoBobmursu.json'
import calmdonutJson from './fixtures/userInfoCalmdonut.json'

const tokenResponse = tokenResponseJson as any
const calmdonut = calmdonutJson as any
const bobmursu = bobmursuJson as any

describe('convertUser', () => {
  it('parses valid token and user with cross save enabled', () => {
    const donutAuth = convertUser(tokenResponse, calmdonut)

    expect(donutAuth).toHaveProperty('accessToken')
    expect(donutAuth).toHaveProperty('tokenType')
    expect(donutAuth).toHaveProperty('expiresAt')
    expect(donutAuth).toHaveProperty('primaryMembershipId')
    expect(donutAuth).toHaveProperty('membershipId')
    expect(donutAuth).toHaveProperty('memberShipType')
    expect(donutAuth.memberShipType).toEqual(2)
    expect(donutAuth.primaryMembershipId).toEqual('4611686018433444841')
  })

  it('parses valid token and user with cross save disabled', () => {
    const mursuAuth = convertUser(tokenResponse, bobmursu)

    expect(mursuAuth).toHaveProperty('accessToken')
    expect(mursuAuth).toHaveProperty('tokenType')
    expect(mursuAuth).toHaveProperty('expiresAt')
    expect(mursuAuth).toHaveProperty('primaryMembershipId')
    expect(mursuAuth).toHaveProperty('membershipId')
    expect(mursuAuth).toHaveProperty('memberShipType')
    expect(mursuAuth.memberShipType).toEqual(2)
    expect(mursuAuth.primaryMembershipId).toEqual('4611686018438653031')
  })
})
