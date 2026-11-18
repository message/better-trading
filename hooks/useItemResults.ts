import { useItemResultsContext } from '@/contexts/ItemResultsContext';

/**
 * Enhancer settings and pinned items, for page components.
 * Does NOT mount the item enhancer: `ItemResultsProvider` does, once.
 */
const useItemResults = useItemResultsContext;

export { useItemResults };
