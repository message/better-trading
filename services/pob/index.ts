// Ported from pob2bt (src/index.ts): Build Code to a BT Export String. Skill Gem Trades (`--gems`) are left out
import { decodeBuild } from './build';
import { matchMod, matchTimeless } from './mods';
import { Base64 } from 'js-base64';
import type { BuildItem, Influence, Item, Mod } from './build';
import type { ModMatch } from './mods';

interface Result {
  exportString: string;
  /** Mod lines that could not be matched to a trade stat */
  unmatched: string[];
}

type Report = (line: string) => void;
type StatValue = { min: number } | { max: number } | undefined;
interface StatFilter {
  id: string;
  value?: object;
  disabled?: boolean;
}
interface StatGroup {
  type: 'and' | 'count' | 'weight';
  value?: { min: number };
  disabled?: boolean;
  filters: StatFilter[];
}

// BT's PoE 1 ascendancy folder icons
const ICONS = new Set([
  'slayer',
  'gladiator',
  'champion',
  'assassin',
  'saboteur',
  'trickster',
  'juggernaut',
  'berserker',
  'chieftain',
  'necromancer',
  'elementalist',
  'occultist',
  'deadeye',
  'raider',
  'pathfinder',
  'guardian',
  'hierophant',
  'inquisitor',
  'ascendant',
  'warden',
  'reliquarian',
  'luminary',
]);

// ponytail: a fixed list; other uniques with variants are only versions of the same item
const VARIANT_UNIQUES = new Set(["Watcher's Eye", 'Impossible Escape', 'Thread of Hope']);
const PAIRED_UNIQUES = new Set(['Forbidden Flame', 'Forbidden Flesh']);

/** Shaper, Elder and Conqueror influences are pseudo stats; the Eldritch ones are misc filters */
const INFLUENCE_STATS: Partial<Record<Influence, string>> = {
  Shaper: 'pseudo.pseudo_has_shaper_influence',
  Elder: 'pseudo.pseudo_has_elder_influence',
  Crusader: 'pseudo.pseudo_has_crusader_influence',
  Redeemer: 'pseudo.pseudo_has_redeemer_influence',
  Hunter: 'pseudo.pseudo_has_hunter_influence',
  Warlord: 'pseudo.pseudo_has_warlord_influence',
};

/** Stats folded into pseudo totals, by trade stat number: the `pseudo.pseudo_total_*` totals each adds to */
// ponytail: the site's total life also counts Strength / 2; left out so the minimum never exceeds the item's own total
const PSEUDO_TOTALS: Record<string, string[]> = {
  stat_3299347043: ['life'],
  stat_3372524247: ['fire_resistance'],
  stat_4220027924: ['cold_resistance'],
  stat_1671376347: ['lightning_resistance'],
  stat_2923486259: ['chaos_resistance'],
  stat_2901986750: ['fire_resistance', 'cold_resistance', 'lightning_resistance'],
  stat_2915988346: ['fire_resistance', 'cold_resistance'],
  stat_3441501978: ['fire_resistance', 'lightning_resistance'],
  stat_4277795662: ['cold_resistance', 'lightning_resistance'],
  stat_378817135: ['fire_resistance', 'chaos_resistance'],
  stat_3393628375: ['cold_resistance', 'chaos_resistance'],
  stat_3465022881: ['lightning_resistance', 'chaos_resistance'],
  stat_4080418644: ['strength'],
  stat_3261801346: ['dexterity'],
  stat_328541901: ['intelligence'],
  stat_1379411836: ['strength', 'dexterity', 'intelligence'],
  stat_538848803: ['strength', 'dexterity'],
  stat_1535626285: ['strength', 'intelligence'],
  stat_2300185227: ['dexterity', 'intelligence'],
};

// The fewest passives each cluster size is sold with: a jewel with the fewest is wanted at most that, any more at least that
const FEWEST_PASSIVES: Record<string, number> = { Large: 8, Medium: 4, Small: 2 };

