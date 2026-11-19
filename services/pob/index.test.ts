/* eslint-disable @typescript-eslint/no-explicit-any */
import { toExportString } from './index';
import { decodeBuild } from './build';
import { matchMod } from './mods';
import { decodeExportString, fixture } from './test-utils';
import { describe, expect, it } from 'vitest';
import { deflateSync } from 'node:zlib';

const FIXTURES = {
  'elemental-hit-slayer-3.30.txt': { title: 'Elemental Hit Slayer', icon: 'slayer' },
  'frost-blades-champion-3.30.txt': { title: 'Frost Blades Champion', icon: 'champion' },
  'ice-trap-assasin-3.30.txt': { title: 'Ice Trap Assassin', icon: 'assassin' },
  'kinetic-blast-warden-3.30.txt': { title: 'Kinetic Blast Warden', icon: 'warden' },
  'righteous-fire-chieftain-3.30.txt': { title: 'Righteous Fire Chieftain', icon: 'chieftain' },
  'static-strike-luminary-3.30.txt': { title: 'Static Strike Luminary', icon: 'luminary' },
  'venom-gyre-gladiator-3.30.txt': { title: 'Venom Gyre Gladiator', icon: 'gladiator' },
};

const CLUSTER_ENCHANT = 'enchant.stat_3948993189';
const folderOf = async (name: string) => decodeExportString((await toExportString(await fixture(name))).exportString);
const tradeOf = async (name: string, title: string) => {
  const trade = (await folderOf(name)).trades.find(trade => trade.title === title);
  if (!trade) throw new Error(`No Trade "${title}" in ${name}`);
  return trade.query;
};

/** A Folder of one Build Item made from POB item text, in a belt slot */
const singleItem = async (itemText: string) => {
  const xml = `<PathOfBuilding><Build className="Witch" level="90"/><Items activeItemSet="1"><Item id="1">${itemText}</Item>
    <ItemSet id="1"><Slot name="Belt" itemId="1"/></ItemSet></Items></PathOfBuilding>`;
  return decodeExportString((await toExportString(deflateSync(xml).toString('base64url'))).exportString);
};

describe.each(Object.entries(FIXTURES))('%s', (name, expected) => {
  it('returns an Export String', async () => {
    expect((await toExportString(await fixture(name))).exportString).toMatch(/^3:/);
  });

  it('either matches every mod line of a non-unique item or reports it', async () => {
    const { unmatched } = await toExportString(await fixture(name));
    const items = (await decodeBuild(await fixture(name))).items.filter(({ slot }) => !slot.includes('Swap'));
    items.forEach(({ slot, item }) => {
      if (item.rarity === 'UNIQUE' || item.rarity === 'RELIC') return;
      const title = `${slot} — ${item.name}`;
      expect(item.mods.length, title).toBeGreaterThan(0);
      item.mods.forEach(({ text }, i) => {
        const [prev, next] = [item.mods[i - 1]?.text, item.mods[i + 1]?.text];
        // A stat can span two lines (cluster jewel enchants)
        const matched =
          matchMod(text) ?? (next && matchMod(`${text}\n${next}`)) ?? (prev && matchMod(`${prev}\n${text}`));
        if (!matched) expect(unmatched, title).toContain(`${title}: ${text}`);
      });
    });
  });

  it('builds one PoE 1 Folder titled with main skill and ascendancy', async () => {
    const { title, icon, version } = await folderOf(name);
    expect({ title, icon, version }).toEqual({ ...expected, version: '1' });
  });

  it('has one Trade per distinct Build Item', async () => {
    expect((await folderOf(name)).trades.map(trade => trade.title)).toMatchSnapshot();
  });

  it('gives every Trade an instant buyout query without a league', async () => {
    for (const { query } of (await folderOf(name)).trades) {
      expect(query.status).toEqual({ option: 'securable' });
      expect(JSON.stringify(query)).not.toMatch(/league/i);
    }
  });
});

describe('Build Items', () => {
  it('leaves out Skill Gems', async () => {
    const titles = (await folderOf('righteous-fire-chieftain-3.30.txt')).trades.map(trade => trade.title).join('\n');
    expect(titles).not.toMatch(/Righteous Fire|Elemental Focus|Lifetap/);
  });

  it('includes tree jewels and abyss jewels socketed in equipment', async () => {
    const titles = (await folderOf('righteous-fire-chieftain-3.30.txt')).trades.map(trade => trade.title);
    expect(titles).toContain('Boots Abyssal Socket 1 — Whispering Stare');
    expect(titles).toContain('Unique Jewel — Glorious Vanity');
  });
});

