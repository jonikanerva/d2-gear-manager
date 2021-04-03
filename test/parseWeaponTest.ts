import { loadDestinyData } from '../src/database'
import { getWeapon } from '../src/modules/bungieWeapons'

beforeAll(async () => loadDestinyData())

describe('weapon info', () => {
  it('returns info', () => {
    const hash = 1594120904
    const weapon = getWeapon(hash)

    expect(weapon).toEqual({
      icon:
        '/common/destiny2_content/icons/b4815d2060876f82559502e67bf9c3e3.jpg',
      index: 12074,
      itemHash: 1594120904,
      name: 'No Time to Explain',
      tierType: 6,
      tierTypeName: 'Exotic',
      type: 3,
      typeName: 'Pulse Rifle',
    })
  })
})
