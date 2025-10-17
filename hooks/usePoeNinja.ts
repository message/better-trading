import { fetchPoeNinjaResource } from '@/utils/extension-background';
import { slugify } from '@/utils/slugify';
import { getValue, setEphemeralValue } from '@/utils/storage';
import { useCallback, useState } from 'react';

interface PoeNinjaCurrenciesPayloadLine {
  currencyTypeName: string;
  chaosEquivalent: number;
}

interface PoeNinjaCurrenciesPayload {
  lines: PoeNinjaCurrenciesPayloadLine[];
}

interface PoeNinjaCurrenciesRatios {
  [key: string]: number;
}

const CURRENCIES_RESOURCE_URI = '/data/currencyoverview?type=Currency';
const RATIOS_CACHE_DURATION = 3600000; // 1 hour
const RATIOS_CACHE_KEY = 'poe-ninja-chaos-ratios-cache';

const parseChaosRatios = (payload: PoeNinjaCurrenciesPayload): PoeNinjaCurrenciesRatios =>
  payload.lines.reduce(
    (acc: PoeNinjaCurrenciesRatios, { currencyTypeName, chaosEquivalent }: PoeNinjaCurrenciesPayloadLine) => {
      acc[slugify(currencyTypeName)] = chaosEquivalent;

      return acc;
    },
    {},
  );

/**
 * React hook for fetching and caching PoE Ninja currency ratios
 *
 * Provides chaos equivalent prices for all currencies from poe.ninja API
 * with automatic 1-hour caching to minimize API calls.
 *
 * @returns Object with chaosRatios state and fetchChaosRatiosFor function
 *
 * @example
 * const { chaosRatios, fetchChaosRatiosFor } = usePoeNinja();
 *
 * useEffect(() => {
 *   fetchChaosRatiosFor('Standard');
 * }, []);
 */
const usePoeNinja = () => {
  const [chaosRatios, setChaosRatios] = useState<PoeNinjaCurrenciesRatios | null>(null);

  const fetchChaosRatiosFor = useCallback(async (league: string): Promise<PoeNinjaCurrenciesRatios> => {
    // Check cache first
    const cachedRatios = await getValue<PoeNinjaCurrenciesRatios>(RATIOS_CACHE_KEY, league);
    if (cachedRatios) {
      setChaosRatios(cachedRatios);
      return cachedRatios;
    }

    // Fetch from poe.ninja
    const uri = `${CURRENCIES_RESOURCE_URI}&league=${league}`;
    const payload = (await fetchPoeNinjaResource(uri)) as PoeNinjaCurrenciesPayload;

    // Parse ratios
    const ratios = parseChaosRatios(payload);

    // Cache for 1 hour
    const expirationDate = new Date(Date.now() + RATIOS_CACHE_DURATION);
    await setEphemeralValue(RATIOS_CACHE_KEY, ratios, expirationDate, league);

    setChaosRatios(ratios);
    return ratios;
  }, []);

  return { chaosRatios, fetchChaosRatiosFor };
};

export { usePoeNinja };
export type { PoeNinjaCurrenciesRatios, PoeNinjaCurrenciesPayload, PoeNinjaCurrenciesPayloadLine };