describe('Search Query', () => {
  it('searches a rare by category and base type', async () => {
    const query = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Helmet — Foe Corona');
    expect(query.type).toBe('Giantslayer Helmet');
    expect(query.filters.type_filters).toEqual({ filters: { category: { option: 'armour.helmet' } } });
  });

  it('derives a magic item base type from its name', async () => {
    const query = await tradeOf(
      'righteous-fire-chieftain-3.30.txt',
      "Flask 2 — Abecedarian's Granite Flask of the Rainbow",
    );
    expect(query.type).toBe('Granite Flask');
    expect(query.filters.type_filters).toEqual({ filters: { category: { option: 'flask' } } });
  });

  it('maps every ring slot to the ring category', async () => {
    const query = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Ring 1 — Hypnotic Circle');
    expect(query.filters.type_filters.filters.category).toEqual({ option: 'accessory.ring' });
  });

  it('searches a unique by name only', async () => {
    expect(await tradeOf('righteous-fire-chieftain-3.30.txt', "Unique Body Armour — Kaom's Heart")).toEqual({
      status: { option: 'securable' },
      name: "Kaom's Heart",
    });
  });

  it('searches a Foulborn unique by its plain name with the Foulborn flag and a filter per Mutated Mod', async () => {
    expect(await tradeOf('elemental-hit-slayer-3.30.txt', 'Unique Body Armour — Foulborn Skin of the Lords')).toEqual({
      status: { option: 'securable' },
      name: 'Skin of the Lords',
      filters: { misc_filters: { filters: { mutated: { option: 'true' } } } },
      stats: [{ type: 'and', filters: expect.any(Array) }],
    });
  });

  it('scales a Mutated Mod by the Min Factor, keeping a minimum of 1', async () => {
    const { stats } = await tradeOf('ice-trap-assasin-3.30.txt', "Unique Ring — Foulborn Romira's Banquet");
    expect(stats).toHaveLength(1);
    expect(stats[0].filters.map((filter: any) => filter.value)).toEqual(
      Array(stats[0].filters.length).fill({ min: 1 }),
    );
  });

  it('searches a unique jewel by all its mods, leaving out the variants it has not selected', async () => {
    const watchersEye = `Rarity: UNIQUE
Watcher's Eye
Prismatic Jewel
Variant: Precision
Variant: Malevolence
Variant: Purity of Ice
Variant: Malevolence Recovery
Has Alt Variant: true
Has Alt Variant Two: true
Selected Variant: 1
Selected Alt Variant: 2
Selected Alt Variant Two: 3
Implicits: 0
5% increased maximum Energy Shield
{variant:1}14% increased Attack Speed while affected by Precision
{variant:2}+18% to Damage over Time Multiplier while affected by Malevolence
{variant:3}Unaffected by Chilled Ground while affected by Purity of Ice
{variant:4}10% increased Recovery rate of Life and Energy Shield while affected by Malevolence`;
    const { query } = (await singleItem(watchersEye)).trades[0]!;
    expect(query.name).toBe("Watcher's Eye");
    // Unique jewels roll random mods (Watcher's Eye auras by item level), so the fixed Energy Shield line counts too;
    // one mod of one type each: they are all required, so they share one and group
    expect(query.stats).toEqual([
      {
        type: 'and',
        filters: [
          { id: 'explicit.stat_2482852589', value: { min: 4 } },
          { id: expect.stringMatching(/^explicit\./), value: { min: 11 } },
          { id: expect.stringMatching(/^explicit\./), value: { min: 14 } },
          { id: expect.stringMatching(/^explicit\./) },
        ],
      },
    ]);
  });

  it("searches a Watcher's Eye without variant data by its fixed and aura mods alike", async () => {
    const { name, stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', "Unique Jewel — Watcher's Eye");
    expect(name).toBe("Watcher's Eye");
    // The Energy Shield, Life and Mana lines every Watcher's Eye has, then its three aura mods
    expect(stats).toHaveLength(1);
    expect(stats[0].filters).toHaveLength(6);
  });

  it('searches a unique whose variants are only versions by its name only', async () => {
    const query = (
      await singleItem(`Rarity: UNIQUE
Atziri's Disfavour
Vaal Axe
Variant: Pre 3.19.0
Variant: Current
Selected Variant: 2
Implicits: 0
{variant:1}Gain 1 Rage on Hit
{variant:2}+25 to maximum Life`)
    ).trades[0]!.query;
    expect(query).toEqual({ status: { option: 'securable' }, name: "Atziri's Disfavour" });
  });

  it('searches a relic as a unique', async () => {
    expect(await tradeOf('righteous-fire-chieftain-3.30.txt', 'Unique Belt — Mageblood')).toEqual({
      status: { option: 'securable' },
      name: 'Mageblood',
    });
  });
});

describe('Minimum values', () => {
  it('rounds every minimum down to an integer, except the sum of a weight group', async () => {
    const { query } = (
      await singleItem(
        `Rarity: RARE\nDoom Eye\nCoral Ring\nItem Level: 80\nImplicits: 0\n+13% to Fire Resistance\n12% increased Mana Regeneration Rate`,
      )
    ).trades[0]!;
    const [pseudo, count, weight] = query.stats;
    expect(pseudo.filters).toEqual([{ id: 'pseudo.pseudo_total_fire_resistance', value: { min: 10 } }]);
    expect(count.filters.map((filter: any) => filter.value)).toEqual(Array(count.filters.length).fill({ min: 9 }));
    expect(weight.value).toEqual({ min: 9.6 });
  });

  it('keeps a minimum of at least 1 for a stat that rolled 1 or more', async () => {
    const { query } = (
      await singleItem(
        `Rarity: RARE\nDoom Eye\nCoral Ring\nItem Level: 80\nImplicits: 0\n1% increased Mana Regeneration Rate`,
      )
    ).trades[0]!;
    expect(query.stats[0].filters[0].value).toEqual({ min: 1 });
  });
});

describe('Cluster jewel enchants', () => {
  const cluster = async (base: string, ...enchants: string[]) =>
    (
      await singleItem(
        `Rarity: RARE\nOblivion Stone\n${base}\nCluster Jewel Skill: affliction_axe_and_sword_damage\nItem Level: 84\nImplicits: ${enchants.length}\n${enchants.map(line => `{crafted}${line}`).join('\n')}\nAdded Small Passive Skills also grant: +2 to Dexterity`,
      )
    ).trades[0]!.query.stats;
  const filtersOf = (stats: any[], stat: string) =>
    stats.flatMap(group => group.filters).filter(filter => filter.id.endsWith(stat));

  it.each([
    ['Large', 12],
    ['Medium', 5],
    ['Small', 3],
  ])('titles a %s Cluster Jewel Trade by size, name and skill', async (size, passives) => {
    const { trades } = await singleItem(
      `Rarity: RARE\nOblivion Stone\n${size} Cluster Jewel\nCluster Jewel Skill: affliction_trap_and_mine_damage\nItem Level: 84\nImplicits: 1\n{crafted}Adds ${passives} Passive Skills`,
    );
    expect(trades[0]!.title).toBe(`${size} Cluster — Oblivion Stone (Trap And Mine Damage)`);
  });

  it('leaves the missing parts out of a Cluster Jewel title', async () => {
    const { trades } = await singleItem(
      'Rarity: RARE\nOblivion Stone\nLarge Cluster Jewel\nItem Level: 84\nImplicits: 0',
    );
    expect(trades[0]!.title).toBe('Large Cluster — Oblivion Stone');
  });

  it('searches an enchant by its enchant stat alone, with its exact value', async () => {
    const stats = await cluster(
      'Large Cluster Jewel',
      'Adds 12 Passive Skills',
      '2 Added Passive Skills are Jewel Sockets',
    );
    expect(filtersOf(stats, 'stat_4079888060')).toEqual([{ id: 'enchant.stat_4079888060', value: { min: 2 } }]);
  });

  it('puts every enchant into one and group that is on', async () => {
    const stats = await cluster(
      'Large Cluster Jewel',
      'Adds 12 Passive Skills',
      '2 Added Passive Skills are Jewel Sockets',
      'Added Small Passive Skills grant: Axe Attacks deal 12% increased Damage with Hits and Ailments',
      'Added Small Passive Skills grant: Sword Attacks deal 12% increased Damage with Hits and Ailments',
    );
    expect(stats.filter((group: any) => group.type === 'and')).toEqual([
      {
        type: 'and',
        filters: [
          { id: 'enchant.stat_3086156145', value: { min: 12 } },
          { id: 'enchant.stat_4079888060', value: { min: 2 } },
          { id: 'enchant.stat_3948993189', value: { option: 1 } },
        ],
      },
    ]);
    // No enchant is left in a count group of its own
    expect(
      stats
        .filter((group: any) => group.type === 'count')
        .flatMap((group: any) => group.filters.map((filter: any) => filter.id)),
    ).not.toContainEqual(expect.stringMatching(/^enchant\./));
  });

  it('turns the explicit mods into count groups that are on', async () => {
    const groups = (await cluster('Large Cluster Jewel', 'Adds 12 Passive Skills')).filter(
      (group: any) => group.type === 'count',
    );
    expect(groups.length).toBeGreaterThan(0);
    expect(groups.every((group: any) => group.disabled === false)).toBe(true);
  });

  it('searches the cluster skill enchant by its enchant stat alone', async () => {
    const stats = await cluster(
      'Large Cluster Jewel',
      'Added Small Passive Skills grant: Axe Attacks deal 12% increased Damage with Hits and Ailments',
      'Added Small Passive Skills grant: Sword Attacks deal 12% increased Damage with Hits and Ailments',
    );
    expect(filtersOf(stats, 'stat_3948993189')).toEqual([{ id: 'enchant.stat_3948993189', value: { option: 1 } }]);
  });

  it.each([
    ['Large Cluster Jewel', 8, { max: 8 }],
    ['Large Cluster Jewel', 12, { min: 12 }],
    ['Medium Cluster Jewel', 4, { max: 4 }],
    ['Medium Cluster Jewel', 5, { min: 5 }],
    ['Small Cluster Jewel', 2, { max: 2 }],
    ['Small Cluster Jewel', 3, { min: 3 }],
  ])('limits the passive count of a %s with %i passives to %j', async (base, count, value) => {
    expect(filtersOf(await cluster(base, `Adds ${count} Passive Skills`), 'stat_3086156145')).toEqual([
      { id: 'enchant.stat_3086156145', value },
    ]);
  });
});

describe('Flask enchants', () => {
  // POB tags a flask's enchants {crafted} and lists them as implicits
  const flask = `Rarity: MAGIC\nAlchemist's Silver Flask of the Rainbow\nItem Level: 84\nImplicits: 2\n{crafted}70% increased effect\n{crafted}Gains no Charges during Effect\n27% reduced Duration\n25% increased effect`;

  it('searches an enchant by its enchant stat alone, with its exact value, switched off', async () => {
    const { stats } = (await singleItem(flask)).trades[0]!.query;
    expect(stats[0]).toEqual({
      type: 'and',
      filters: [
        { id: 'enchant.stat_2448920197', value: { min: 70 }, disabled: true },
        { id: 'enchant.stat_4123533923', disabled: true },
      ],
    });
  });
});

describe('Unique flask enchants', () => {
  it('adds the enchants of a Unique flask as Disabled Filters with their exact values, next to its name', async () => {
    const query = await tradeOf('ice-trap-assasin-3.30.txt', 'Unique Flask — Bottled Faith');
    expect(query.name).toBe('Bottled Faith');
    expect(query.stats).toEqual([
      {
        type: 'and',
        filters: [
          { id: 'enchant.stat_2448920197', value: { min: 69 }, disabled: true },
          { id: 'enchant.stat_4123533923', disabled: true },
        ],
      },
    ]);
  });
});

describe('Base jewel mod types', () => {
  const jewel = singleItem(
    `Rarity: RARE\nBramble Joy\nViridian Jewel\nItem Level: 81\nImplicits: 1\nCorrupted Blood cannot be inflicted on you\n10% increased Melee Damage\nCorrupted`,
  ).then(item => item.trades[0]!.query.stats);
  const idsOf = async (stat: string) =>
    (await jewel).find((group: any) => group.filters[0].id.endsWith(stat)).filters.map((filter: any) => filter.id);

  it('searches the corrupted implicit as an implicit only', async () => {
    expect(await idsOf('stat_1658498488')).toEqual(['implicit.stat_1658498488']);
  });

  it('searches an explicit as an explicit or fractured mod: a jewel has no crafted mods, enchants or implicits of that kind', async () => {
    expect(await idsOf('stat_1002362373')).toEqual(['explicit.stat_1002362373', 'fractured.stat_1002362373']);
  });
});

describe('Forbidden Flame and Flesh', () => {
  const pair = ['explicit.stat_2460506030', 'explicit.stat_1190333629'].map(id => ({ id, value: { option: 3184 } }));

  it('searches the pair by the ascendancy node alone, so a find on either jewel counts', async () => {
    const forbidden = (name: string, other: string) =>
      `Rarity: UNIQUE\n${name}\nCrimson Jewel\nItem Level: 85\nImplicits: 0\nAllocates Headsman if you have the matching modifier on Forbidden ${other}\nCorrupted`;
    for (const [name, other] of [
      ['Forbidden Flame', 'Flesh'],
      ['Forbidden Flesh', 'Flame'],
    ] as const) {
      const { query } = (await singleItem(forbidden(name, other))).trades[0]!;
      expect(query).toEqual({
        status: { option: 'securable' },
        stats: [{ type: 'count', value: { min: 1 }, disabled: false, filters: expect.arrayContaining(pair) }],
      });
    }
  });
});

describe('Unique titles', () => {
  const titles = async (name: string) => (await folderOf(name)).trades.map(trade => trade.title);

  it('prefixes a Unique with its category, without the slot number', async () => {
    expect(await titles('ice-trap-assasin-3.30.txt')).toEqual(
      expect.arrayContaining([
        'Unique Ring — Winterweave',
        "Unique Belt — The Arkhon's Tools",
        'Unique Jewel — Militant Faith',
      ]),
    );
  });

  it('leaves a non-Unique as it is', async () => {
    expect(await titles('ice-trap-assasin-3.30.txt')).toContain("Flask 5 — Abecedarian's Diamond Flask of Penetrating");
  });
});

describe('Cluster jewel titles', () => {
  it('names the skill of a cluster jewel even when its POB id ends in an underscore', async () => {
    // POB: "Cluster Jewel Skill: affliction_attack_damage_while_dual_wielding_"
    const titles = (await folderOf('static-strike-luminary-3.30.txt')).trades.map(trade => trade.title);
    expect(titles.some(title => title.endsWith('(Attack Damage While Dual Wielding)'))).toBe(true);
  });
});

describe('Forbidden Flame and Flesh title', () => {
  it('names the Trade after the pair, since the search finds either jewel', async () => {
    const titles = (await folderOf('elemental-hit-slayer-3.30.txt')).trades
      .map(trade => trade.title)
      .filter(title => title.includes('Forbidden'));
    expect(titles).toEqual(['Unique Jewel — Forbidden Flame / Flesh']);
  });
});

describe('Timeless jewels', () => {
  const seedGroup = async (name: string, title: string, seed: number, ids: string[]) => {
    const query = await tradeOf(name, title);
    expect(query.name).toBe(title.split(' — ')[1]);
    expect(query.stats).toEqual([
      {
        type: 'count',
        value: { min: 1 },
        filters: ids.map(id => ({ id: `explicit.pseudo_timeless_jewel_${id}`, value: { min: seed, max: seed } })),
      },
    ]);
  };

  it('searches by name plus one count group holding every conqueror seed stat', async () => {
    await seedGroup('righteous-fire-chieftain-3.30.txt', 'Unique Jewel — Glorious Vanity', 5330, [
      'doryani',
      'ahuana',
      'xibaqua',
    ]);
    await seedGroup('elemental-hit-slayer-3.30.txt', 'Unique Jewel — Lethal Pride', 14861, [
      'akoya',
      'kaom',
      'rakiata',
    ]);
  });

  it('ignores the jewel mods that follow the seed lines', async () => {
    await seedGroup('ice-trap-assasin-3.30.txt', 'Unique Jewel — Militant Faith', 9499, [
      'avarius',
      'dominus',
      'maxarius',
    ]);
  });
});

describe('Impossible Escape', () => {
  it('searches by its keystone, a stat written over three lines', async () => {
    const query = await tradeOf('frost-blades-champion-3.30.txt', 'Unique Jewel — Impossible Escape');
    // The keystone node is the option of the stat: Elemental Equilibrium
    expect(query.stats).toEqual([
      { type: 'and', filters: [{ id: 'explicit.stat_2422708892', value: { option: 39085 } }] },
    ]);
  });
});

describe('Disabled Filters for item properties', () => {
  it('adds item level, sockets, links, defences and influences of a rare, all disabled', async () => {
    const query = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Helmet — Foe Corona');
    expect(query.filters.misc_filters).toEqual({ disabled: true, filters: { ilvl: { min: 85 } } });
    expect(query.filters.socket_filters).toEqual({
      disabled: true,
      filters: { sockets: { min: 4 }, links: { min: 4 } },
    });
    expect(query.filters.armour_filters).toEqual({ disabled: true, filters: { ar: { min: 773 } } });
    expect(query.stats[0].filters).toContainEqual({ id: 'pseudo.pseudo_has_elder_influence', disabled: true });
  });

  it('adds every defence and the Eldritch influences', async () => {
    const query = await tradeOf('elemental-hit-slayer-3.30.txt', 'Helmet — Eagle Glance');
    expect(query.filters.armour_filters).toEqual({ disabled: true, filters: { ar: { min: 562 }, ev: { min: 482 } } });
    expect(query.filters.misc_filters).toEqual({
      disabled: true,
      filters: { ilvl: { min: 85 }, searing_item: { option: 'true' }, tangled_item: { option: 'true' } },
    });
    const and = query.stats.filter((group: any) => group.type === 'and');
    expect(and).toHaveLength(1);
    // The totals, and the ring's implicit that is required on its own
    for (const { id } of and[0].filters) expect(id).toMatch(/^(pseudo\.pseudo_total_|implicit\.)/);
  });

  it('counts links within socket groups and leaves out abyss sockets', async () => {
    const query = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Boots — Torment March');
    expect(query.filters.socket_filters).toEqual({
      disabled: true,
      filters: { sockets: { min: 3 }, links: { min: 3 } },
    });
  });

  it('adds the corrupted state', async () => {
    const query = await tradeOf('ice-trap-assasin-3.30.txt', 'Jewel — Viper Eye');
    expect(query.filters.misc_filters).toEqual({
      disabled: true,
      filters: { ilvl: { min: 84 }, corrupted: { option: 'true' } },
    });
  });

  it('leaves out properties the item does not have', async () => {
    const query = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Ring 1 — Hypnotic Circle');
    expect(query.filters.misc_filters).toEqual({ disabled: true, filters: { ilvl: { min: 84 } } });
    expect(query.filters.socket_filters).toBeUndefined();
    expect(query.filters.armour_filters).toBeUndefined();
    const and = query.stats.filter((group: any) => group.type === 'and');
    expect(and).toHaveLength(1);
    // The totals, and the ring's implicit that is required on its own
    for (const { id } of and[0].filters) expect(id).toMatch(/^(pseudo\.pseudo_total_|implicit\.)/);
  });

  it('adds none to uniques', async () => {
    const query = await tradeOf('righteous-fire-chieftain-3.30.txt', "Unique Body Armour — Kaom's Heart");
    expect(query.filters).toBeUndefined();
  });
});

describe('Duplicate Trades', () => {
  it('keeps one Trade for items with the same mods and different rolls or names', async () => {
    const ring = (name: string, life: number) =>
      `Rarity: RARE\n${name}\nCoral Ring\nItem Level: 80\nImplicits: 0\n${life}% increased maximum Life`;
    const xml = `<PathOfBuilding><Build className="Witch" level="90"/><Items activeItemSet="1">
      <Item id="1">${ring('Doom Eye', 5)}</Item><Item id="2">${ring('Gloom Eye', 7)}</Item>
      <ItemSet id="1"><Slot name="Ring 1" itemId="1"/><Slot name="Ring 2" itemId="2"/></ItemSet></Items></PathOfBuilding>`;
    const { trades } = decodeExportString((await toExportString(deflateSync(xml).toString('base64url'))).exportString);
    expect(trades.map(trade => trade.title)).toEqual(['Ring 1 — Doom Eye']);
  });
});

describe('Weapon swap', () => {
  it('adds the swap weapons as Trades titled with their swap slot', async () => {
    const titles = (await folderOf('elemental-hit-slayer-3.30.txt')).trades.map(trade => trade.title);
    expect(titles).toContain('Weapon 1 Swap — Dusk Sever');
    expect(titles).toContain('Weapon 2 Swap — Corpse Beak');
  });

  it('searches a swap weapon like any other weapon', async () => {
    const query = await tradeOf('kinetic-blast-warden-3.30.txt', 'Weapon 1 Swap — Grove Bow');
    expect(query.filters.type_filters.filters.category).toEqual({ option: 'weapon.bow' });
  });
});

describe('Stat Filters', () => {
  it('turns an explicit mod into a count group that is on over all its type variants', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Helmet — Foe Corona');
    expect(stats).toContainEqual({
      type: 'count',
      value: { min: 1 },
      disabled: false,
      filters: ['explicit', 'implicit', 'fractured', 'crafted'].map(type => ({
        id: `${type}.stat_3325883026`,
        value: { min: 8 },
      })),
    });
  });

  it('switches both implicit and explicit groups on', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Ring 1 — Hypnotic Circle');
    const group = (id: string) => stats.find((group: any) => group.filters.some((filter: any) => filter.id === id));
    // The implicit is a plain filter of the and group, switched on; the explicit alternatives are a count group, on
    expect(group('implicit.stat_3182714256')?.type).toBe('and');
    expect(stats[0].filters.find((filter: any) => filter.id === 'implicit.stat_3182714256').disabled).toBeUndefined();
    expect(group('explicit.stat_3988349707')?.disabled).toBe(false);
  });

  it('matches a two-line cluster jewel enchant as one option filter', async () => {
    const { stats } = await tradeOf(
      'ice-trap-assasin-3.30.txt',
      'Medium Cluster — Plague Essence (Trap And Mine Damage)',
    );
    expect(stats).toContainEqual(
      expect.objectContaining({
        type: 'and',
        filters: expect.arrayContaining([{ id: CLUSTER_ENCHANT, value: { option: expect.any(Number) } }]),
      }),
    );
  });

  it('leaves uniques without Stat Filters', async () => {
    expect(
      (await tradeOf('righteous-fire-chieftain-3.30.txt', "Unique Body Armour — Kaom's Heart")).stats,
    ).toBeUndefined();
  });
});