// What a Viridian, Cobalt, Crimson or Prismatic Jewel can get from corruption (poedb); no other mod is ever its implicit
const JEWEL_CORRUPTION_LINES = [
  'Corrupted Blood cannot be inflicted on you',
  'You cannot be Hindered',
  '6% increased Effect of Non-Damaging Ailments',
  '4% increased Area of Effect',
  '9% increased Global Critical Strike Chance',
  '4% increased Damage',
  'You cannot be Maimed',
  'Minions deal 4% increased Damage',
  '2% increased Reservation Efficiency of Skills',
  'You cannot be Cursed with Silence',
  'Damage Penetrates 1% Fire Resistance',
  'Damage Penetrates 1% Cold Resistance',
  'Damage Penetrates 1% Lightning Resistance',
  'Damage Penetrates 1% Elemental Resistances',
  'Hits have 12% chance to ignore Enemy Physical Damage Reduction',
  '22% reduced Ignite Duration on you',
  '22% reduced Effect of Chill on you',
  '22% reduced Effect of Shock on you',
  '22% reduced Poison Duration on you',
  '22% reduced Bleed Duration on you',
  '22% reduced Effect of Curses on you',
];
// Immunities are in no jewel's normal mod pool: only corruption gives them
const JEWEL_IMPLICIT_ONLY_LINES = [
  'Corrupted Blood cannot be inflicted on you',
  'You cannot be Hindered',
  'You cannot be Maimed',
  'You cannot be Cursed with Silence',
];
const BASE_JEWELS = new Set(['Cobalt Jewel', 'Crimson Jewel', 'Viridian Jewel', 'Prismatic Jewel']);

const WEAPON_CATEGORIES: Record<string, string> = {
  Shield: 'armour.shield',
  Quiver: 'armour.quiver',
  Bow: 'weapon.bow',
  Staff: 'weapon.staff',
  'Two Handed Sword': 'weapon.twosword',
  'Two Handed Axe': 'weapon.twoaxe',
  'Two Handed Mace': 'weapon.twomace',
  'Fishing Rod': 'weapon.rod',
  'One Handed Sword': 'weapon.onesword',
  'One Handed Axe': 'weapon.oneaxe',
  'One Handed Mace': 'weapon.onemace',
  Sceptre: 'weapon.sceptre',
  Wand: 'weapon.wand',
  Dagger: 'weapon.dagger',
  Claw: 'weapon.claw',
};

const SLOT_CATEGORIES: Record<string, string> = {
  'Body Armour': 'armour.chest',
  Helmet: 'armour.helmet',
  Gloves: 'armour.gloves',
  Boots: 'armour.boots',
  Amulet: 'accessory.amulet',
  Belt: 'accessory.belt',
};

const MIN_FACTOR = 0.8;
// Trade stats take whole numbers: round down, but never to 0 for a stat that rolled 1 or more
const scaled = (value: number) => Math.max(Math.floor(value * MIN_FACTOR), Math.min(1, Math.floor(value)));
// A weight group sums fractions, so its minimum stays fractional
const scaledSum = (value: number) => Math.round(value * MIN_FACTOR * 100) / 100;

/** Implicit trade IDs of mod lines; needs the stats loaded, so it runs on first use */
const implicitIds = (lines: string[]) =>
  new Set(lines.flatMap(line => matchMod(line)?.ids.filter(id => id.startsWith('implicit.')) ?? []));
let jewelImplicits: { corruption: Set<string>; only: Set<string> } | undefined;

/** Keeps the trade stat IDs of the given modifier types (`enchant` in `enchant.stat_123`), or all if there are none */
const onlyTypes = (ids: string[], types: string[]) => {
  const kept = ids.filter(id => types.includes(id.split('.')[0]!));
  return kept.length ? kept : ids;
};

/** Option stats are `<id>|<option>`; the rest take the minimum if there is one */
const statFilter = (id: string, value: StatValue): StatFilter => {
  const [statId, option] = id.split('|');
  if (option) return { id: statId!, value: { option: Number(option) } };
  return value ? { id, value } : { id };
};

