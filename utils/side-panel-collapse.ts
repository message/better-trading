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

export const getIsSidePanelCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    return Boolean(window.localStorage.getItem(COLLAPSED_STORAGE_KEY));
  } catch (error) {
    console.warn('Unable to read side panel collapsed state:', error);
    return false;
  }
};

export const initializeSidePanelCollapse = (): boolean => {
  const isCollapsed = getIsSidePanelCollapsed();
  toggleBodyClass(isCollapsed);
  return isCollapsed;
};

export const collapseSidePanel = (): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, 'true');
  } catch (error) {
    console.warn('Unable to persist collapsed state:', error);
  }

  toggleBodyClass(true);
  notifyListeners(true);
};

export const expandSidePanel = (): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(COLLAPSED_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear collapsed state:', error);
  }

  toggleBodyClass(false);
  notifyListeners(false);
};

export const subscribeToSidePanelCollapse = (listener: CollapseListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
