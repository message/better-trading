import { Base64 } from 'js-base64';
import type { BookmarksFolderIcon, BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type { TradeSiteVersion } from '@/types/trade-location';

type ExportVersion = 1 | 2 | 3;

interface ExportedFolderStructV1 {
  icn: string;
  tit: string;
  trs: Array<{
    tit: string;
    loc: string;
  }>;
}

interface ExportedFolderStructV3 extends ExportedFolderStructV1 {
  ver: TradeSiteVersion;
}

const serialize = (folder: BookmarksFolderStruct, trades: BookmarksTradeStruct[]): string => {
  const payload: ExportedFolderStructV3 = {
    icn: folder.icon as string,
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

const deserialize = (serializedFolder: string): [BookmarksFolderStruct, BookmarksTradeStruct[]] | null => {
  try {
    const exportVersion = parseExportVersion(serializedFolder);
    const potentialPayload: ExportedFolderStructV1 = JSON.parse(jsonFromExportString(exportVersion, serializedFolder));

    const folder: BookmarksFolderStruct = {
      version: '1',
      icon: potentialPayload.icn as BookmarksFolderIcon,
      title: potentialPayload.tit,
      archivedAt: null,
    };

    if (exportVersion >= 3) {
      folder.version = (potentialPayload as ExportedFolderStructV3).ver;
    }

    const trades: BookmarksTradeStruct[] = potentialPayload.trs.map(trade => {
      let version: string, type: string, slug: string;
      if (exportVersion >= 3) {
        [version, type, slug] = trade.loc.split(':');
      } else {
        version = '1';
        [type, slug] = trade.loc.split(':');
      }

      return {
        title: trade.tit,
        completedAt: null,
        location: {
          version: version as TradeSiteVersion,
          type,
          slug,
        },
      };
    });

    return [folder, trades];
  } catch {
    return null;
  }
};

export { serialize, deserialize };