/** The limit on the "Adds # Passive Skills" enchant of a cluster jewel of this base */
const passiveCount = (text: string, base: string): StatValue => {
  const count = Number(/^Adds (\d+) Passive Skills$/.exec(text)?.[1]);
  if (!count) return undefined;
  return count <= (FEWEST_PASSIVES[base.split(' ')[0]!] ?? 0) ? { max: count } : { min: count };
};

/** Matches the mod lines of an item, joining the two-line stats (cluster jewel enchants) */
const matchedMods = function* (
  mods: Mod[],
  reportUnmatched: Report,
): Generator<{ match: ModMatch; implicit: boolean; enchant: boolean; text: string }> {
  for (let i = 0; i < mods.length; i++) {
    const { text, implicit, enchant } = mods[i]!;
    let match = matchMod(text);
    let line = text;
    // Some stats span two lines (cluster jewel enchants)
    const next = mods[i + 1];
    if (!match && next?.implicit === implicit && (match = matchMod((line = `${text}\n${next.text}`)))) i++;
    if (match) yield { match, implicit, enchant, text: line };
    else reportUnmatched(text);
  }
};

/** One `count` group per matched mod over all its type variants; implicits on, explicits off unless `allOn` */
const statGroups = (mods: Mod[], reportUnmatched: Report, allOn = false): StatGroup[] =>
  [...matchedMods(mods, reportUnmatched)].map(({ match, implicit }) => {
    const value = match.value === undefined ? undefined : { min: scaled(match.value) };
    return {
      type: 'count',
      value: { min: 1 },
      disabled: !(implicit || allOn),
      // A unique's mod is of one known type, so it is a single stat
      filters: onlyTypes(match.ids, [implicit ? 'implicit' : 'explicit']).map(id => statFilter(id, value)),
    };
  });

/**
 * Puts every stat that is required on its own into one `and` group at the top: an `and` group's filters and the
 * `count` groups of a single filter (their minimum of 1 means that filter). Alternatives stay in their `count` group.
 */
const andFirst = (groups: StatGroup[]): StatGroup[] => {
  const single = (group: StatGroup) => group.type === 'count' && group.filters.length === 1 && group.value?.min === 1;
  const filters = groups.flatMap(group =>
    group.type === 'and'
      ? group.filters
      : single(group)
        ? group.filters.map(filter => (group.disabled ? { ...filter, disabled: true } : filter))
        : [],
  );
  const rest = groups.filter(group => group.type !== 'and' && !single(group));
  return [...(filters.length ? [{ type: 'and' as const, filters }] : []), ...rest];
};

/**
 * Rare, magic and flask stats: an `and` group of pseudo totals and cluster enchants (on) and influences (off), `count`
 * groups for the other mods, and a `weight` group of the explicit ones
 */
