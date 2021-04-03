import { parseToken } from '../src/modules/bungieAuth'
import tokenResponseJson from './fixtures/tokenResponse.json'

const tokenResponse = tokenResponseJson as any

describe('parseToken', () => {
  it('parses valid token response', () => {
    const token = parseToken(tokenResponse)

    expect(token).toHaveProperty('expires_at')
  })
})
