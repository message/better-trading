import { Base64 } from 'js-base64';
import type {
  BookmarksFolderIcon,
  BookmarksFolderStruct,
  BookmarksTradeLocation,
  BookmarksTradeStruct,
} from '@/types/bookmarks';
import type { TradeSiteVersion } from '@/types/trade-location';

type ExportVersion = 1 | 2 | 3;

interface ExportedFolderStructV1 {
  icn: string | null;
  tit: string;
  trs: Array<{
    tit: string;
    loc: string;
  }>;
}

interface ExportedFolderStructV3 extends ExportedFolderStructV1 {
  ver: TradeSiteVersion;
}

const isTradeSiteVersion = (value: unknown): value is TradeSiteVersion => value === '1' || value === '2';

const serialize = (folder: BookmarksFolderStruct, trades: BookmarksTradeStruct[]): string => {
  const payload: ExportedFolderStructV3 = {
    icn: folder.icon,
    tit: folder.title,
    ver: folder.version,
    trs: trades.map(trade => ({
      tit: trade.title,
      loc: `${trade.location.version}:${trade.location.type}:${trade.location.slug}`,
    })),
  };

  return `3:${Base64.encode(JSON.stringify(payload))}`;
};

const parseExportVersion = (exportString: string): ExportVersion => {
  if (exportString.startsWith('2:')) {
    return 2;
  } else if (exportString.startsWith('3:')) {
    return 3;
  } else {
    // v1 export string with no version prefix
    return 1;
  }
};

const jsonFromExportString = (version: ExportVersion, exportString: string): string => {
  if (version >= 2) {
    // can include unicode emoji/etc
    return Base64.decode(exportString.slice(2));
  } else {
    // v1 export string with no version prefix, breaks for non-Latin1
    return atob(exportString);
  }
};

/** Parses a Trade's `loc`: `version:type:slug` from format 3 on, `type:slug` (always PoE 1) before */
const parseTradeLocation = (exportVersion: ExportVersion, loc: unknown): BookmarksTradeLocation | null => {
  if (typeof loc !== 'string') return null;

  // As lenient as 1.9.1 (extra or empty segments pass) so that every Backup it made still restores
  const [version, type, slug] = exportVersion >= 3 ? loc.split(':') : ['1', ...loc.split(':')];
  if (!isTradeSiteVersion(version) || type === undefined || slug === undefined) return null;

  return { version, type, slug };
};

/** Reads an Export String of format 1, 2 or 3; null when it does not hold a well-formed Folder */
const deserialize = (serializedFolder: string): [BookmarksFolderStruct, BookmarksTradeStruct[]] | null => {
  try {
    const exportString = serializedFolder.trim();
    const exportVersion = parseExportVersion(exportString);
    const payload: Partial<ExportedFolderStructV3> | null = JSON.parse(
      jsonFromExportString(exportVersion, exportString),
    );

    if (!payload || typeof payload.tit !== 'string' || !Array.isArray(payload.trs)) return null;
    if (payload.icn != null && typeof payload.icn !== 'string') return null;

    const version = exportVersion >= 3 ? payload.ver : '1';
    if (!isTradeSiteVersion(version)) return null;

    const trades: BookmarksTradeStruct[] = [];
    for (const trade of payload.trs as unknown[]) {
      const { tit, loc } = (trade ?? {}) as { tit?: unknown; loc?: unknown };
      const location = parseTradeLocation(exportVersion, loc);
      if (typeof tit !== 'string' || !location) return null;

      trades.push({ title: tit, completedAt: null, location });
    }

    const folder: BookmarksFolderStruct = {
      version,
      icon: (payload.icn ?? null) as BookmarksFolderIcon | null,
      title: payload.tit,
      archivedAt: null,
    };

    return [folder, trades];
  } catch {
    return null;
  }
};

export { serialize, deserialize };
