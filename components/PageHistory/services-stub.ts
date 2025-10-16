// TODO: Replace with real trade-location service when migrated
import type { TradeLocationHistoryStruct } from './types';

export interface TradeLocationServiceStub {
  fetchHistoryEntries: () => Promise<TradeLocationHistoryStruct[]>;
  clearHistoryEntries: () => Promise<void>;
  on: (event: string, context: unknown, handler: () => void) => void;
  off: (event: string, context: unknown, handler: () => void) => void;
}

export const tradeLocationServiceStub: TradeLocationServiceStub = {
  fetchHistoryEntries: async () =>
    // TODO: Implement real API call to fetch history entries
    [],
  clearHistoryEntries: async () => {
    // TODO: Implement real API call to clear history entries
  },
  on: () => {
    // TODO: Implement real event subscription
  },
  off: () => {
    // TODO: Implement real event unsubscription
  },
};

// TODO: Replace with real flash messages service/hook when migrated
export interface FlashMessagesServiceStub {
  success: (message: string) => void;
  alert: (message: string) => void;
}

export const flashMessagesServiceStub: FlashMessagesServiceStub = {
  success: (message: string) => {
    // TODO: Implement real flash message success
    console.log('Success:', message);
  },
  alert: (message: string) => {
    // TODO: Implement real flash message alert
    console.error('Alert:', message);
  },
};

// TODO: Implement real trade URL generation helper when migrated
export const generateTradeUrl = (entry: TradeLocationHistoryStruct): string => {
  // TODO: Implement real trade URL generation logic
  const baseUrl = entry.version === '1' ? 'https://www.pathofexile.com/trade' : 'https://www.pathofexile.com/trade2';
  return `${baseUrl}/${entry.type}/${entry.league}/${entry.slug}`;
};