const rareStatGroups = (mods: Mod[], influences: StatFilter[], reportUnmatched: Report, base?: string) => {
  const jewel = !!base?.endsWith('Jewel');
  const cluster = !!base?.endsWith('Cluster Jewel');
  const totals = new Map<string, number>();
  const groups: StatGroup[] = [];
  // A cluster jewel's enchants all have to be there: they share the and group of the totals
  const enchants: StatFilter[] = [];
  // Keyed by id: two lines of one stat must not weigh it twice
  const weighted = new Map<string, StatFilter>();
  let weightSum = 0;
  for (const { match, implicit, enchant: tagged, text } of matchedMods(mods, reportUnmatched)) {
    // An enchant is never rolled: the exact value is what the jewel is worth
    const enchant = (cluster && implicit) || tagged;
    // A jewel has no crafted mods: its implicit block holds enchants (cluster) or a corrupted implicit
    const ids =
      jewel || enchant
        ? onlyTypes(match.ids, enchant ? ['enchant'] : implicit ? ['implicit'] : ['explicit', 'fractured'])
        : match.ids;
    const value = match.value;
    // ponytail: negative rolls have no value and stay single-mod groups, so a total may overshoot such an item
    const folded = !enchant && value !== undefined && PSEUDO_TOTALS[ids[0]!.split('.')[1]!];
    if (folded) {
      for (const total of folded) totals.set(total, (totals.get(total) ?? 0) + value);
      continue;
    }
    const min =
      (cluster && passiveCount(text, base!)) ||
      (value === undefined ? undefined : { min: enchant ? value : scaled(value) });
    if (enchant) {
      // A flask's enchant is a bonus, not a requirement: switched off
      enchants.push(...ids.map(id => ({ ...statFilter(id, min), ...(base?.endsWith('Flask') && { disabled: true }) })));
      continue;
    }
    groups.push({ type: 'count', value: { min: 1 }, disabled: false, filters: ids.map(id => statFilter(id, min)) });
    if (!implicit && value !== undefined && !ids.some(id => id.includes('|'))) {
      for (const id of ids) weighted.set(id, { id, value: { weight: 1 } });
      weightSum += value;
    }
  }
  const and = [
    ...[...totals].map(([total, sum]) => ({ id: `pseudo.pseudo_total_${total}`, value: { min: scaled(sum) } })),
    ...enchants,
    ...influences,
  ];
  return andFirst([
    ...(and.length ? [{ type: 'and' as const, filters: and }] : []),
    ...groups,
    ...(weighted.size
      ? [{ type: 'weight' as const, value: { min: scaledSum(weightSum) }, filters: [...weighted.values()] }]
      : []),
  ]);
};

/** Disabled Filters for what POB knows about an item beyond its mods */
const propertyFilters = (item: Item) => {
  const misc: Record<string, unknown> = {};
  if (item.itemLevel) misc.ilvl = { min: item.itemLevel };
  if (item.corrupted) misc.corrupted = { option: 'true' };
  if (item.influences.includes('Searing Exarch')) misc.searing_item = { option: 'true' };
  if (item.influences.includes('Eater of Worlds')) misc.tangled_item = { option: 'true' };

  const socket: Record<string, unknown> = {};
  // ponytail: abyss sockets are left out, so the count never asks for more than the site may count
  const groups = (item.sockets ?? '')
    .replaceAll('A', '')
    .split(' ')
    .map(group => group.split('-').filter(Boolean).length);
  const sockets = groups.reduce((sum, size) => sum + size, 0);
  const links = Math.max(...groups);
  if (sockets) socket.sockets = { min: sockets };
  if (links > 1) socket.links = { min: links };

  const armour: Record<string, unknown> = {};
  if (item.armour) armour.ar = { min: item.armour };
  if (item.evasion) armour.ev = { min: item.evasion };
  if (item.energyShield) armour.es = { min: item.energyShield };

  return Object.fromEntries(
    Object.entries({ misc_filters: misc, socket_filters: socket, armour_filters: armour })
      .filter(([, filters]) => Object.keys(filters).length)
      .map(([group, filters]) => [group, { disabled: true, filters }]),
  );
};

/** Port of POB's TradeHelpers.getTradeCategory */
const tradeCategory = (slot: string, type: string | undefined): string | undefined => {
  if (/^Weapon \d/.test(slot) && !slot.includes('Abyssal')) {
    if (!type) return 'weapon.one';
    const exact = WEAPON_CATEGORIES[type];
    if (exact) return exact;
    if (type.includes('Two Handed')) return 'weapon.twomelee';
    if (type.includes('One Handed')) return 'weapon.one';
    return 'weapon';
  }
  if (slot.startsWith('Ring')) return 'accessory.ring';
  if (slot.includes('Abyssal')) return 'jewel.abyss';
  if (slot.includes('Jewel')) return 'jewel';
  if (slot.includes('Flask')) return 'flask';
  return SLOT_CATEGORIES[slot];
};

