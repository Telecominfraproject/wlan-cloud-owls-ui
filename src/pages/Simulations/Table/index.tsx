import * as React from 'react';
import { Box, Heading, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CreateSimulationModal from './CreateModal';
import HistoryModal from './HistoryModal';
import UpdateSimulationModal from './UpdateModal';
import useSimulationsTable from './useSimulationsTable';
import { RefreshButton } from 'components/Buttons/RefreshButton';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { ColumnPicker } from 'components/DataTables/ColumnPicker';
import { DataTable } from 'components/DataTables/DataTable';
import { Simulation } from 'hooks/Network/Simulations';
import { Column } from 'models/Table';

const SimulationsTable = () => {
  const { t } = useTranslation();
  const [sim, setSim] = React.useState<Simulation | undefined>(undefined);
  const modalProps = useDisclosure();
  const historyModalProps = useDisclosure();
  const onOpenEdit = (newSim: Simulation) => {
    setSim(newSim);
    modalProps.onOpen();
  };
  const onOpenHistory = (newSim: Simulation) => {
    setSim(newSim);
    historyModalProps.onOpen();
  };
  const { query, columns, hiddenColumns } = useSimulationsTable({ onOpenEdit, onOpenHistory });

  return (
    <Card>
      <CardHeader>
        <Heading size="md" my="auto">
          {t('simulation.other')} {query.data ? `(${query.data.list?.length})` : null}
        </Heading>
        <Spacer />
        <HStack spacing={2}>
          <ColumnPicker
            columns={columns as Column<unknown>[]}
            hiddenColumns={hiddenColumns[0]}
            setHiddenColumns={hiddenColumns[1]}
            preference="simulator.simulations.hiddenColumns"
          />
          <CreateSimulationModal />
          <RefreshButton onClick={query.refetch} isFetching={query.isFetching} />
        </HStack>
      </CardHeader>
      <CardBody>
        <Box w="100%" overflowX="auto">
          <DataTable
            columns={columns as Column<object>[]}
            saveSettingsId="simulator.simulations.table"
            data={query.data?.list ?? []}
            obj={t('simulation.other')}
            sortBy={[{ id: 'name', desc: false }]}
            minHeight="400px"
            hiddenColumns={hiddenColumns[0]}
          />
        </Box>
        {sim !== undefined && <UpdateSimulationModal modalProps={modalProps} simulation={sim} />}
        {sim !== undefined && <HistoryModal modalProps={historyModalProps} simulation={sim} />}
      </CardBody>
    </Card>
  );
};

export default SimulationsTable;
