/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react';
import { Box, Th, Tooltip, Tr } from '@chakra-ui/react';
import { HeaderGroup, flexRender } from '@tanstack/react-table';
import { DataGridSortIcon } from './SortIcon';

export type DataGridHeaderRowProps<TValue extends object> = {
  headerGroup: HeaderGroup<TValue>;
  activeIndex: number | null;
  mouseDown: (index: number) => void;
  onDoubleClick?: (id: string) => void;
};

export const DataGridHeaderRow = <TValue extends object>({
  headerGroup,
  activeIndex,
  mouseDown,
  onDoubleClick,
}: DataGridHeaderRowProps<TValue>) => (
  <Tr p={0} borderRight="1px solid gray" display="contents">
    {headerGroup.headers.map((header, i) => (
      <Th
        ref={header.column.columnDef.meta?.ref}
        color="gray.400"
        key={header.id}
        fontSize="sm"
        border="0.5px solid gray"
        px={1}
        position="relative"
      >
        <span
          style={{
            display: 'block',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            cursor: header.column.getCanSort() ? 'pointer' : undefined,
          }}
          onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
        >
          {header.isPlaceholder ? null : (
            <Tooltip label={header.column.columnDef.meta?.headerOptions?.tooltip}>
              <Box
                overflow="hidden"
                whiteSpace="nowrap"
                alignContent="center"
                width="100%"
                {...header.column.columnDef.meta?.headerStyleProps}
                onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                cursor={header.column.getCanSort() ? 'pointer' : undefined}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Box>
            </Tooltip>
          )}
          <DataGridSortIcon sortInfo={header.column.getIsSorted()} canSort={header.column.getCanSort()} />
        </span>
        <Box
          id={header.column.id}
          height="100%"
          display="block"
          position="absolute"
          cursor="col-resize"
          width="7px"
          right="-1px"
          top="0"
          zIndex="1"
          borderRight="8px solid transparent"
          borderColor={activeIndex === i ? '#517ea5' : undefined}
          _hover={{
            borderColor: '#ccc',
          }}
          onMouseDown={() => mouseDown(i)}
          onDoubleClick={() => onDoubleClick?.(header.column.id)}
        />
      </Th>
    ))}
  </Tr>
);
