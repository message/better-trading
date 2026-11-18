import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/utils/combine';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/attach-closest-edge';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
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
}

/**
 * One item of a vertical list sortable with Pragmatic Drag and Drop: dragged by its handle, dropped above or below
 * another item, or moved one step with ArrowUp / ArrowDown while the handle has focus.
 */
const useSortable = <TItem extends HTMLElement, THandle extends HTMLElement>({
  listId,
  index,
  count,
  onMove,
}: SortableOptions) => {
  const itemRef = useRef<TItem>(null);
  const handleRef = useRef<THandle>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropEdge, setDropEdge] = useState<Edge | null>(null);

  // Read at drag time, so the registration below survives re-renders mid-drag
  const latestRef = useRef({ index, onMove });
  useLayoutEffect(() => {
    latestRef.current = { index, onMove };
  });

  useEffect(() => {
    const element = itemRef.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({ listId, index: latestRef.current.index }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => source.data.listId === listId,
        getData: ({ input }) => attachClosestEdge({}, { element, input, allowedEdges: ['top', 'bottom'] }),
        onDrag: ({ self, source }) => setDropEdge(source.element === element ? null : extractClosestEdge(self.data)),
        onDragLeave: () => setDropEdge(null),
        onDrop: ({ self, source }) => {
          setDropEdge(null);
          const fromIndex = source.data.index as number;
          const toIndex = getReorderDestinationIndex({
            startIndex: fromIndex,
            indexOfTarget: latestRef.current.index,
            closestEdgeOfTarget: extractClosestEdge(self.data),
            axis: 'vertical',
          });
          if (toIndex !== fromIndex) latestRef.current.onMove(fromIndex, toIndex);
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

  return { itemRef, handleProps, isDragging, dropEdge };
};

export { useSortable };
