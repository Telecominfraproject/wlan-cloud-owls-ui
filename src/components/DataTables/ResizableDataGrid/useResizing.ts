import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { UseDataGridReturn } from './useDataGrid';
import { useWindowDimensions } from 'hooks/useWindowDimensions';

const TABLE_BASE_OFFSET = -16;
const DEFAULT_MIN_CELL_WIDTH = 120;

type Props<TValue extends object> = {
  table: Table<TValue>;
  controller: UseDataGridReturn;
};

export const useResizing = <TValue extends object>({ table, controller }: Props<TValue>) => {
  const tableRef = React.useRef<HTMLTableElement>(null);
  const [tableOffset, setTableOffset] = React.useState(0);
  const [tableWidth, setTableWidth] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const { innerWidth } = useWindowDimensions({ delay: 1000 });

  const mouseDown = React.useCallback((index: number) => {
    const boundClientRect = tableRef.current?.getBoundingClientRect();
    setTableOffset(boundClientRect ? boundClientRect.left + TABLE_BASE_OFFSET : TABLE_BASE_OFFSET);
    setTableWidth(boundClientRect?.width ?? 0);
    setActiveIndex(index);
  }, []);

  const mouseMove = React.useCallback(
    (e: MouseEvent) => {
      const gridColumns =
        table.getHeaderGroups()[0]?.headers.map((colHeader, i) => {
          const col = colHeader.column.columnDef;

          if (i === activeIndex) {
            const width = e.clientX - (col.meta?.ref?.current?.offsetLeft ?? 0) - tableOffset;

            if (width >= (controller.columnWidthsSettings?.[colHeader.id]?.minWidth ?? DEFAULT_MIN_CELL_WIDTH)) {
              return `${width}px`;
            }
          }
          return `${col.meta?.ref?.current?.offsetWidth}px`;
        }) ?? [];

      if (tableRef.current) tableRef.current.style.gridTemplateColumns = `${gridColumns.join(' ')}`;
    },
    [activeIndex, tableOffset, table.getHeaderGroups()[0]?.headers],
  );

  const mouseUp = React.useCallback(() => {
    const temp = activeIndex;

    setActiveIndex(null);

    // Save column widths
    if (temp !== null) {
      const column = table.getHeaderGroups()[0]?.headers[temp]?.column;
      const currentWidth = tableRef.current?.style.gridTemplateColumns?.split(' ')[temp];

      if (column && currentWidth) {
        try {
          const newWidth = parseInt(currentWidth.replace('px', ''), 10);
          controller.setColumnWidth(column.id, newWidth);
        } catch (e) {
          // Do nothing
        }
      }
    }
  }, [activeIndex, table.getHeaderGroups()[0]?.headers]);

  const onColumnDoubleClick = React.useCallback(
    (id: string) => {
      const currWidth = controller.columnWidths[id];
      const settings = controller.columnWidthsSettings?.[id];
      if (settings) {
        // Go to highest width to fill up table width, if that's not possible, go to suggested width
        const totalWidthOfOtherColumns = Object.entries(controller.columnWidths)
          .filter(
            ([key]) =>
              key !== id &&
              table.getHeaderGroups()[0]?.headers &&
              table.getHeaderGroups()[0]?.headers.find((header) => header.id === key) !== undefined,
          )
          .reduce((acc, [, curr]) => acc + curr, 0);
        const newWidth = tableWidth - totalWidthOfOtherColumns;

        if (newWidth < settings.minWidth || currWidth === newWidth) {
          controller.setColumnWidth(id, currWidth === settings.minWidth ? settings.suggestedWidth : settings.minWidth);
        } else {
          controller.setColumnWidth(id, newWidth);
        }
      }
    },
    [controller.setColumnWidth, controller.columnWidths, tableWidth, table.getHeaderGroups()[0]?.headers.length],
  );

  const removeListeners = React.useCallback(() => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
  }, [mouseMove, mouseUp]);

  React.useEffect(() => {
    const minWidths = table
      .getHeaderGroups()[0]
      ?.headers.map((v) => {
        const currentWidth = controller.columnWidths[v.id];
        if (currentWidth) {
          return `${currentWidth}px`;
        }

        return `${controller.columnWidthsSettings?.[v.id]?.suggestedWidth ?? DEFAULT_MIN_CELL_WIDTH}px`;
      })
      .join(' ');
    if (minWidths && tableRef.current) tableRef.current.style.gridTemplateColumns = minWidths;
  }, [table.getHeaderGroups()[0]?.headers.length]);

  React.useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    } else {
      removeListeners();
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, removeListeners, mouseUp, mouseMove]);

  React.useEffect(() => {
    const minWidths = table
      .getHeaderGroups()[0]
      ?.headers.map((v) =>
        controller.columnWidths[v.id] !== undefined
          ? `${controller.columnWidths[v.id]}px`
          : `${controller.columnWidthsSettings?.[v.id]?.minWidth ?? DEFAULT_MIN_CELL_WIDTH}px`,
      )
      .join(' ');
    if (minWidths && tableRef.current) tableRef.current.style.gridTemplateColumns = minWidths;
  }, [controller.columnWidths]);

  React.useEffect(() => {
    const boundClientRect = tableRef.current?.getBoundingClientRect();
    setTableOffset(boundClientRect ? boundClientRect.left + TABLE_BASE_OFFSET : TABLE_BASE_OFFSET);
    setTableWidth(boundClientRect?.width ?? 0);
  }, [innerWidth]);

  return {
    tableRef,
    onColumnDoubleClick: controller.columnWidthsSettings ? onColumnDoubleClick : undefined,
    mouseDown,
    mouseUp,
    mouseMove,
    activeIndex,
    tableOffset,
  };
};

export type UseResizingReturn = ReturnType<typeof useResizing>;
