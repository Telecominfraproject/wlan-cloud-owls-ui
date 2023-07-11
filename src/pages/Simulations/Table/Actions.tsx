import React from 'react';
import {
  IconButton,
  Tooltip,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Center,
  Box,
  Button,
  useDisclosure,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { Broom, ClockCounterClockwise, MagnifyingGlass, Play, Stop, Trash } from '@phosphor-icons/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Simulation,
  useDeleteSimulation,
  useGetSimulationsStatus,
  useStartSimulation,
  useStopSimulation,
} from 'hooks/Network/Simulations';

interface Props {
  simulation: Simulation;
  openEdit: (sim: Simulation) => void;
  onOpenHistory: (sim: Simulation) => void;
  onOpenDevicesDelete: (sim: Simulation) => void;
}

const Actions = ({ simulation, openEdit, onOpenHistory, onOpenDevicesDelete }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getStatus = useGetSimulationsStatus();
  const startSim = useStartSimulation();
  const stopSim = useStopSimulation();
  const deleteSim = useDeleteSimulation();

  const currentSimulationStatus = getStatus.data?.find(({ simulationId }) => simulationId === simulation.id);

  const handleEditClick = () => {
    openEdit(simulation);
  };
  const handleHistoryClick = () => {
    onOpenHistory(simulation);
  };
  const handleDeleteDevicesClick = () => {
    onOpenDevicesDelete(simulation);
  };

  const handleStartClick = () =>
    startSim.mutate(
      { id: simulation.id },
      {
        onSuccess: () => {
          toast({
            id: 'sim-start-success',
            title: t('common.success'),
            description: t('simulation.start_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            toast({
              id: 'sim-start-error',
              title: t('common.error'),
              description: e?.response?.data?.ErrorDescription,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        },
      },
    );
  const handleStopClick = () =>
    stopSim.mutate(
      { runId: currentSimulationStatus?.id ?? '', simulationId: simulation.id },
      {
        onSuccess: () => {
          toast({
            id: 'sim-stop-success',
            title: t('common.success'),
            description: t('simulation.stop_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            toast({
              id: 'sim-stop-error',
              title: t('common.error'),
              description: e?.response?.data?.ErrorDescription,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        },
      },
    );

  const handleDeleteClick = () =>
    deleteSim.mutateAsync(
      { id: simulation.id },
      {
        onSuccess: () => {
          toast({
            id: 'sim-delete-success',
            title: t('common.success'),
            description: t('simulation.delete_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            toast({
              id: 'sim-delete-error',
              title: t('common.error'),
              description: e?.response?.data?.ErrorDescription,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        },
      },
    );

  return (
    <HStack mx="auto">
      {currentSimulationStatus && currentSimulationStatus.state === 'running' ? (
        <Tooltip hasArrow label={t('simulation.stop')} placement="top">
          <IconButton
            aria-label={t('simulation.stop')}
            colorScheme="yellow"
            icon={<Stop size={20} />}
            size="sm"
            onClick={handleStopClick}
            isLoading={stopSim.isLoading}
          />
        </Tooltip>
      ) : (
        <Tooltip hasArrow label={t('simulation.start')} placement="top" isDisabled={!getStatus.data}>
          <IconButton
            aria-label={t('simulation.start')}
            colorScheme="green"
            icon={<Play size={20} />}
            size="sm"
            onClick={handleStartClick}
            isLoading={startSim.isLoading}
          />
        </Tooltip>
      )}
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton aria-label="delete-device" colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {simulation.name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('simulation.one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteSim.isLoading}>
                {t('common.yes')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label={t('simulation.delete_simulation_devices')} placement="top">
        <IconButton
          aria-label={t('simulation.delete_simulation_devices')}
          colorScheme="yellow"
          icon={<Broom size={20} />}
          size="sm"
          isDisabled={currentSimulationStatus?.state === 'running'}
          onClick={handleDeleteDevicesClick}
        />
      </Tooltip>
      <Tooltip hasArrow label={t('simulation.view_previous_runs')} placement="top">
        <IconButton
          aria-label="view-simulation-prev-runs"
          colorScheme="purple"
          icon={<ClockCounterClockwise size={20} />}
          size="sm"
          onClick={handleHistoryClick}
        />
      </Tooltip>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label="view-simulation-details"
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleEditClick}
        />
      </Tooltip>
    </HStack>
  );
};

export default Actions;