describe('Aggregate Jewel Trade', () => {
  const TITLE = 'Jewels — combined';
  /** A build with the given tree jewels, each a [name, base, rarity, mod lines] */
  const jewelBuild = (jewels: [string, string, string, string[]][], extra = '') => {
    const items = jewels
      .map(
        ([name, base, rarity, mods], i) =>
          `<Item id="${i + 1}">Rarity: ${rarity}\n${name}\n${base}\nImplicits: 0\n${mods.join('\n')}</Item>`,
      )
      .join('');
    const sockets = jewels.map((_, i) => `<Socket nodeId="${i + 1}" itemId="${i + 1}"/>`).join('');
    const nodes = jewels.map((_, i) => i + 1).join(',');
    const xml = `<PathOfBuilding><Build className="Witch" level="90"/><Items activeItemSet="1">${items}<ItemSet id="1"/></Items>
      <Tree activeSpec="1"><Spec nodes="${nodes}"><Sockets>${sockets}</Sockets></Spec></Tree>${extra}</PathOfBuilding>`;
    return deflateSync(xml).toString('base64url');
  };
  const aggregate = async (code: string) =>
    decodeExportString((await toExportString(code)).exportString).trades.filter(trade => trade.title === TITLE);
  const ids = (group: any) => group.filters.map((filter: any) => filter.id);

  const LIFE = '5% increased maximum Life';
  const CRIT = '+15% to Critical Strike Multiplier with Elemental Skills';
  const SPEED = '4% increased Attack Speed';
  const RES = '+15% to Lightning Resistance';
  const base = (name: string, mods: string[]): [string, string, string, string[]] => [
    name,
    'Viridian Jewel',
    'RARE',
    mods,
  ];

  it('adds one Trade with the deduplicated mod union as a single count group without values', async () => {
    const [trade, ...rest] = await aggregate(jewelBuild([base('A', [LIFE, CRIT]), base('B', [CRIT, SPEED, RES])]));
    expect(rest).toEqual([]);
    expect(trade!.query.status).toEqual({ option: 'securable' });
    expect(trade!.query.filters).toEqual({ type_filters: { filters: { category: { option: 'jewel.base' } } } });
    const [group, ...others] = trade!.query.stats;
    expect(others.map((other: any) => other.type)).toEqual(['weight']);
    expect(group.type).toBe('count');
    // Each distinct mod in its explicit and fractured variants (an implicit is only on a corrupted jewel), with no value
    const expected = [...new Set([LIFE, CRIT, SPEED, RES].flatMap(line => matchMod(line)!.ids))].filter(id =>
      /^(explicit|fractured)\./.test(id),
    );
    expect(group.filters).toEqual(expected.map(id => ({ id })));
    expect(new Set(ids(group).map((id: string) => id.split('.')[0]))).toEqual(new Set(['explicit', 'fractured']));
  });

  it('adds the implicit variant only of the mods a corrupted jewel can have as an implicit', async () => {
    const HINDER = 'You cannot be Hindered';
    const [trade] = await aggregate(jewelBuild([base('A', [LIFE, HINDER])]));
    const implicits = ids(trade!.query.stats[0]).filter((id: string) => id.startsWith('implicit.'));
    // Hindered is a corruption implicit; the Life of this jewel can only be explicit
    expect(implicits).toEqual(matchMod(HINDER)!.ids.filter(id => id.startsWith('implicit.')));
    expect(matchMod(LIFE)!.ids.some(id => id.startsWith('implicit.'))).toBe(true);
  });

  it('searches an immunity, which no jewel has but through corruption, by its implicit variant alone', async () => {
    const [trade] = await aggregate(
      jewelBuild([base('A', [LIFE, 'Corrupted Blood cannot be inflicted on you', 'You cannot be Hindered'])]),
    );
    expect(ids(trade!.query.stats[0]).filter((id: string) => /stat_(1658498488|721014846)$/.test(id))).toEqual([
      'implicit.stat_1658498488',
      'implicit.stat_721014846',
    ]);
  });

  it('adds a weight group of the explicit mods, worth the most valuable jewel', async () => {
    const [trade] = await aggregate(jewelBuild([base('A', [LIFE]), base('B', [LIFE, CRIT])]));
    const weight = trade!.query.stats.find((group: any) => group.type === 'weight');
    // Without the implicit variants, each with weight 1
    const expected = [LIFE, CRIT].flatMap(line => matchMod(line)!.ids).filter(id => /^(explicit|fractured)\./.test(id));
    expect(weight.filters).toEqual(expected.map(id => ({ id, value: { weight: 1 } })));
    // B's values 5 + 15, at 80%
    expect(weight.value).toEqual({ min: 16 });
  });

  it('takes min from the most matched mods on one jewel, clamped to 2-4', async () => {
    const min = async (mods: string[]) => (await aggregate(jewelBuild([base('A', mods)])))[0]!.query.stats[0].value.min;
    expect(await min([LIFE])).toBe(2);
    expect(await min([LIFE, CRIT, SPEED])).toBe(3);
    expect(await min([LIFE, CRIT, SPEED, RES, '+7% to Fire Damage over Time Multiplier'])).toBe(4);
  });

  it('does not count a mod that has no explicit, fractured or implicit variant', async () => {
    const enchantOnly = '10% chance to Blind Enemies on Hit with Spells';
    expect(matchMod(enchantOnly)!.ids.every(id => id.startsWith('enchant.'))).toBe(true);
    const [trade] = await aggregate(jewelBuild([base('A', [LIFE, CRIT, SPEED, enchantOnly])]));
    expect(trade!.query.stats[0].value.min).toBe(3);
  });

  it('counts only matched mods', async () => {
    const [trade] = await aggregate(jewelBuild([base('A', [LIFE, CRIT, SPEED, 'Not a real mod line'])]));
    expect(trade!.query.stats[0].value.min).toBe(3);
  });

  it('is built from base jewels only', async () => {
    const build = jewelBuild([
      base('A', [LIFE]),
      ['Combat Focus', 'Viridian Jewel', 'UNIQUE', [SPEED]],
      ['Viper Spark', 'Large Cluster Jewel', 'RARE', [RES]],
      ['Grim Thirst', 'Searching Eye Jewel', 'RARE', ['3% increased Attack Speed']],
      ['Glorious Vanity', 'Timeless Jewel', 'UNIQUE', ['Historic']],
    ]);
    const [trade] = await aggregate(build);
    // Same mods as the lone base jewel A: the other four jewels add nothing
    expect(trade!.query.stats[0].filters).toEqual(
      (await aggregate(jewelBuild([base('A', [LIFE])])))[0]!.query.stats[0].filters,
    );
  });

  it('is left out when the build has no base jewels', async () => {
    expect(await aggregate(jewelBuild([['Viper Spark', 'Large Cluster Jewel', 'RARE', [RES]]]))).toEqual([]);
    expect(await aggregate(jewelBuild([]))).toEqual([]);
    expect(await aggregate(await fixture('kinetic-blast-warden-3.30.txt'))).toEqual([]);
  });

  it('sits after the per-jewel Trades', async () => {
    const titles = (await folderOf('righteous-fire-chieftain-3.30.txt')).trades.map(trade => trade.title);
    const lastJewel = titles.findLastIndex(title => /^(Unique )?Jewel — /.test(title));
    expect(titles.indexOf(TITLE)).toBe(lastJewel + 1);
  });
});

