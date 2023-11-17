import * as React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CreateSimulationModal from './CreateModal';
import DeleteSimulationDevicesModal from './DeleteDevicesModal';
import HistoryModal from './HistoryModal';
import UpdateSimulationModal from './UpdateModal';
import useSimulationsTable from './useSimulationsTable';
import { ResizableDataGrid } from 'components/DataTables/ResizableDataGrid';
import { Simulation } from 'hooks/Network/Simulations';

const SimulationsTable = () => {
  const { t } = useTranslation();
  const [sim, setSim] = React.useState<Simulation | undefined>(undefined);
  const modalProps = useDisclosure();
  const devicesDeleteModalProps = useDisclosure();
  const historyModalProps = useDisclosure();
  const onOpenEdit = (newSim: Simulation) => {
    setSim(newSim);
    modalProps.onOpen();
  };
  const onOpenHistory = (newSim: Simulation) => {
    setSim(newSim);
    historyModalProps.onOpen();
  };
  const onOpenDevicesDelete = (newSim: Simulation) => {
    setSim(newSim);
    devicesDeleteModalProps.onOpen();
  };
  const { query, columns, tableController } = useSimulationsTable({ onOpenEdit, onOpenHistory, onOpenDevicesDelete });

  return (
    <>
      <ResizableDataGrid<Simulation>
        controller={tableController}
        header={{
          title: `${query.data?.list.length ?? 0} ${t('simulation.other')}`,
          objectListed: t('simulation.other'),
          addButton: <CreateSimulationModal />,
        }}
        columns={columns}
        data={query.data?.list ?? []}
        isLoading={query.isFetching}
        options={{
          onRowClick: (simulation) => () => onOpenEdit(simulation),
          refetch: () => {
            query.refetch();
          },
          showAsCard: true,
        }}
      />
      {sim !== undefined && <UpdateSimulationModal modalProps={modalProps} simulation={sim} />}
      {sim !== undefined && <DeleteSimulationDevicesModal modalProps={devicesDeleteModalProps} simulation={sim} />}
      {sim !== undefined && <HistoryModal modalProps={historyModalProps} simulation={sim} />}
    </>
  );
};

export default SimulationsTable;
