// Builds pob-stats.ndjson from Awakened PoE Trade's stats data at a pinned commit, keeping only the fields
// services/pob/mods.ts reads (2.6 MB → 1.8 MB), then appends the uniques services/pob needs to know about (see
// UniqueInfo in services/pob/mods.ts). wxt.config.ts ships it as a public asset.
// To update: put the SHA from `git ls-remote https://github.com/SnosMe/awakened-poe-trade refs/heads/master` below.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

interface Stat {
  ref: string;
  better: number;
  matchers: { string: string; value?: number; negate?: boolean }[];
  trade: { ids: Record<string, string[]>; inverted?: boolean };
}

interface Item {
  refName: string;
  namespace: string;
  unique?: { fixedStats?: string[] };
}

const APT_SHA = '2498730beecc1a46d39214ac437ffbe9f5f542d8';
const DATA = `https://raw.githubusercontent.com/SnosMe/awakened-poe-trade/${APT_SHA}/renderer/public/data/en`;
// pseudo is unused by the import today but kept for later features
const TYPES = ['explicit', 'implicit', 'fractured', 'enchant', 'crafted', 'pseudo'];
// Keyed by SHA and format version, so a bump of either can't leave a stale file behind
const CACHE = join(import.meta.dirname, '../node_modules/.cache/pob-stats', `${APT_SHA}-2.ndjson`);

// Stats without trade IDs stay: matchMod stops at the first text that exists, matched to trade or not
const slim = ({ better, matchers, trade }: Stat): Omit<Stat, 'ref'> => ({
  better,
  matchers: matchers.map(({ string, value, negate }) => ({ string, value, negate })),
  trade: {
    ids: Object.fromEntries(TYPES.filter(type => trade.ids[type]).map(type => [type, trade.ids[type]!])),
    inverted: trade.inverted,
  },
});

const fetchNdjson = async <T>(file: string): Promise<T[]> => {
  const url = `${DATA}/${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const text = await response.text();
  if (!text.startsWith('{')) throw new Error(`Not ndjson: ${url}`);
  return text.split('\n').flatMap(line => (line ? [JSON.parse(line) as T] : []));
};

/**
 * One line per unique that rolls random mods (APT's `fixedStats`: the stats every copy has, by trade stat number) or
 * comes in several bases
 */
const uniqueLines = (stats: Stat[], items: Item[]) => {
  // `explicit.stat_123` and `fractured.stat_123` are one stat number
  const statNumbers = (ids: string[][]) => [...new Set(ids.flat().map(id => id.split('.')[1]!))];
  const numbers = new Map(stats.map(({ ref, trade }) => [ref, statNumbers(Object.values(trade.ids))]));
  const uniques = items.filter(item => item.namespace === 'UNIQUE' && item.unique);
  const bases = new Map<string, number>();
  for (const { refName } of uniques) bases.set(refName, (bases.get(refName) ?? 0) + 1);
  const seen = new Set<string>();
  return uniques.flatMap(({ refName, unique }) => {
    const fixed = unique!.fixedStats?.flatMap(ref => numbers.get(ref) ?? []);
    const multiBase = bases.get(refName)! > 1;
    if ((!fixed && !multiBase) || seen.has(refName)) return [];
    seen.add(refName);
    return [JSON.stringify({ unique: refName, ...(fixed && { fixed }), ...(multiBase && { multiBase }) })];
  });
};

const download = async () => {
  const entries = await fetchNdjson<Stat & { stats?: Stat[] }>('stats.ndjson');
  const items = await fetchNdjson<Item>('items.ndjson');
  const lines = [
    ...entries.map(entry => JSON.stringify(entry.stats ? { stats: entry.stats.map(slim) } : slim(entry))),
    ...uniqueLines(
      entries.flatMap(entry => entry.stats ?? [entry]),
      items,
    ),
  ];
  await mkdir(join(CACHE, '..'), { recursive: true });
  await writeFile(CACHE, lines.join('\n') + '\n');
};

/** Path of the slimmed stats file, downloaded on the first build after a SHA change */
const pobStatsPath = async () => {
  await readFile(CACHE).catch(download);
  return CACHE;
};

export { pobStatsPath };