const searchQuery = ({ slot, item }: BuildItem, reportUnmatched: Report) => {
  const query: Record<string, unknown> = { status: { option: 'securable' } };
  if (item.rarity === 'UNIQUE' || item.rarity === 'RELIC') {
    const name = item.name.replace(/^Foulborn /, '');
    // Forbidden Flame and Flesh are searched by their node alone: a find on either jewel of the pair counts
    if (!PAIRED_UNIQUES.has(name)) query.name = name;
    if (item.name !== name) query.filters = { misc_filters: { filters: { mutated: { option: 'true' } } } };
    // A unique is identified by its name, plus the mods that set it apart: Mutated Mods and those of a selected variant
    // ponytail: an item saved without variant tags (Watcher's Eye from a trade import) keeps its "while affected by" lines
    const tagged = item.mods.some(mod => mod.variant);
    const variantMod = (mod: Mod) => mod.variant || (!tagged && /while affected by/.test(mod.text));
    const identity = item.mods.filter(
      mod => mod.mutated || PAIRED_UNIQUES.has(name) || (VARIANT_UNIQUES.has(name) && variantMod(mod)),
    );
    const stats = statGroups(identity, reportUnmatched, true);
    // A flask's enchant is not part of its identity but makes a find worth more: the exact value, switched off
    const enchants = slot.startsWith('Flask')
      ? [
          ...matchedMods(
            item.mods.filter(mod => mod.enchant),
            reportUnmatched,
          ),
        ].flatMap(({ match }) =>
          onlyTypes(match.ids, ['enchant']).map(id => ({
            ...statFilter(id, match.value === undefined ? undefined : { min: match.value }),
            disabled: true,
          })),
        )
      : [];
    if (enchants.length) stats.push({ type: 'and', filters: enchants });
    // Any conqueror of the jewel may carry the seed, so the player switches off those they don't want
    const timeless = matchTimeless(item.mods.map(mod => mod.text));
    if (timeless) {
      const value = { min: timeless.seed, max: timeless.seed };
      stats.push({ type: 'count', value: { min: 1 }, filters: timeless.ids.map(id => ({ id, value })) });
    }
    if (stats.length) query.stats = andFirst(stats);
  } else {
    if (item.base) query.type = item.base;
    const filters: Record<string, unknown> = {};
    const category = tradeCategory(slot, item.type);
    if (category) filters.type_filters = { filters: { category: { option: category } } };
    Object.assign(filters, propertyFilters(item));
    if (Object.keys(filters).length) query.filters = filters;
    const influences = item.influences.flatMap(influence => {
      const id = INFLUENCE_STATS[influence];
      return id ? [{ id, disabled: true }] : [];
    });
    const stats = rareStatGroups(item.mods, influences, reportUnmatched, item.base);
    if (stats.length) query.stats = stats;
  }
  return query;
};

const aggregateIds = (ids: string[]) => {
  jewelImplicits ??= { corruption: implicitIds(JEWEL_CORRUPTION_LINES), only: implicitIds(JEWEL_IMPLICIT_ONLY_LINES) };
  const { corruption, only } = jewelImplicits;
  const implicit = ids.filter(id => only.has(id));
  return implicit.length ? implicit : ids.filter(id => /^(explicit|fractured)\./.test(id) || corruption.has(id));
};

