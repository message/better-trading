// Ported from pob2bt (src/mods.ts): stats come in as text instead of being read from disk

/** A mod line matched to trade stats */
interface ModMatch {
  /** Trade ID of the stat in every modifier type it exists in; option stats are `<id>|<option>` */
  ids: string[];
  /** The item's value for the stat; undefined when no minimum can be derived from it */
  value: number | undefined;
}

interface Matcher {
  string: string;
  /** Fixed value of a matcher without numbers */
  value?: number;
  /** The line reads the opposite way of the stat ("reduced" for "increased") */
  negate?: boolean;
}

interface Stat {
  better: number;
  matchers: Matcher[];
  trade: { ids: Record<string, string[]>; inverted?: boolean };
}

const TYPES = ['explicit', 'implicit', 'fractured', 'enchant', 'crafted'];
const NUMBER = /[+-]?\d+(?:\.\d+)?/g;

const byText = new Map<string, { stats: Stat[]; matcher: Matcher }>();
// Timeless jewel seed stats, one per conqueror; a jewel's conquerors share the "Passives ... Conquered by" line
const conquerorIds = new Map<string, string[]>();
const seedTexts = new Map<string, string>();

/** Indexes APT's stats.ndjson: one stat per line, or `{ stats }` for stats sharing a text. Runs once */
const loadStats = (ndjson: string) => {
  if (byText.size) return;
  for (const line of ndjson.split('\n')) {
    if (!line) continue;
    const entry = JSON.parse(line) as Stat & { stats?: Stat[] };
    // ponytail: shared texts merge all their stats (APT picks one by item class); the count group accepts any
    const stats = entry.stats ?? [entry];
    for (const stat of stats) {
      // APT puts zero-width spaces before gem names
      for (const matcher of stat.matchers) {
        const text = matcher.string.replaceAll('​', '');
        const known = byText.get(text);
        byText.set(text, { stats: known && known.stats !== stats ? [...known.stats, ...stats] : stats, matcher });
      }
    }
  }

  for (const { stats, matcher } of byText.values()) {
    const id = stats[0]?.trade.ids.explicit?.[0];
    const [, conquered] = matcher.string.split('\n');
    if (!id?.startsWith('explicit.pseudo_timeless_jewel_') || !conquered) continue;
    seedTexts.set(matcher.string, conquered);
    conquerorIds.set(conquered, [...(conquerorIds.get(conquered) ?? []), id]);
  }
};

/** Finds a Timeless jewel's seed in its mod lines: the stat of every conqueror and the seed they all share */
const matchTimeless = (lines: string[]): { ids: string[]; seed: number } | undefined => {
  for (let i = 0; i + 1 < lines.length; i++) {
    const seed = lines[i]!.match(/\d+/);
    const conquered = seed && seedTexts.get(`${lines[i]!.replace(seed[0], '#')}\n${lines[i + 1]}`);
    if (conquered) return { ids: conquerorIds.get(conquered)!, seed: Number(seed![0]) };
  }
  return undefined;
};

const bits = (n: number) => n.toString(2).replaceAll('0', '').length;

/** Matches a POB mod (one line, or two joined by \n) to trade stats, or returns undefined */
const matchMod = (line: string): ModMatch | undefined => {
  const numbers = [...line.matchAll(NUMBER)];
  // Replace every number with #, then fewer: some numbers are part of the stat text ("Level 20")
  const masks = [...Array(2 ** numbers.length).keys()].sort((a, b) => bits(b) - bits(a));
  for (const mask of masks) {
    let text = '';
    let end = 0;
    const values: number[] = [];
    numbers.forEach((number, i) => {
      if (!(mask & (1 << i))) return;
      text += line.slice(end, number.index) + '#';
      end = number.index + number[0].length;
      values.push(Number(number[0]));
    });
    const key = text + line.slice(end);
    const found = byText.get(key);
    if (!found) continue;

    const idsOf = (stats: Stat[]) => stats.flatMap(stat => TYPES.flatMap(type => stat.trade.ids[type] ?? []));
    // Forbidden Flame and Flesh are only useful as a pair: the same ascendancy node on either jewel is a find
    const twin = byText.get(
      key.replace(/Forbidden (Flame|Flesh)$/, (_, name) => `Forbidden ${name === 'Flame' ? 'Flesh' : 'Flame'}`),
    );
    const paired = key.startsWith('Allocates ') && twin;
    // Sorted, so both jewels of the pair give the same ids
    const ids = [...new Set([...idsOf(found.stats), ...(paired ? idsOf(twin.stats) : [])])];
    if (paired) ids.sort();
    if (!ids.length) return undefined;
    // The trade site compares "Adds # to #" stats by their average
    let value = found.matcher.value ?? (values.length ? values.reduce((a, b) => a + b) / values.length : undefined);
    if (value !== undefined && found.matcher.negate) value = -value;
    // ponytail: only "higher is better" positive values get a minimum; inverted and negative rolls match on presence
    const scalable =
      value !== undefined && value > 0 && found.stats.every(stat => stat.better === 1 && !stat.trade.inverted);
    return { ids, value: scalable ? value : undefined };
  }
  return undefined;
};

export type { ModMatch };
export { loadStats, matchMod, matchTimeless };
