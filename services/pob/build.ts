// Ported from pob2bt (src/build.ts): inflate runs on DecompressionStream, so it works in a service worker
import bases from './bases.json';
import { XMLParser } from 'fast-xml-parser';
import { Base64 } from 'js-base64';

/** Relics are POB's foil uniques */
type Rarity = 'NORMAL' | 'MAGIC' | 'RARE' | 'UNIQUE' | 'RELIC';

const INFLUENCES = [
  'Shaper',
  'Elder',
  'Crusader',
  'Redeemer',
  'Hunter',
  'Warlord',
  'Searing Exarch',
  'Eater of Worlds',
] as const;
type Influence = (typeof INFLUENCES)[number];

interface Mod {
  text: string;
  /** From the implicit block, which also holds enchants */
  implicit: boolean;
  /** An implicit tagged {crafted}: that is how POB lists an item's enchants */
  enchant: boolean;
  /** Tagged {mutated}: differs on a Foulborn unique from the regular unique */
  mutated: boolean;
  /** Tagged {variant:N} for a variant the item has selected */
  variant: boolean;
}

interface Item {
  rarity: Rarity;
  name: string;
  /** undefined for a magic item whose base is not in bases.json */
  base: string | undefined;
  /** POB item type of the base, e.g. "One Handed Sword"; undefined when the base is unknown */
  type: string | undefined;
  itemLevel: number | undefined;
  /** POB socket string: groups split by spaces, links by dashes, e.g. "R-G-B A" */
  sockets: string | undefined;
  /** Cluster Jewel enchant family, e.g. "affliction_trap_and_mine_damage" */
  clusterSkill: string | undefined;
  influences: Influence[];
  corrupted: boolean;
  /** Totals POB computed for the item, including quality and local mods */
  armour: number | undefined;
  evasion: number | undefined;
  energyShield: number | undefined;
  /** Mod lines without their POB tags, implicits first */
  mods: Mod[];
}

interface BuildItem {
  slot: string;
  item: Item;
}

interface Build {
  className: string;
  ascendancy: string | undefined;
  /** Active gem of POB's main skill group, the build's DPS skill; undefined when POB has none */
  mainSkill: string | undefined;
  /** Equipment (weapon swap included), flasks and abyss jewels of the active Item Set, then jewels socketed in the tree */
  items: BuildItem[];
}

type Attrs = Record<string, string | undefined>;
type PobSkill = Attrs & { Gem?: Attrs[] };
interface PobXml {
  PathOfBuilding?: {
    Build?: Attrs;
    Items?: Attrs & { Item?: (Attrs & { '#text': string })[]; ItemSet?: { id?: string; Slot?: Attrs[] }[] };
    Tree?: Attrs & { Spec?: { nodes?: string; Sockets?: { Socket?: Attrs[] } }[] };
    Skills?: Attrs & { SkillSet?: (Attrs & { Skill?: PobSkill[] })[]; Skill?: PobSkill[] };
  };
}

const baseTypes: Record<string, string> = bases;
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: false,
  parseAttributeValue: false,
  isArray: name => ['Item', 'ItemSet', 'Slot', 'Spec', 'Socket', 'SkillSet', 'Skill', 'Gem'].includes(name),
});

const SLOT_ORDER = [
  'Weapon 1',
  'Weapon 2',
  'Helmet',
  'Body Armour',
  'Gloves',
  'Boots',
  'Amulet',
  'Ring',
  'Belt',
  'Flask',
];
/** Item state lines that follow the mods */
const ITEM_FLAGS = new Set(['Corrupted', 'Mirrored', 'Split', 'Fractured Item', 'Synthesised Item', 'Unidentified']);

/** Position of a slot in POB's equipment order; abyss sockets follow their item, unknown slots go last */
const slotRank = (slot: string) => {
  const index = SLOT_ORDER.findIndex(prefix => slot.startsWith(prefix));
  return index < 0 ? SLOT_ORDER.length : index;
};

/** Variants the item has selected, e.g. "Selected Variant: 5" and "Selected Alt Variant Two: 1" */
// ponytail: variant groups ("Selected Variant Group") are not read; no unique with a variant search needs them
const selectedVariants = (lines: string[]): Set<number> =>
  new Set(
    lines
      .flatMap(line => /^Selected (?:Alt )?Variant(?: Two| Three| Four| Five)?: (\d+)$/.exec(line)?.[1] ?? [])
      .map(Number),
  );

/** Mods follow the "Implicits: N" line, the first N being implicits */
const parseMods = (lines: string[], selected: Set<number>): Mod[] => {
  const at = lines.findIndex(line => line.startsWith('Implicits: '));
  if (at < 0) return [];
  const implicits = Number(lines[at]!.slice('Implicits: '.length));
  return (
    lines
      .slice(at + 1)
      .filter(line => !ITEM_FLAGS.has(line))
      // The implicit count includes lines of variants that are not selected
      .flatMap((line, i) => {
        const tags = /^(?:\{[^}]*\})+/.exec(line)?.[0] ?? '';
        const variants = /\{variant:([\d,]+)\}/.exec(tags)?.[1]?.split(',').map(Number);
        if (variants && !variants.some(id => selected.has(id))) return [];
        return [
          {
            text: line.slice(tags.length),
            implicit: i < implicits,
            enchant: i < implicits && tags.includes('{crafted}'),
            mutated: tags.includes('{mutated}'),
            variant: !!variants,
          },
        ];
      })
  );
};

