// TODO: Replace with actual flash message service when migrated
export interface FlashMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'alert';
  exiting?: boolean;
}
