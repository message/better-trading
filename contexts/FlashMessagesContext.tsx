import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { FlashMessage, FlashMessageType } from '@/types/flash-message';
import type { ReactNode } from 'react';

// Same timings as ember-cli-flash in 1.9.1 (timeout 4500, extendedTimeout 200)
const FLASH_TIMEOUT_MS = 4500;
const FLASH_EXIT_MS = 200;

interface FlashMessagesContextValue {
  flashMessages: FlashMessage[];
  addFlash: (message: string, type: FlashMessageType) => void;
  dismissFlash: (id: string) => void;
}

const FlashMessagesContext = createContext<FlashMessagesContextValue | null>(null);

const FlashMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [flashMessages, setFlashMessages] = useState<FlashMessage[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const nextId = useRef(0);
  // Ids already being dismissed: a click and the auto-dismiss timer must not both run the exit
  const dismissing = useRef(new Set<string>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  }, []);

  const dismissFlash = useCallback(
    (id: string) => {
      if (dismissing.current.has(id)) return;
      dismissing.current.add(id);
      setFlashMessages(current => current.map(flash => (flash.id === id ? { ...flash, exiting: true } : flash)));
      schedule(() => {
        dismissing.current.delete(id);
        setFlashMessages(current => current.filter(flash => flash.id !== id));
      }, FLASH_EXIT_MS);
    },
    [schedule],
  );

  const addFlash = useCallback(
    (message: string, type: FlashMessageType) => {
      const id = String(nextId.current++);
      setFlashMessages(current => [...current, { id, message, type }]);
      schedule(() => dismissFlash(id), FLASH_TIMEOUT_MS);
    },
    [schedule, dismissFlash],
  );

  const value = useMemo(() => ({ flashMessages, addFlash, dismissFlash }), [flashMessages, addFlash, dismissFlash]);

  return <FlashMessagesContext.Provider value={value}>{children}</FlashMessagesContext.Provider>;
};

const useFlashMessagesContext = (): FlashMessagesContextValue => {
  const context = useContext(FlashMessagesContext);
  if (!context) throw new Error('useFlashMessagesContext must be used within a FlashMessagesProvider');

  return context;
};

export { FlashMessagesContext, FlashMessagesProvider, useFlashMessagesContext };