/** A magic item's name holds its base between affixes: take the longest known base inside it */
const magicBase = (name: string): string | undefined => {
  let best: string | undefined;
  let bestLength = 0;
  for (const base in baseTypes) {
    if (base.length > bestLength && name.includes(base)) [best, bestLength] = [base, base.length];
  }
  return best;
};

/** POB item text to Item */
const parseItem = (text: string): Item | undefined => {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  const start = lines.findIndex(line => line.startsWith('Rarity: '));
  if (start < 0) return undefined;

  const rarity = lines[start]!.slice('Rarity: '.length).toUpperCase() as Rarity;
  const name = lines[start + 1];
  if (!name) return undefined;

  let base: string | undefined;
  if (rarity === 'RARE' || rarity === 'UNIQUE' || rarity === 'RELIC') base = lines[start + 2] ?? name;
  else if (rarity === 'MAGIC') base = magicBase(name);
  else base = name.replace(/^Superior /, '');

  const property = (label: string) => lines.find(line => line.startsWith(`${label}: `))?.slice(label.length + 2);
  const number = (label: string) => {
    const value = property(label);
    return value === undefined ? undefined : Number(value);
  };
  return {
    rarity,
    name,
    base,
    type: base && baseTypes[base],
    itemLevel: number('Item Level'),
    sockets: property('Sockets'),
    clusterSkill: property('Cluster Jewel Skill'),
    influences: INFLUENCES.filter(influence => lines.includes(`${influence} Item`)),
    corrupted: lines.includes('Corrupted'),
    armour: number('Armour'),
    evasion: number('Evasion'),
    energyShield: number('Energy Shield'),
    mods: parseMods(lines, selectedVariants(lines)),
  };
};

/** zlib inflate; DecompressionStream's 'deflate' is the zlib format */
const inflate = async (bytes: Uint8Array): Promise<string> => {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate'));
  return await new Response(stream).text();
};

/** Build Code (base64url, zlib, XML) to Build */
const decodeBuild = async (buildCode: string): Promise<Build> => {
  // js-base64 accepts the url-safe alphabet too
  const xml = await inflate(Base64.toUint8Array(buildCode.trim()));
  const { PathOfBuilding: pob } = parser.parse(xml) as PobXml;
  if (!pob?.Build) throw new Error('Not a Path of Building Build Code');

  const itemsById = new Map((pob.Items?.Item ?? []).map(node => [node.id, node['#text']]));
  const items: BuildItem[] = [];
  const add = (slot: string, itemId: string | undefined) => {
    const text = itemId && itemId !== '0' ? itemsById.get(itemId) : undefined;
    const item = text && parseItem(text);
    if (item) items.push({ slot, item });
  };

  const sets = pob.Items?.ItemSet ?? [];
  const activeSet = sets.find(set => set.id === pob.Items?.activeItemSet) ?? sets[0];
  const slots = (activeSet?.Slot ?? []).filter(({ name }) => name);
  slots.sort((a, b) => slotRank(a.name!) - slotRank(b.name!) || a.name!.localeCompare(b.name!));
  for (const { name, itemId } of slots) add(name!, itemId);

  const specs = pob.Tree?.Spec ?? [];
  const activeSpec = specs[Number(pob.Tree?.activeSpec ?? 1) - 1] ?? specs[0];
  // POB keeps jewels in deallocated sockets: only allocated nodes count
  const allocated = new Set(activeSpec?.nodes?.split(','));
  for (const { nodeId, itemId } of activeSpec?.Sockets?.Socket ?? []) {
    if (nodeId && allocated.has(nodeId)) add('Jewel', itemId);
  }

  const skillSets = pob.Skills?.SkillSet;
  // Builds from before Skill Sets keep their skills directly under <Skills>
  const skills = skillSets
    ? (skillSets.find(set => set.id === pob.Skills?.activeSkillSet) ?? skillSets[0])?.Skill
    : pob.Skills?.Skill;
  const mainGroup = skills?.[Number(pob.Build.mainSocketGroup) - 1];
  // POB numbers the group's active skills, and a Vaal gem is two: "Vaal X", then "X"
  const mainSkills = (mainGroup?.Gem ?? [])
    .filter(gem => gem.gemId && gem.nameSpec && !gem.gemId.includes('/SupportGem'))
    .flatMap(gem => (gem.nameSpec!.startsWith('Vaal ') ? [gem.nameSpec!, gem.nameSpec!.slice(5)] : [gem.nameSpec!]));
  const mainSkill = mainSkills[(Number(mainGroup?.mainActiveSkill) || 1) - 1];

  const { className = '', ascendClassName } = pob.Build;
  return {
    className,
    ascendancy: ascendClassName && ascendClassName !== 'None' ? ascendClassName : undefined,
    mainSkill,
    items,
  };
};

export type { BuildItem, Influence, Item, Mod };
export { decodeBuild };
