import * as React from 'react';
import { Alert, AlertIcon, Box, Button, Center, Heading, Spinner, Text, UseDisclosureReturn } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'components/Modals/Modal';
import { useDeleteDeviceBatch } from 'hooks/Network/Devices';
import { Simulation } from 'hooks/Network/Simulations';

type Props = {
  simulation: Simulation;
  modalProps: UseDisclosureReturn;
};
const DeleteSimulationDevicesModal = ({ modalProps, simulation }: Props) => {
  const { t } = useTranslation();
  const deleteSimulationDevices = useDeleteDeviceBatch();

  const handleDelete = React.useCallback(() => {
    if (!simulation.macPrefix || simulation.macPrefix.length < 6) return;

    deleteSimulationDevices.mutate(`${simulation.macPrefix}*`);
  }, [simulation.macPrefix]);

  React.useEffect(() => {
    deleteSimulationDevices.reset();
  }, [modalProps.isOpen]);

  return (
    <Modal {...modalProps} title={`${simulation.name} - ${t('simulation.delete_simulation_devices')}`}>
      <Box>
        <Box hidden={!deleteSimulationDevices.isIdle}>
          <Alert status="warning" mb={4}>
            <AlertIcon />
            {t('simulation.delete_devices_confirm')}
          </Alert>
          <Text>{t('simulation.delete_devices_loading')}</Text>
        </Box>
        <Center hidden={!deleteSimulationDevices.isLoading}>
          <Spinner size="xl" />
        </Center>
        {deleteSimulationDevices.status === 'success' && (
          <Center>
            <Heading size="md">
              All of this simulation&apos;s devices are now deleted from the gateway! You can now close this window
            </Heading>
          </Center>
        )}
        {deleteSimulationDevices.status === 'error' && (
          <pre>{JSON.stringify(deleteSimulationDevices.data, null, 2)}</pre>
        )}
        <Center my={4}>
          <Button colorScheme="gray" mr={3} onClick={modalProps.onClose} isDisabled={deleteSimulationDevices.isLoading}>
            {deleteSimulationDevices.status === 'success' ? t('common.close') : t('common.cancel')}
          </Button>
          <Button
            hidden={deleteSimulationDevices.status === 'success'}
            colorScheme="red"
            onClick={handleDelete}
            isLoading={deleteSimulationDevices.isLoading}
          >
            {t('crud.delete')}
          </Button>
        </Center>
      </Box>
    </Modal>
  );
};

export default DeleteSimulationDevicesModal;
