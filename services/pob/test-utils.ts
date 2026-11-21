// Test helpers for the PoB import, ported from pob2bt (test/decode.ts). Importing this loads the stat data
import { loadStats } from './mods';
import { pobStatsPath } from '@/scripts/pob-stats';
import { Base64 } from 'js-base64';
import { readFile } from 'node:fs/promises';

interface DecodedTrade {
  title: string;
  // Search Queries are free-form trade site JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>;
}

interface DecodedFolder {
  icon: string | null;
  title: string;
  version: string;
  trades: DecodedTrade[];
}

loadStats(await readFile(await pobStatsPath(), 'utf8'));

/** Decodes a format 3 Export String back into its Folder and each Trade's Search Query */
const decodeExportString = (exportString: string): DecodedFolder => {
  if (!exportString.startsWith('3:')) throw new Error(`Not a format 3 Export String: ${exportString.slice(0, 10)}`);
  const folder = JSON.parse(Base64.decode(exportString.slice(2)));
  return {
    icon: folder.icn,
    title: folder.tit,
    version: folder.ver,
    trades: folder.trs.map(({ tit, loc }: { tit: string; loc: string }) => {
      const [version, type, slug] = loc.split(':');
      if (version !== '1' || type !== 'search' || !slug) throw new Error(`Unexpected location: ${loc}`);
      return { title: tit, query: JSON.parse(decodeURIComponent(slug.replace(/^\?q=/, ''))).query };
    }),
  };
};

/** Build Code of a fixture in ./fixtures */
const fixture = async (name: string) => (await readFile(new URL(`fixtures/${name}`, import.meta.url), 'utf8')).trim();

export type { DecodedFolder, DecodedTrade };
export { decodeExportString, fixture };
