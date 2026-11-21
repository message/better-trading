import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/utils/combine';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/utils/reorder';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type React from 'react';

interface SortableOptions {
  /** Items only drop onto items of the same list (Trades never land among Folders) */
  listId: string;
  index: number;
  count: number;
  /**
   * Called with the new position. The caller must re-render the list in the new order synchronously (optimistically),
   * so the next key press reads the new index, then persist it.
   */
  onMove: (fromIndex: number, toIndex: number) => void;
  /** While dragging: show the list with the item moved, without persisting (see `usePreviewOrder`) */
  onPreview: (fromIndex: number, toIndex: number) => void;
  /** The drag was cancelled (Esc, dropped outside every drop target): show the original order again */
  onCancel: () => void;
}

/**
 * Order of a list while one of its items is dragged: `items` is the preview, the original order when not dragging.
 * Wire `preview` and `cancel` to `useSortable`; `cancel` also resets after a drop, once `onMove` persisted the order.
 */
const usePreviewOrder = <T>(original: T[]) => {
  const [previewed, setPreviewed] = useState<T[] | null>(null);
  const preview = (fromIndex: number, toIndex: number) =>
    setPreviewed(current => reorder({ list: current ?? original, startIndex: fromIndex, finishIndex: toIndex }));
  const cancel = () => setPreviewed(null);
  return { items: previewed ?? original, preview, cancel };
};

// One document-wide drop target serves every sortable list: it exists while at least one zone is registered
type ZoneHandler = (clientY: number, source: ElementDragPayload) => void;
const zones = new Map<string, ZoneHandler>();
let stopZones: (() => void) | undefined;

interface SortableZoneOptions {
  /** The list the zone belongs to, as passed to `useSortable` */
  listId: string;
  /** The element whose children are the items of the list, in the order they are displayed */
  listRef: React.RefObject<HTMLElement | null>;
  /** See `SortableOptions.onPreview` */
  onPreview: (fromIndex: number, toIndex: number) => void;
}

/**
 * Makes the whole document a drop zone for a list: dropping an item anywhere (not only over the list) keeps the order
 * previewed so far, and wherever the pointer is on the screen, the item takes the place matching its vertical position
 * (past the middle of the items it crossed), so it also follows the pointer beside, above or below the list.
 * Esc and a drop outside the window still cancel, as they end with no drop target.
 */
const useSortableZone = ({ listId, listRef, onPreview }: SortableZoneOptions) => {
  const latestRef = useRef(onPreview);
  useLayoutEffect(() => {
    latestRef.current = onPreview;
  });

  useEffect(() => {
    zones.set(listId, (clientY, source) => {
      const items = Array.from(listRef.current?.children ?? []);
      const fromIndex = source.data.index as number;
      // The DOM lags behind a move another drop target just made: the next drag event catches up
      if (!items[fromIndex]?.contains(source.element)) return;
      const isPastMiddleOf = (item: Element) => {
        const { top, height } = item.getBoundingClientRect();
        return clientY - top > height / 2;
      };
      let toIndex = fromIndex;
      while (toIndex < items.length - 1 && isPastMiddleOf(items[toIndex + 1])) toIndex++;
      while (toIndex > 0 && !isPastMiddleOf(items[toIndex - 1])) toIndex--;
      if (toIndex === fromIndex) return;
      // Drag events can outrun the re-render: remember the new position right away
      source.data.index = toIndex;
      latestRef.current(fromIndex, toIndex);
    });
    if (zones.size === 1) {
      stopZones = dropTargetForElements({
        element: document.documentElement,
        canDrop: ({ source }) => zones.has(source.data.listId as string),
        onDrag: ({ source, location }) =>
          zones.get(source.data.listId as string)?.(location.current.input.clientY, source),
      });
    }
    return () => {
      zones.delete(listId);
      if (zones.size === 0) stopZones?.();
    };
  }, [listId, listRef]);
};

/**
 * One item of a vertical list sortable with Pragmatic Drag and Drop: dragged by its handle, moving live as the pointer
 * crosses the middle of another item (in the direction of travel, so items of different heights do not oscillate),
 * persisted once on drop. Also moved one step with ArrowUp / ArrowDown while the handle has focus.
 */
const useSortable = <TItem extends HTMLElement, THandle extends HTMLElement>({
  listId,
  index,
  count,
  onMove,
  onPreview,
  onCancel,
}: SortableOptions) => {
  const itemRef = useRef<TItem>(null);
  const handleRef = useRef<THandle>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startIndexRef = useRef(0);

  // Read at drag time, so the registration below survives re-renders mid-drag
  const latestRef = useRef({ index, onMove, onPreview, onCancel });
  // Drop targets read the dragged item's current position from the drag data, which `getInitialData` made once
  const dragDataRef = useRef<{ index: number }>(null);
  useLayoutEffect(() => {
    latestRef.current = { index, onMove, onPreview, onCancel };
    if (dragDataRef.current) dragDataRef.current.index = index;
  });

  useEffect(() => {
    const element = itemRef.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => {
          const data = { listId, index: latestRef.current.index };
          dragDataRef.current = data;
          return data;
        },
        onDragStart: () => {
          startIndexRef.current = latestRef.current.index;
          setIsDragging(true);
        },
        onDrop: ({ location }) => {
          setIsDragging(false);
          dragDataRef.current = null;
          // Dropped over no item of the list (Esc included)
          if (location.current.dropTargets.length === 0) return latestRef.current.onCancel();
          const toIndex = latestRef.current.index;
          if (toIndex === startIndexRef.current) return latestRef.current.onCancel();
          latestRef.current.onMove(startIndexRef.current, toIndex);
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => source.data.listId === listId,
        onDrag: ({ source, location }) => {
          if (source.element === element) return;
          const fromIndex = source.data.index as number;
          const targetIndex = latestRef.current.index;
          const { top, height } = element.getBoundingClientRect();
          const isPastMiddle = location.current.input.clientY - top > height / 2;
          if (fromIndex < targetIndex ? !isPastMiddle : isPastMiddle) return;
          // Drag events can outrun the re-render: remember the new position right away
          source.data.index = targetIndex;
          latestRef.current.onPreview(fromIndex, targetIndex);
        },
      }),
    );
  }, [listId]);

  // Moving the DOM node blurs the handle: give focus back once the item renders at its new index
  const refocusRef = useRef(false);
  useLayoutEffect(() => {
    if (!refocusRef.current) return;
    refocusRef.current = false;
    handleRef.current?.focus();
  }, [index]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const toIndex = index + (event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0);
    if (toIndex === index || toIndex < 0 || toIndex >= count) return;
    event.preventDefault();
    refocusRef.current = true;
    onMove(index, toIndex);
  };

  const handleProps = { ref: handleRef, onKeyDown: handleKeyDown, 'aria-keyshortcuts': 'ArrowUp ArrowDown' };

  return { itemRef, handleProps, isDragging };
};

export { usePreviewOrder, useSortable, useSortableZone };