describe('Pseudo totals', () => {
  const ids = (stats: any[]) => stats.flatMap((group: any) => group.filters.map((filter: any) => filter.id));

  it('folds life and resistances into an and group that is on', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Gloves — Honour Mitts');
    expect(stats[0]).toEqual({
      type: 'and',
      filters: [
        { id: 'pseudo.pseudo_total_life', value: { min: 97 } },
        { id: 'pseudo.pseudo_total_fire_resistance', value: { min: 37 } },
        { id: 'pseudo.pseudo_total_chaos_resistance', value: { min: 23 } },
      ],
    });
  });

  it('does not search a folded mod on its own', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Gloves — Honour Mitts');
    for (const stat of ['stat_3299347043', 'stat_3372524247', 'stat_2923486259']) {
      expect(ids(stats).filter(id => id.endsWith(stat))).toEqual([]);
    }
  });

  it('splits hybrid attributes into each attribute total', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Boots Abyssal Socket 1 — Whispering Stare');
    expect(stats[0].filters).toEqual([
      { id: 'pseudo.pseudo_total_life', value: { min: 29 } },
      { id: 'pseudo.pseudo_total_dexterity', value: { min: 8 } },
      { id: 'pseudo.pseudo_total_intelligence', value: { min: 8 } },
    ]);
  });

  it('keeps influences in the same and group, disabled, next to the mods that are on', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Helmet — Foe Corona');
    expect(stats.filter((group: any) => group.type === 'and')).toEqual([
      {
        type: 'and',
        filters: [
          { id: 'pseudo.pseudo_total_life', value: { min: 113 } },
          { id: 'pseudo.pseudo_has_elder_influence', disabled: true },
          // A mod of a single stat is a filter of the group too, on like its count group
          { id: 'explicit.effect_1200122555', value: { min: 16 } },
        ],
      },
    ]);
  });
});

