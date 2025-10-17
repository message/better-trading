import { compareExactTradeLocations, parseCurrentPath } from '@/utils/trade-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ExactTradeLocationStruct, TradeLocationChangeEvent } from '@/types/trade-location';

// Constants
const LOCATION_POLLING_INTERVAL = 500; // ms

interface UseTradeLocationOptions {
  onChange?: (event: TradeLocationChangeEvent) => void;
}

const useTradeLocation = (options?: UseTradeLocationOptions) => {
  const { onChange } = options || {};
  const [currentTradeLocation, setCurrentTradeLocation] = useState<ExactTradeLocationStruct>(() =>
    parseCurrentPath(window.location.pathname),
  );
  const lastTradeLocationRef = useRef<ExactTradeLocationStruct>(currentTradeLocation);
  const pollingIntervalRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const checkLocationChange = useCallback(() => {
    if (!document.hasFocus()) return;

    const newLocation = parseCurrentPath(window.location.pathname);

    if (!compareExactTradeLocations(lastTradeLocationRef.current, newLocation)) {
      const changeEvent: TradeLocationChangeEvent = {
        oldTradeLocation: lastTradeLocationRef.current,
        newTradeLocation: newLocation,
      };

      setCurrentTradeLocation(newLocation);
      lastTradeLocationRef.current = newLocation;

      if (onChangeRef.current) {
        onChangeRef.current(changeEvent);
      }
    }
  }, []);

  const startLocationPolling = useCallback(() => {
    if (!document.hasFocus()) return;

    if (pollingIntervalRef.current !== null) return;

    checkLocationChange();
    pollingIntervalRef.current = window.setInterval(checkLocationChange, LOCATION_POLLING_INTERVAL);
  }, [checkLocationChange]);

  const stopLocationPolling = useCallback(() => {
    if (pollingIntervalRef.current !== null) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleFocus = () => startLocationPolling();
    const handleBlur = () => stopLocationPolling();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Start polling on mount
    startLocationPolling();

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      stopLocationPolling();
    };
  }, [startLocationPolling, stopLocationPolling]);

  return {
    currentTradeLocation,
    version: currentTradeLocation.version,
    type: currentTradeLocation.type,
    league: currentTradeLocation.league,
    slug: currentTradeLocation.slug,
    isLive: currentTradeLocation.isLive,
  };
};

export { useTradeLocation };
