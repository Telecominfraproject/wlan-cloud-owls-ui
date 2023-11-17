import React from 'react';
import { Icon } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, Circle } from '@phosphor-icons/react';
import { SortDirection } from '@tanstack/react-table';

export type DataGridSortIconProps = {
  sortInfo: false | SortDirection;
  canSort: boolean;
};

export const DataGridSortIcon = ({ sortInfo, canSort }: DataGridSortIconProps) => {
  if (canSort) {
    if (sortInfo) {
      return sortInfo === 'desc' ? (
        <Icon ml={1} boxSize={3} as={ArrowDown} position="absolute" top="5px" right="12px" />
      ) : (
        <Icon ml={1} boxSize={3} as={ArrowUp} position="absolute" top="5px" right="12px" />
      );
    }
    return <Icon ml={1} boxSize={3} as={Circle} position="absolute" top="5px" right="12px" />;
  }
  return null;
};
