import * as React from 'react';
import { Box, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Actions from './Actions';
import { DataGridColumn, useDataGrid } from 'components/DataTables/DataGrid/useDataGrid';
import NumberCell from 'components/TableCells/NumberCell';
import { Simulation, useGetSimulations } from 'hooks/Network/Simulations';

type Props = {
  onOpenEdit: (sim: Simulation) => void;
  onOpenHistory: (sim: Simulation) => void;
  onOpenDevicesDelete: (sim: Simulation) => void;
};

const useSimulationsTable = ({ onOpenEdit, onOpenHistory }: Props) => {
  const { t } = useTranslation();
  const query = useGetSimulations();
  const tableController = useDataGrid({
    tableSettingsId: 'simulator.simulations.table',
    defaultOrder: [
      'name',
      'gateway',
      'devices',
      'deviceType',
      'macPrefix',
      'minAssociations',
      'maxAssociations',
      'minClients',
      'maxClients',
      'length',
      'actions',
    ],
    columnWidthsSettings: {
      name: {
        minWidth: 200,
        suggestedWidth: 200,
        maxWidth: 600,
      },
      gateway: {
        minWidth: 200,
        suggestedWidth: 230,
        maxWidth: 600,
      },
      devices: {
        minWidth: 50,
        suggestedWidth: 80,
        maxWidth: 100,
      },
      deviceType: {
        minWidth: 50,
        suggestedWidth: 140,
        maxWidth: 600,
      },
      macPrefix: {
        minWidth: 50,
        suggestedWidth: 70,
        maxWidth: 100,
      },
      minAssociations: {
        minWidth: 50,
        suggestedWidth: 90,
        maxWidth: 100,
      },
      maxAssociations: {
        minWidth: 50,
        suggestedWidth: 90,
        maxWidth: 100,
      },
      minClients: {
        minWidth: 50,
        suggestedWidth: 120,
        maxWidth: 200,
      },
      maxClients: {
        minWidth: 50,
        suggestedWidth: 120,
        maxWidth: 200,
      },
      length: {
        minWidth: 50,
        suggestedWidth: 95,
        maxWidth: 100,
      },
      actions: {
        minWidth: 165,
        suggestedWidth: 165,
        maxWidth: 165,
      },
    },
  });

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

  const columns: DataGridColumn<Simulation>[] = React.useMemo(
    (): DataGridColumn<Simulation>[] => [
      {
        id: 'name',
        header: t('common.name'),
        accessorKey: 'name',
        meta: {
          anchored: true,
          alwaysShow: true,
        },
      },
      {
        id: 'gateway',
        header: t('simulation.controller'),
        accessorKey: 'gateway',
        enableSorting: false,
      },
      {
        id: 'devices',
        header: t('devices.title'),
        accessorKey: 'devices',
        cell: (v) => numberCell(v.cell.row.original.devices),
        meta: {
          customWidth: '50px',
        },
        enableSorting: false,
      },
      {
        id: 'deviceType',
        header: t('common.type'),
        accessorKey: 'deviceType',
        meta: {
          customWidth: '50px',
        },
        enableSorting: false,
      },
      {
        id: 'macPrefix',
        header: 'MAC',
        accessorKey: 'macPrefix',
        meta: {
          customWidth: '50px',
          isMonospace: true,
          columnSelectorOptions: {
            label: 'MAC Prefix',
          },
          headerOptions: {
            tooltip: t('simulation.mac_prefix'),
          },
        },
        enableSorting: false,
      },
      {
        id: 'minAssociations',
        header: 'Min. UEs',
        accessorKey: 'minAssociations',
        cell: (v) => numberCell(v.cell.row.original.minAssociations),
        meta: {
          customWidth: '50px',
        },
        enableSorting: false,
      },
      {
        id: 'maxAssociations',
        header: 'Max. UEs',
        accessorKey: 'maxAssociations',
        cell: (v) => numberCell(v.cell.row.original.maxAssociations),
        meta: {
          customWidth: '50px',
        },
        enableSorting: false,
      },
      {
        id: 'minClients',
        header: t('simulation.min_clients'),
        accessorKey: 'minClients',
        cell: (v) => numberCell(v.cell.row.original.minClients),
        meta: {
          customWidth: '50px',
        },
        enableSorting: false,
      },
      {
        id: 'maxClients',
        header: t('simulation.max_clients'),
        accessorKey: 'maxClients',
        cell: (v) => numberCell(v.cell.row.original.maxClients),
        meta: {
          customWidth: '50px',
        },
        enableSorting: false,
      },
      {
        id: 'length',
        header: t('simulation.duration'),
        cell: (v) => durationCell(v.cell.row.original.simulationLength),
        accessorKey: 'length',
        meta: {
          customWidth: '50px',
        },
        enableSorting: false,
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: (v) => actionCell(v.cell.row.original),
        enableSorting: false,
        meta: {
          customWidth: '110px',
        },
      },
    ],
    [t],
  );

  return React.useMemo(
    () => ({
      query,
      columns,
      tableController,
    }),
    [query, columns, tableController],
  );
};

export default useSimulationsTable;
