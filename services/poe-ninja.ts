import { fetchPoeNinjaResource } from '@/utils/extension-background';
import { slugify } from '@/utils/slugify';
import { getValue, setEphemeralValue } from '@/utils/storage';

interface PoeNinjaCurrenciesPayload {
  lines: { currencyTypeName: string; chaosEquivalent: number }[];
}

/** Chaos value of one unit of each currency, keyed by currency slug (e.g. `divine-orb`) */
type PoeNinjaCurrenciesRatios = Record<string, number>;

// The PoE 1 stash economy endpoint; the old `/api/data/currencyoverview` one is gone (404)
const CURRENCIES_RESOURCE_URI = '/poe1/api/economy/stash/current/currency/overview?type=Currency';
const RATIOS_CACHE_DURATION = 3600000; // 1 hour
const RATIOS_CACHE_KEY = 'poe-ninja-chaos-ratios-cache';

/** Fetches the chaos ratios of a PoE 1 league through the background script, cached for an hour per league */
const fetchChaosRatios = async (league: string): Promise<PoeNinjaCurrenciesRatios> => {
  const cachedRatios = await getValue<PoeNinjaCurrenciesRatios>(RATIOS_CACHE_KEY, league);
  if (cachedRatios) return cachedRatios;

  const uri = `${CURRENCIES_RESOURCE_URI}&league=${encodeURIComponent(league)}`;
  const payload = (await fetchPoeNinjaResource(uri)) as PoeNinjaCurrenciesPayload;

  const ratios = Object.fromEntries(
    payload.lines.map(({ currencyTypeName, chaosEquivalent }) => [slugify(currencyTypeName), chaosEquivalent]),
  );
  await setEphemeralValue(RATIOS_CACHE_KEY, ratios, new Date(Date.now() + RATIOS_CACHE_DURATION), league);

  return ratios;
};

export { fetchChaosRatios };
export type { PoeNinjaCurrenciesRatios };
