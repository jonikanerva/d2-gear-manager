import { bungieInventoryItemDefinition, loadDestinyData } from '../src/database'
import { getStats, getSockets } from '../src/modules/bungieData'

beforeAll(async () => loadDestinyData())

describe('weapon stats and perks', () => {
  it('returns valid stats', () => {
    const hash = 1594120904
    const item = bungieInventoryItemDefinition.get(hash)
    const stats = getStats(item)

    expect(stats).toEqual([
      { statHash: 4284893193, value: 340 },
      { statHash: 4043523819, value: 33 },
      { statHash: 1240592695, value: 73 },
      { statHash: 155624089, value: 60 },
      { statHash: 3871231066, value: 24 },
      { statHash: 1931675084, value: 57 },
      { statHash: 943549884, value: 48 },
      { statHash: 4188031367, value: 64 },
      { statHash: 1345609583, value: 45 },
      { statHash: 2715839340, value: 90 },
      { statHash: 3555269338, value: 17 },
    ])
  })

  it('returns valid perks', () => {
    const hash = 3143732432
    const item = bungieInventoryItemDefinition.get(hash)
    const perks = getSockets(item)

    expect(perks).toEqual([
      {
        socketTypeHash: 3956125808,
        intrinsicPerks: [{ perkHash: 1019291327, stats: [] }],
        randomPerks: [],
        curatedPerks: [],
      },
      {
        socketTypeHash: 3362409147,
        intrinsicPerks: [],
        randomPerks: [
          {
            perkHash: 839105230,
            stats: [
              { statHash: 943549884, value: 10 },
              { statHash: 2715839340, value: 30 },
            ],
          },
          {
            perkHash: 3661387068,
            stats: [
              { statHash: 155624089, value: 10 },
              { statHash: 943549884, value: -5 },
              { statHash: 2715839340, value: 10 },
            ],
          },
          {
            perkHash: 4090651448,
            stats: [
              { statHash: 1240592695, value: 5 },
              { statHash: 155624089, value: 5 },
              { statHash: 943549884, value: 5 },
            ],
          },
          {
            perkHash: 1467527085,
            stats: [
              { statHash: 1240592695, value: 10 },
              { statHash: 943549884, value: -10 },
              { statHash: 2715839340, value: 10 },
            ],
          },
          {
            perkHash: 1840239774,
            stats: [
              { statHash: 155624089, value: 5 },
              { statHash: 943549884, value: 15 },
            ],
          },
          {
            perkHash: 202670084,
            stats: [
              { statHash: 1240592695, value: 15 },
              { statHash: 155624089, value: -10 },
              { statHash: 943549884, value: -5 },
            ],
          },
          {
            perkHash: 3250034553,
            stats: [{ statHash: 1240592695, value: 10 }],
          },
          { perkHash: 1392496348, stats: [{ statHash: 155624089, value: 10 }] },
          {
            perkHash: 1482024992,
            stats: [
              { statHash: 1240592695, value: 7 },
              { statHash: 155624089, value: 7 },
            ],
          },
        ],
        curatedPerks: [
          {
            perkHash: 3661387068,
            stats: [
              { statHash: 155624089, value: 10 },
              { statHash: 943549884, value: -5 },
              { statHash: 2715839340, value: 10 },
            ],
          },
        ],
      },
      {
        socketTypeHash: 3815406785,
        intrinsicPerks: [],
        randomPerks: [
          {
            perkHash: 2420895100,
            stats: [
              { statHash: 3871231066, value: 30 },
              { statHash: 4188031367, value: -20 },
            ],
          },
          { perkHash: 1431678320, stats: [] },
          {
            perkHash: 1087426260,
            stats: [{ statHash: 3871231066, value: 20 }],
          },
          { perkHash: 1968497646, stats: [{ statHash: 1240592695, value: 5 }] },
          { perkHash: 1561002382, stats: [{ statHash: 1240592695, value: 5 }] },
          {
            perkHash: 1885400500,
            stats: [
              { statHash: 1240592695, value: 5 },
              { statHash: 155624089, value: 10 },
            ],
          },
          {
            perkHash: 3230963543,
            stats: [
              { statHash: 155624089, value: 5 },
              { statHash: 4188031367, value: 15 },
            ],
          },
          {
            perkHash: 679225683,
            stats: [
              { statHash: 1240592695, value: 5 },
              { statHash: 4188031367, value: 10 },
            ],
          },
        ],
        curatedPerks: [
          {
            perkHash: 1885400500,
            stats: [
              { statHash: 1240592695, value: 5 },
              { statHash: 155624089, value: 10 },
            ],
          },
        ],
      },
      {
        socketTypeHash: 2614797986,
        intrinsicPerks: [],
        randomPerks: [
          { perkHash: 205890336, stats: [] },
          { perkHash: 4071163871, stats: [] },
          { perkHash: 3643424744, stats: [] },
          { perkHash: 2450788523, stats: [] },
          { perkHash: 1359896290, stats: [] },
          { perkHash: 2779035018, stats: [] },
          { perkHash: 1820235745, stats: [] },
        ],
        curatedPerks: [{ perkHash: 2450788523, stats: [] }],
      },
      {
        socketTypeHash: 2614797986,
        intrinsicPerks: [],
        randomPerks: [
          { perkHash: 3350417888, stats: [] },
          { perkHash: 3708227201, stats: [] },
          { perkHash: 4082225868, stats: [] },
          { perkHash: 3108830275, stats: [] },
          { perkHash: 2387244414, stats: [] },
          { perkHash: 699525795, stats: [] },
          { perkHash: 3425386926, stats: [] },
        ],
        curatedPerks: [{ perkHash: 3350417888, stats: [] }],
      },
      {
        socketTypeHash: 1288200359,
        intrinsicPerks: [{ perkHash: 4248210736, stats: [] }],
        randomPerks: [],
        curatedPerks: [],
      },
      {
        socketTypeHash: 353029665,
        intrinsicPerks: [
          { perkHash: 2323986101, stats: [] },
          { perkHash: 2788909693, stats: [] },
          {
            perkHash: 1588595445,
            stats: [{ statHash: 2715839340, value: 15 }],
          },
          {
            perkHash: 3336648220,
            stats: [
              { statHash: 3871231066, value: 30 },
              { statHash: 925767036, value: 30 },
            ],
          },
          { perkHash: 736000386, stats: [] },
          { perkHash: 941997506, stats: [] },
          { perkHash: 984527513, stats: [] },
          { perkHash: 4091000557, stats: [] },
          { perkHash: 371216963, stats: [] },
          { perkHash: 1513326571, stats: [] },
          { perkHash: 3228611386, stats: [{ statHash: 1345609583, value: 5 }] },
          { perkHash: 3785661089, stats: [] },
          { perkHash: 518387148, stats: [] },
          { perkHash: 666440382, stats: [] },
          { perkHash: 1837151577, stats: [] },
          { perkHash: 1471333428, stats: [] },
          { perkHash: 1334978104, stats: [] },
          { perkHash: 4003264426, stats: [{ statHash: 155624089, value: 10 }] },
          { perkHash: 299264772, stats: [{ statHash: 1240592695, value: 10 }] },
          { perkHash: 4278960718, stats: [{ statHash: 943549884, value: 10 }] },
          { perkHash: 634781242, stats: [{ statHash: 4188031367, value: 10 }] },
          {
            perkHash: 1225726778,
            stats: [
              { statHash: 3871231066, value: 40 },
              { statHash: 943549884, value: -20 },
            ],
          },
          {
            perkHash: 1525622117,
            stats: [
              { statHash: 1240592695, value: -10 },
              { statHash: 2715839340, value: 25 },
            ],
          },
          {
            perkHash: 1710791394,
            stats: [
              { statHash: 155624089, value: -20 },
              { statHash: 1345609583, value: 10 },
            ],
          },
          { perkHash: 3789184904, stats: [{ statHash: 1240592695, value: 5 }] },
          { perkHash: 3018373291, stats: [] },
        ],
        randomPerks: [],
        curatedPerks: [
          { perkHash: 4003264426, stats: [{ statHash: 155624089, value: 10 }] },
          { perkHash: 299264772, stats: [{ statHash: 1240592695, value: 10 }] },
          { perkHash: 4278960718, stats: [{ statHash: 943549884, value: 10 }] },
          { perkHash: 634781242, stats: [{ statHash: 4188031367, value: 10 }] },
          {
            perkHash: 1225726778,
            stats: [
              { statHash: 3871231066, value: 40 },
              { statHash: 943549884, value: -20 },
            ],
          },
          {
            perkHash: 1525622117,
            stats: [
              { statHash: 1240592695, value: -10 },
              { statHash: 2715839340, value: 25 },
            ],
          },
          {
            perkHash: 1710791394,
            stats: [
              { statHash: 155624089, value: -20 },
              { statHash: 1345609583, value: 10 },
            ],
          },
          { perkHash: 3789184904, stats: [{ statHash: 1240592695, value: 5 }] },
          { perkHash: 3018373291, stats: [] },
        ],
      },
      {
        socketTypeHash: 2218962841,
        intrinsicPerks: [
          { perkHash: 1590375901, stats: [{ statHash: 155624089, value: 1 }] },
          { perkHash: 1590375902, stats: [{ statHash: 155624089, value: 2 }] },
          { perkHash: 1590375903, stats: [{ statHash: 155624089, value: 3 }] },
          { perkHash: 1590375896, stats: [{ statHash: 155624089, value: 4 }] },
          { perkHash: 1590375897, stats: [{ statHash: 155624089, value: 5 }] },
          { perkHash: 1590375898, stats: [{ statHash: 155624089, value: 6 }] },
          { perkHash: 1590375899, stats: [{ statHash: 155624089, value: 7 }] },
          { perkHash: 1590375892, stats: [{ statHash: 155624089, value: 8 }] },
          { perkHash: 1590375893, stats: [{ statHash: 155624089, value: 9 }] },
          {
            perkHash: 384158423,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 10 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 150943607, stats: [{ statHash: 1240592695, value: 1 }] },
          { perkHash: 150943604, stats: [{ statHash: 1240592695, value: 2 }] },
          { perkHash: 150943605, stats: [{ statHash: 1240592695, value: 3 }] },
          { perkHash: 150943602, stats: [{ statHash: 1240592695, value: 4 }] },
          { perkHash: 150943603, stats: [{ statHash: 1240592695, value: 5 }] },
          { perkHash: 150943600, stats: [{ statHash: 1240592695, value: 6 }] },
          { perkHash: 150943601, stats: [{ statHash: 1240592695, value: 7 }] },
          { perkHash: 150943614, stats: [{ statHash: 1240592695, value: 8 }] },
          { perkHash: 150943615, stats: [{ statHash: 1240592695, value: 9 }] },
          {
            perkHash: 2697220197,
            stats: [
              { statHash: 1240592695, value: 10 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 518224747, stats: [{ statHash: 943549884, value: 1 }] },
          { perkHash: 518224744, stats: [{ statHash: 943549884, value: 2 }] },
          { perkHash: 518224745, stats: [{ statHash: 943549884, value: 3 }] },
          { perkHash: 518224750, stats: [{ statHash: 943549884, value: 4 }] },
          { perkHash: 518224751, stats: [{ statHash: 943549884, value: 5 }] },
          { perkHash: 518224748, stats: [{ statHash: 943549884, value: 6 }] },
          { perkHash: 518224749, stats: [{ statHash: 943549884, value: 7 }] },
          { perkHash: 518224738, stats: [{ statHash: 943549884, value: 8 }] },
          { perkHash: 518224739, stats: [{ statHash: 943549884, value: 9 }] },
          {
            perkHash: 186337601,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 10 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 1486919755, stats: [{ statHash: 4043523819, value: 1 }] },
          { perkHash: 1486919752, stats: [{ statHash: 4043523819, value: 2 }] },
          { perkHash: 1486919753, stats: [{ statHash: 4043523819, value: 3 }] },
          { perkHash: 1486919758, stats: [{ statHash: 4043523819, value: 4 }] },
          { perkHash: 1486919759, stats: [{ statHash: 4043523819, value: 5 }] },
          { perkHash: 1486919756, stats: [{ statHash: 4043523819, value: 6 }] },
          { perkHash: 1486919757, stats: [{ statHash: 4043523819, value: 7 }] },
          { perkHash: 1486919746, stats: [{ statHash: 4043523819, value: 8 }] },
          { perkHash: 1486919747, stats: [{ statHash: 4043523819, value: 9 }] },
          {
            perkHash: 3486498337,
            stats: [{ statHash: 4043523819, value: 10 }],
          },
          { perkHash: 4283235143, stats: [{ statHash: 4188031367, value: 1 }] },
          { perkHash: 4283235140, stats: [{ statHash: 4188031367, value: 2 }] },
          { perkHash: 4283235141, stats: [{ statHash: 4188031367, value: 3 }] },
          { perkHash: 4283235138, stats: [{ statHash: 4188031367, value: 4 }] },
          { perkHash: 4283235139, stats: [{ statHash: 4188031367, value: 5 }] },
          { perkHash: 4283235136, stats: [{ statHash: 4188031367, value: 6 }] },
          { perkHash: 4283235137, stats: [{ statHash: 4188031367, value: 7 }] },
          { perkHash: 4283235150, stats: [{ statHash: 4188031367, value: 8 }] },
          { perkHash: 4283235151, stats: [{ statHash: 4188031367, value: 9 }] },
          {
            perkHash: 758092021,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 10 },
            ],
          },
          { perkHash: 3928770367, stats: [{ statHash: 3614673599, value: 1 }] },
          { perkHash: 3928770364, stats: [{ statHash: 3614673599, value: 2 }] },
          { perkHash: 3928770365, stats: [{ statHash: 3614673599, value: 3 }] },
          { perkHash: 3928770362, stats: [{ statHash: 3614673599, value: 4 }] },
          { perkHash: 3928770363, stats: [{ statHash: 3614673599, value: 5 }] },
          { perkHash: 3928770360, stats: [{ statHash: 3614673599, value: 6 }] },
          { perkHash: 3928770361, stats: [{ statHash: 3614673599, value: 7 }] },
          { perkHash: 3928770358, stats: [{ statHash: 3614673599, value: 8 }] },
          { perkHash: 3928770359, stats: [{ statHash: 3614673599, value: 9 }] },
          {
            perkHash: 3803457565,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 10 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 4105787909, stats: [{ statHash: 2523465841, value: 1 }] },
          { perkHash: 4105787910, stats: [{ statHash: 2523465841, value: 2 }] },
          { perkHash: 4105787911, stats: [{ statHash: 2523465841, value: 3 }] },
          { perkHash: 4105787904, stats: [{ statHash: 2523465841, value: 4 }] },
          { perkHash: 4105787905, stats: [{ statHash: 2523465841, value: 5 }] },
          { perkHash: 4105787906, stats: [{ statHash: 2523465841, value: 6 }] },
          { perkHash: 4105787907, stats: [{ statHash: 2523465841, value: 7 }] },
          { perkHash: 4105787916, stats: [{ statHash: 2523465841, value: 8 }] },
          { perkHash: 4105787917, stats: [{ statHash: 2523465841, value: 9 }] },
          {
            perkHash: 1154004463,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 10 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          {
            perkHash: 3353797898,
            stats: [
              { statHash: 4043523819, value: -1 },
              { statHash: 2961396640, value: 1 },
            ],
          },
          {
            perkHash: 3353797897,
            stats: [
              { statHash: 4043523819, value: -2 },
              { statHash: 2961396640, value: 2 },
            ],
          },
          {
            perkHash: 3353797896,
            stats: [
              { statHash: 4043523819, value: -3 },
              { statHash: 2961396640, value: 3 },
            ],
          },
          {
            perkHash: 3353797903,
            stats: [
              { statHash: 4043523819, value: -4 },
              { statHash: 2961396640, value: 4 },
            ],
          },
          {
            perkHash: 3353797902,
            stats: [
              { statHash: 4043523819, value: -5 },
              { statHash: 2961396640, value: 5 },
            ],
          },
          {
            perkHash: 3353797901,
            stats: [
              { statHash: 4043523819, value: -6 },
              { statHash: 2961396640, value: 6 },
            ],
          },
          {
            perkHash: 3353797900,
            stats: [
              { statHash: 4043523819, value: -7 },
              { statHash: 2961396640, value: 7 },
            ],
          },
          {
            perkHash: 3353797891,
            stats: [
              { statHash: 4043523819, value: -8 },
              { statHash: 2961396640, value: 8 },
            ],
          },
          {
            perkHash: 3353797890,
            stats: [
              { statHash: 4043523819, value: -9 },
              { statHash: 2961396640, value: 9 },
            ],
          },
          {
            perkHash: 3128594062,
            stats: [
              { statHash: 4043523819, value: -10 },
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2961396640, value: 10 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          {
            perkHash: 2203506848,
            stats: [
              { statHash: 2961396640, value: 1 },
              { statHash: 447667954, value: 1 },
            ],
          },
          {
            perkHash: 2203506851,
            stats: [
              { statHash: 2961396640, value: 2 },
              { statHash: 447667954, value: 2 },
            ],
          },
          {
            perkHash: 2203506850,
            stats: [
              { statHash: 2961396640, value: 3 },
              { statHash: 447667954, value: 3 },
            ],
          },
          {
            perkHash: 2203506853,
            stats: [
              { statHash: 2961396640, value: 4 },
              { statHash: 447667954, value: 4 },
            ],
          },
          {
            perkHash: 2203506852,
            stats: [
              { statHash: 2961396640, value: 5 },
              { statHash: 447667954, value: 5 },
            ],
          },
          {
            perkHash: 2203506855,
            stats: [
              { statHash: 2961396640, value: 6 },
              { statHash: 447667954, value: 6 },
            ],
          },
          {
            perkHash: 2203506854,
            stats: [
              { statHash: 2961396640, value: 7 },
              { statHash: 447667954, value: 7 },
            ],
          },
          {
            perkHash: 2203506857,
            stats: [
              { statHash: 2961396640, value: 8 },
              { statHash: 447667954, value: 8 },
            ],
          },
          {
            perkHash: 2203506856,
            stats: [
              { statHash: 2961396640, value: 9 },
              { statHash: 447667954, value: 9 },
            ],
          },
          {
            perkHash: 1639384016,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2961396640, value: 10 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
              { statHash: 447667954, value: 10 },
            ],
          },
          { perkHash: 892374263, stats: [{ statHash: 1591432999, value: 1 }] },
          { perkHash: 892374260, stats: [{ statHash: 1591432999, value: 2 }] },
          { perkHash: 892374261, stats: [{ statHash: 1591432999, value: 3 }] },
          { perkHash: 892374258, stats: [{ statHash: 1591432999, value: 4 }] },
          { perkHash: 892374259, stats: [{ statHash: 1591432999, value: 5 }] },
          { perkHash: 892374256, stats: [{ statHash: 1591432999, value: 6 }] },
          { perkHash: 892374257, stats: [{ statHash: 1591432999, value: 7 }] },
          { perkHash: 892374270, stats: [{ statHash: 1591432999, value: 8 }] },
          { perkHash: 892374271, stats: [{ statHash: 1591432999, value: 9 }] },
          {
            perkHash: 2993547493,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 10 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
        ],
        randomPerks: [],
        curatedPerks: [
          { perkHash: 1590375901, stats: [{ statHash: 155624089, value: 1 }] },
          { perkHash: 1590375902, stats: [{ statHash: 155624089, value: 2 }] },
          { perkHash: 1590375903, stats: [{ statHash: 155624089, value: 3 }] },
          { perkHash: 1590375896, stats: [{ statHash: 155624089, value: 4 }] },
          { perkHash: 1590375897, stats: [{ statHash: 155624089, value: 5 }] },
          { perkHash: 1590375898, stats: [{ statHash: 155624089, value: 6 }] },
          { perkHash: 1590375899, stats: [{ statHash: 155624089, value: 7 }] },
          { perkHash: 1590375892, stats: [{ statHash: 155624089, value: 8 }] },
          { perkHash: 1590375893, stats: [{ statHash: 155624089, value: 9 }] },
          {
            perkHash: 384158423,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 10 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 150943607, stats: [{ statHash: 1240592695, value: 1 }] },
          { perkHash: 150943604, stats: [{ statHash: 1240592695, value: 2 }] },
          { perkHash: 150943605, stats: [{ statHash: 1240592695, value: 3 }] },
          { perkHash: 150943602, stats: [{ statHash: 1240592695, value: 4 }] },
          { perkHash: 150943603, stats: [{ statHash: 1240592695, value: 5 }] },
          { perkHash: 150943600, stats: [{ statHash: 1240592695, value: 6 }] },
          { perkHash: 150943601, stats: [{ statHash: 1240592695, value: 7 }] },
          { perkHash: 150943614, stats: [{ statHash: 1240592695, value: 8 }] },
          { perkHash: 150943615, stats: [{ statHash: 1240592695, value: 9 }] },
          {
            perkHash: 2697220197,
            stats: [
              { statHash: 1240592695, value: 10 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 518224747, stats: [{ statHash: 943549884, value: 1 }] },
          { perkHash: 518224744, stats: [{ statHash: 943549884, value: 2 }] },
          { perkHash: 518224745, stats: [{ statHash: 943549884, value: 3 }] },
          { perkHash: 518224750, stats: [{ statHash: 943549884, value: 4 }] },
          { perkHash: 518224751, stats: [{ statHash: 943549884, value: 5 }] },
          { perkHash: 518224748, stats: [{ statHash: 943549884, value: 6 }] },
          { perkHash: 518224749, stats: [{ statHash: 943549884, value: 7 }] },
          { perkHash: 518224738, stats: [{ statHash: 943549884, value: 8 }] },
          { perkHash: 518224739, stats: [{ statHash: 943549884, value: 9 }] },
          {
            perkHash: 186337601,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 10 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 1486919755, stats: [{ statHash: 4043523819, value: 1 }] },
          { perkHash: 1486919752, stats: [{ statHash: 4043523819, value: 2 }] },
          { perkHash: 1486919753, stats: [{ statHash: 4043523819, value: 3 }] },
          { perkHash: 1486919758, stats: [{ statHash: 4043523819, value: 4 }] },
          { perkHash: 1486919759, stats: [{ statHash: 4043523819, value: 5 }] },
          { perkHash: 1486919756, stats: [{ statHash: 4043523819, value: 6 }] },
          { perkHash: 1486919757, stats: [{ statHash: 4043523819, value: 7 }] },
          { perkHash: 1486919746, stats: [{ statHash: 4043523819, value: 8 }] },
          { perkHash: 1486919747, stats: [{ statHash: 4043523819, value: 9 }] },
          {
            perkHash: 3486498337,
            stats: [{ statHash: 4043523819, value: 10 }],
          },
          { perkHash: 4283235143, stats: [{ statHash: 4188031367, value: 1 }] },
          { perkHash: 4283235140, stats: [{ statHash: 4188031367, value: 2 }] },
          { perkHash: 4283235141, stats: [{ statHash: 4188031367, value: 3 }] },
          { perkHash: 4283235138, stats: [{ statHash: 4188031367, value: 4 }] },
          { perkHash: 4283235139, stats: [{ statHash: 4188031367, value: 5 }] },
          { perkHash: 4283235136, stats: [{ statHash: 4188031367, value: 6 }] },
          { perkHash: 4283235137, stats: [{ statHash: 4188031367, value: 7 }] },
          { perkHash: 4283235150, stats: [{ statHash: 4188031367, value: 8 }] },
          { perkHash: 4283235151, stats: [{ statHash: 4188031367, value: 9 }] },
          {
            perkHash: 758092021,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 10 },
            ],
          },
          { perkHash: 3928770367, stats: [{ statHash: 3614673599, value: 1 }] },
          { perkHash: 3928770364, stats: [{ statHash: 3614673599, value: 2 }] },
          { perkHash: 3928770365, stats: [{ statHash: 3614673599, value: 3 }] },
          { perkHash: 3928770362, stats: [{ statHash: 3614673599, value: 4 }] },
          { perkHash: 3928770363, stats: [{ statHash: 3614673599, value: 5 }] },
          { perkHash: 3928770360, stats: [{ statHash: 3614673599, value: 6 }] },
          { perkHash: 3928770361, stats: [{ statHash: 3614673599, value: 7 }] },
          { perkHash: 3928770358, stats: [{ statHash: 3614673599, value: 8 }] },
          { perkHash: 3928770359, stats: [{ statHash: 3614673599, value: 9 }] },
          {
            perkHash: 3803457565,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 10 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          { perkHash: 4105787909, stats: [{ statHash: 2523465841, value: 1 }] },
          { perkHash: 4105787910, stats: [{ statHash: 2523465841, value: 2 }] },
          { perkHash: 4105787911, stats: [{ statHash: 2523465841, value: 3 }] },
          { perkHash: 4105787904, stats: [{ statHash: 2523465841, value: 4 }] },
          { perkHash: 4105787905, stats: [{ statHash: 2523465841, value: 5 }] },
          { perkHash: 4105787906, stats: [{ statHash: 2523465841, value: 6 }] },
          { perkHash: 4105787907, stats: [{ statHash: 2523465841, value: 7 }] },
          { perkHash: 4105787916, stats: [{ statHash: 2523465841, value: 8 }] },
          { perkHash: 4105787917, stats: [{ statHash: 2523465841, value: 9 }] },
          {
            perkHash: 1154004463,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2523465841, value: 10 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          {
            perkHash: 3353797898,
            stats: [
              { statHash: 4043523819, value: -1 },
              { statHash: 2961396640, value: 1 },
            ],
          },
          {
            perkHash: 3353797897,
            stats: [
              { statHash: 4043523819, value: -2 },
              { statHash: 2961396640, value: 2 },
            ],
          },
          {
            perkHash: 3353797896,
            stats: [
              { statHash: 4043523819, value: -3 },
              { statHash: 2961396640, value: 3 },
            ],
          },
          {
            perkHash: 3353797903,
            stats: [
              { statHash: 4043523819, value: -4 },
              { statHash: 2961396640, value: 4 },
            ],
          },
          {
            perkHash: 3353797902,
            stats: [
              { statHash: 4043523819, value: -5 },
              { statHash: 2961396640, value: 5 },
            ],
          },
          {
            perkHash: 3353797901,
            stats: [
              { statHash: 4043523819, value: -6 },
              { statHash: 2961396640, value: 6 },
            ],
          },
          {
            perkHash: 3353797900,
            stats: [
              { statHash: 4043523819, value: -7 },
              { statHash: 2961396640, value: 7 },
            ],
          },
          {
            perkHash: 3353797891,
            stats: [
              { statHash: 4043523819, value: -8 },
              { statHash: 2961396640, value: 8 },
            ],
          },
          {
            perkHash: 3353797890,
            stats: [
              { statHash: 4043523819, value: -9 },
              { statHash: 2961396640, value: 9 },
            ],
          },
          {
            perkHash: 3128594062,
            stats: [
              { statHash: 4043523819, value: -10 },
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2961396640, value: 10 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
          {
            perkHash: 2203506848,
            stats: [
              { statHash: 2961396640, value: 1 },
              { statHash: 447667954, value: 1 },
            ],
          },
          {
            perkHash: 2203506851,
            stats: [
              { statHash: 2961396640, value: 2 },
              { statHash: 447667954, value: 2 },
            ],
          },
          {
            perkHash: 2203506850,
            stats: [
              { statHash: 2961396640, value: 3 },
              { statHash: 447667954, value: 3 },
            ],
          },
          {
            perkHash: 2203506853,
            stats: [
              { statHash: 2961396640, value: 4 },
              { statHash: 447667954, value: 4 },
            ],
          },
          {
            perkHash: 2203506852,
            stats: [
              { statHash: 2961396640, value: 5 },
              { statHash: 447667954, value: 5 },
            ],
          },
          {
            perkHash: 2203506855,
            stats: [
              { statHash: 2961396640, value: 6 },
              { statHash: 447667954, value: 6 },
            ],
          },
          {
            perkHash: 2203506854,
            stats: [
              { statHash: 2961396640, value: 7 },
              { statHash: 447667954, value: 7 },
            ],
          },
          {
            perkHash: 2203506857,
            stats: [
              { statHash: 2961396640, value: 8 },
              { statHash: 447667954, value: 8 },
            ],
          },
          {
            perkHash: 2203506856,
            stats: [
              { statHash: 2961396640, value: 9 },
              { statHash: 447667954, value: 9 },
            ],
          },
          {
            perkHash: 1639384016,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 3 },
              { statHash: 2961396640, value: 10 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
              { statHash: 447667954, value: 10 },
            ],
          },
          { perkHash: 892374263, stats: [{ statHash: 1591432999, value: 1 }] },
          { perkHash: 892374260, stats: [{ statHash: 1591432999, value: 2 }] },
          { perkHash: 892374261, stats: [{ statHash: 1591432999, value: 3 }] },
          { perkHash: 892374258, stats: [{ statHash: 1591432999, value: 4 }] },
          { perkHash: 892374259, stats: [{ statHash: 1591432999, value: 5 }] },
          { perkHash: 892374256, stats: [{ statHash: 1591432999, value: 6 }] },
          { perkHash: 892374257, stats: [{ statHash: 1591432999, value: 7 }] },
          { perkHash: 892374270, stats: [{ statHash: 1591432999, value: 8 }] },
          { perkHash: 892374271, stats: [{ statHash: 1591432999, value: 9 }] },
          {
            perkHash: 2993547493,
            stats: [
              { statHash: 1240592695, value: 3 },
              { statHash: 1591432999, value: 10 },
              { statHash: 2523465841, value: 3 },
              { statHash: 3614673599, value: 3 },
              { statHash: 155624089, value: 3 },
              { statHash: 943549884, value: 3 },
              { statHash: 4188031367, value: 3 },
            ],
          },
        ],
      },
      {
        socketTypeHash: 1282012138,
        intrinsicPerks: [
          { perkHash: 2285418970, stats: [] },
          { perkHash: 2302094943, stats: [] },
          { perkHash: 38912240, stats: [] },
        ],
        randomPerks: [],
        curatedPerks: [],
      },
    ])
  })
})
