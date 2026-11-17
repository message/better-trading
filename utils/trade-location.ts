// Types
import type { ExactTradeLocationStruct, TradeLocationStruct, TradeSiteVersion } from '@/types/trade-location';

// Constants
const BASE_URL = 'https://www.pathofexile.com';
const TRADE_REALMS = ['xbox', 'sony', 'poe2'];

const parseVersion = (tradePathPrefix: string): TradeSiteVersion => (tradePathPrefix === 'trade2' ? '2' : '1');

const decodePart = (part: string): string => {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
};

const parseCurrentPath = (pathname: string): ExactTradeLocationStruct => {
  const pathParts = pathname.split('/').slice(1).map(decodePart);
  let versionPart: string;
  let type: string | undefined;
  let league: string | undefined;
  let slug: string | undefined;
  let live: string | undefined;

  if (TRADE_REALMS.includes(pathParts[2])) {
    let realm: string;
    let leagueInRealm: string;
    [versionPart, type, realm, leagueInRealm, slug, live] = pathParts;
    league = `${realm}/${leagueInRealm}`;
  } else {
    [versionPart, type, league, slug, live] = pathParts;
  }

  return {
    version: parseVersion(versionPart),
    type: type || null,
    league: league || null,
    slug: slug || null,
    isLive: live === 'live',
  };
};

const compareTradeLocations = (locationA: TradeLocationStruct, locationB: TradeLocationStruct): boolean =>
  locationA.version === locationB.version &&
  locationA.league === locationB.league &&
  locationA.slug === locationB.slug &&
  locationA.type === locationB.type;

const compareExactTradeLocations = (
  locationA: ExactTradeLocationStruct,
  locationB: ExactTradeLocationStruct,
): boolean => compareTradeLocations(locationA, locationB) && locationA.isLive === locationB.isLive;

const getTradeUrl = (version: TradeSiteVersion, type: string, slug: string, league: string): string => {
  const basePath = version === '2' ? 'trade2' : 'trade';
  const encodedLeague = league.split('/').map(encodeURIComponent).join('/');
  return [BASE_URL, basePath, type, encodedLeague, slug].join('/');
};

export { parseCurrentPath, compareTradeLocations, compareExactTradeLocations, getTradeUrl };