describe('Weight Group', () => {
  it('weighs every explicit mod not folded into pseudo, in all its variants, against the scaled sum', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Amulet — Corruption Rosary');
    expect(stats.at(-1)).toEqual({
      type: 'weight',
      value: { min: 35.2 },
      filters: ['explicit', 'implicit', 'fractured', 'enchant'].map(type => ({
        id: `${type}.stat_3988349707`,
        value: { weight: 1 },
      })),
    });
  });

  it('sums the values of several mods', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Gloves — Honour Mitts');
    const weight = stats.find((group: any) => group.type === 'weight');
    // Life regeneration rate 20, area of effect 16, area damage 20, damage during flask effect 28
    expect(weight.value).toEqual({ min: 67.2 });
    expect(weight.filters.every((filter: any) => filter.value.weight === 1)).toBe(true);
  });

  it('leaves out implicits and mods without a value', async () => {
    const { stats } = await tradeOf('righteous-fire-chieftain-3.30.txt', 'Ring 1 — Hypnotic Circle');
    const weight = stats.find((group: any) => group.type === 'weight');
    // Damage over time multiplier 23, physical damage against you 8 (average), increased damage 37; minus mana has no value
    expect(weight.value).toEqual({ min: 54.4 });
    expect(JSON.stringify(weight)).not.toMatch(/implicit\.stat_3182714256|stat_1050105434/);
  });
});