/** The Aggregate Jewel: one Trade for any base jewel with enough of the mods found on the build's base jewels */
const aggregateJewel = (items: BuildItem[]) => {
  const union = new Set<string>();
  const weighted = new Map<string, StatFilter>();
  let most = 0;
  let weightSum = 0;
  for (const { slot, item } of items) {
    if (
      slot !== 'Jewel' ||
      !item.base ||
      !BASE_JEWELS.has(item.base) ||
      item.rarity === 'UNIQUE' ||
      item.rarity === 'RELIC'
    )
      continue;
    // Unmatched lines are already reported by the jewel's own Trade
    const mods = [...matchedMods(item.mods, () => {})];
    const matches = mods.map(({ match }) => aggregateIds(match.ids)).filter(ids => ids.length);
    for (const ids of matches) ids.forEach(id => union.add(id));
    // The weight group is worth the most valuable jewel, counting only mods that roll (as on a rare)
    let sum = 0;
    for (const { match, implicit } of mods) {
      const ids = match.ids.filter(id => /^(explicit|fractured)\./.test(id) && !id.includes('|'));
      if (implicit || match.value === undefined || !ids.length) continue;
      for (const id of ids) weighted.set(id, { id, value: { weight: 1 } });
      sum += match.value;
    }
    weightSum = Math.max(weightSum, sum);
    most = Math.max(most, new Set(matches.map(ids => ids.join())).size);
  }
  if (!union.size) return [];
  const query = {
    status: { option: 'securable' },
    filters: { type_filters: { filters: { category: { option: 'jewel.base' } } } },
    stats: [
      {
        type: 'count',
        value: { min: Math.min(Math.max(most, 2), 4) },
        filters: [...union].map(id => statFilter(id, undefined)),
      },
      ...(weighted.size
        ? [{ type: 'weight', value: { min: scaledSum(weightSum) }, filters: [...weighted.values()] }]
        : []),
    ],
  };
  return [{ tit: 'Jewels — combined', query }];
};

/** "Slot — Name"; a Unique is "Unique Ring — Name"; a Cluster Jewel is "Large Cluster — Name (Trap And Mine Damage)" */
const titleOf = ({ slot, item }: BuildItem) => {
  // The search finds either jewel of the pair, so the title names both
  const name = PAIRED_UNIQUES.has(item.name) ? 'Forbidden Flame / Flesh' : item.name;
  if (item.rarity === 'UNIQUE' || item.rarity === 'RELIC') return `Unique ${slot.replace(/ \d+$/, '')} — ${name}`;
  if (!item.base?.endsWith('Cluster Jewel')) return `${slot} — ${name}`;
  const skill = item.clusterSkill
    ?.replace(/^affliction_/, '')
    .split('_')
    .map(word => word[0]!.toUpperCase() + word.slice(1))
    .join(' ');
  return `${item.base.replace(/ Jewel$/, '')} — ${name}${skill ? ` (${skill})` : ''}`;
};

/** Keeps the first of the Trades that search the same thing: equal queries, ignoring rolls (`min` / `max`) on non-uniques */
const dedupe = (trades: { tit: string; query: Record<string, unknown> }[]) => {
  const seen = new Set<string>();
  return trades.filter(({ query }) => {
    const key = JSON.stringify(query, (k, v) => (!query.name && (k === 'min' || k === 'max') ? undefined : v));
    return !seen.has(key) && !!seen.add(key);
  });
};

/** The trade-site location slug: BT joins it to `/trade/search/<league>/`, and the site reads `?q=` as a query */
const trade = (tit: string, query: object) => ({
  tit,
  loc: `1:search:?q=${encodeURIComponent(JSON.stringify({ query }))}`,
});

/** Build Code to a BT Export String (format 3) holding one Folder; the stats must be loaded first */
const toExportString = async (buildCode: string): Promise<Result> => {
  const build = await decodeBuild(buildCode);
  const name = build.ascendancy ?? build.className;
  const icon = name.toLowerCase();

  const unmatched: string[] = [];
  const folder = {
    icn: ICONS.has(icon) ? icon : null,
    tit: build.mainSkill ? `${build.mainSkill} ${name}` : name,
    ver: '1',
    trs: dedupe([
      ...build.items.map(buildItem => {
        const tit = titleOf(buildItem);
        return { tit, query: searchQuery(buildItem, line => unmatched.push(`${tit}: ${line}`)) };
      }),
      ...aggregateJewel(build.items),
    ]).map(({ tit, query }) => trade(tit, query)),
  };
  return { exportString: `3:${Base64.encode(JSON.stringify(folder))}`, unmatched };
};

export { toExportString };
