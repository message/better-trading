// Types from old-extension trade-location types
export type TradeSiteVersion = '1' | '2';

export interface TradeLocationStruct {
  version: TradeSiteVersion;
  slug: string | null;
  type: string | null;
  league: string | null;
}

export interface TradeLocationHistoryStruct extends Required<TradeLocationStruct> {
  id: string;
  title: string;
  createdAt: string;
}
