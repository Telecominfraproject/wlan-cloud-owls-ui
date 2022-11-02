import * as React from 'react';
import { Box, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Actions from './Actions';
import NumberCell from 'components/TableCells/NumberCell';
import { Simulation, useGetSimulations } from 'hooks/Network/Simulations';
import { Column } from 'models/Table';

type Props = {
  onOpenEdit: (sim: Simulation) => void;
  onOpenHistory: (sim: Simulation) => void;
};

const useSimulationsTable = ({ onOpenEdit, onOpenHistory }: Props) => {
  const { t } = useTranslation();
  const query = useGetSimulations();
  const hiddenColumns = React.useState<string[]>([]);

  const numberCell = React.useCallback(
    (v: number, suffix?: string) => (
      <Box display="flex" w="100%">
        <Spacer />
        <NumberCell value={v} />
        {suffix}
      </Box>
    ),
    [],
  );
  const durationCell = React.useCallback(
    (v: number) => (v === 0 ? <Box textAlign="right">{t('simulation.infinite')}</Box> : numberCell(v, 's')),
    [],
  );
  const actionCell = React.useCallback(
    (sim: Simulation) => <Actions simulation={sim} openEdit={onOpenEdit} onOpenHistory={onOpenHistory} />,
    [],
  );

  const columns: Column<Simulation>[] = React.useMemo(
    (): Column<Simulation>[] => [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        alwaysShow: true,
      },
      {
        id: 'gateway',
        Header: t('simulation.controller'),
        Footer: '',
        accessor: 'gateway',
        disableSortBy: true,
      },
      {
        id: 'devices',
        Header: t('devices.title'),
        Footer: '',
        accessor: 'devices',
        Cell: (v) => numberCell(v.cell.row.original.devices),
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'deviceType',
        Header: t('common.type'),
        Footer: '',
        accessor: 'deviceType',
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'stateInterval',
        Header: t('simulation.state_interval'),
        Footer: '',
        accessor: 'stateInterval',
        Cell: (v) => numberCell(v.cell.row.original.stateInterval, 's'),
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'macPrefix',
        Header: t('simulation.mac_prefix'),
        Footer: '',
        accessor: 'macPrefix',
        customWidth: '50px',
        isMonospace: true,
        disableSortBy: true,
      },
      {
        id: 'minAssociations',
        Header: t('simulation.min_associations'),
        Footer: '',
        accessor: 'minAssociations',
        Cell: (v) => numberCell(v.cell.row.original.minAssociations),
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'maxAssociations',
        Header: t('simulation.max_associations'),
        Footer: '',
        accessor: 'maxAssociations',
        Cell: (v) => numberCell(v.cell.row.original.maxAssociations),
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'minClients',
        Header: t('simulation.min_clients'),
        Footer: '',
        accessor: 'minClients',
        Cell: (v) => numberCell(v.cell.row.original.minClients),
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'maxClients',
        Header: t('simulation.max_clients'),
        Footer: '',
        accessor: 'maxClients',
        Cell: (v) => numberCell(v.cell.row.original.maxClients),
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'length',
        Header: t('simulation.duration'),
        Footer: '',
        Cell: (v) => durationCell(v.cell.row.original.simulationLength),
        accessor: 'length',
        customWidth: '50px',
        disableSortBy: true,
      },
      {
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        Cell: (v) => actionCell(v.cell.row.original),
        disableSortBy: true,
        customWidth: '120px',
      },
    ],
    [t],
  );

  return React.useMemo(
    () => ({
      query,
      columns,
      hiddenColumns,
    }),
    [query, columns, hiddenColumns],
  );
};

export default useSimulationsTable;
