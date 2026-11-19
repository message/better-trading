// Builds pob-stats.ndjson from Awakened PoE Trade's stats data at a pinned commit, keeping only the fields
// services/pob/mods.ts reads (2.6 MB → 1.8 MB). wxt.config.ts ships it as a public asset.
// To update: put the SHA from `git ls-remote https://github.com/SnosMe/awakened-poe-trade refs/heads/master` below.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

interface Stat {
  better: number;
  matchers: { string: string; value?: number; negate?: boolean }[];
  trade: { ids: Record<string, string[]>; inverted?: boolean };
}

const APT_SHA = '2498730beecc1a46d39214ac437ffbe9f5f542d8';
const SOURCE = `https://raw.githubusercontent.com/SnosMe/awakened-poe-trade/${APT_SHA}/renderer/public/data/en/stats.ndjson`;
// pseudo is unused by the import today but kept for later features
const TYPES = ['explicit', 'implicit', 'fractured', 'enchant', 'crafted', 'pseudo'];
// Keyed by SHA, so bumping it can't leave a stale file behind
const CACHE = join(import.meta.dirname, '../node_modules/.cache/pob-stats', `${APT_SHA}.ndjson`);

// Stats without trade IDs stay: matchMod stops at the first text that exists, matched to trade or not
const slim = ({ better, matchers, trade }: Stat): Stat => ({
  better,
  matchers: matchers.map(({ string, value, negate }) => ({ string, value, negate })),
  trade: {
    ids: Object.fromEntries(TYPES.filter(type => trade.ids[type]).map(type => [type, trade.ids[type]!])),
    inverted: trade.inverted,
  },
});

const download = async () => {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${SOURCE}`);
  const text = await response.text();
  if (!text.startsWith('{')) throw new Error(`Not ndjson: ${SOURCE}`);

  const lines = text.split('\n').flatMap(line => {
    if (!line) return [];
    const entry = JSON.parse(line) as Stat & { stats?: Stat[] };
    return [JSON.stringify(entry.stats ? { stats: entry.stats.map(slim) } : slim(entry))];
  });
  await mkdir(join(CACHE, '..'), { recursive: true });
  await writeFile(CACHE, lines.join('\n') + '\n');
};

/** Path of the slimmed stats file, downloaded on the first build after a SHA change */
const pobStatsPath = async () => {
  await readFile(CACHE).catch(download);
  return CACHE;
};

export { pobStatsPath };
