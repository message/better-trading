type FlashMessageType = 'success' | 'warning' | 'alert';

interface FlashMessage {
  id: string;
  message: string;
  type: FlashMessageType;
  exiting?: boolean;
}

export type { FlashMessage, FlashMessageType };
