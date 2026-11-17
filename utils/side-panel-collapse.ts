import { deleteLocalValue, getLocalValue, setLocalValue } from '@/utils/storage';

// Stored as `bt-side-panel-collapsed`, same as 1.9.1 (storage util adds the prefix).
const COLLAPSED_STORAGE_KEY = 'side-panel-collapsed';

type CollapseListener = (isCollapsed: boolean) => void;

const listeners = new Set<CollapseListener>();

const getBody = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  return document.body;
};

const toggleBodyClass = (isCollapsed: boolean): void => {
  const body = getBody();
  if (!body) return;
  body.classList.toggle('bt-is-collapsed', isCollapsed);
};

const notifyListeners = (isCollapsed: boolean): void => {
  listeners.forEach(listener => listener(isCollapsed));
};

export const getIsSidePanelCollapsed = (): boolean => Boolean(getLocalValue(COLLAPSED_STORAGE_KEY));

export const initializeSidePanelCollapse = (): boolean => {
  const isCollapsed = getIsSidePanelCollapsed();
  toggleBodyClass(isCollapsed);
  return isCollapsed;
};

export const collapseSidePanel = (): void => {
  setLocalValue(COLLAPSED_STORAGE_KEY, 'true');
  toggleBodyClass(true);
  notifyListeners(true);
};

export const expandSidePanel = (): void => {
  deleteLocalValue(COLLAPSED_STORAGE_KEY);
  toggleBodyClass(false);
  notifyListeners(false);
};

export const subscribeToSidePanelCollapse = (listener: CollapseListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
