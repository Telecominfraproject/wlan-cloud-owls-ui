import * as React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import SingleSimulationCurrentlyRunning from './SingleSimulationCurrentlyRunning';
import { Card } from 'components/Containers/Card';
import {
  SimulationStatus,
  useCancelSimulation,
  useGetSimulations,
  useGetSimulationsStatus,
  useStopSimulation,
} from 'hooks/Network/Simulations';

type Props = {
  currentlyRunningStatus: SimulationStatus[];
};

const CurrentlyRunningCard = ({ currentlyRunningStatus }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const getSims = useGetSimulations();
  const getStatus = useGetSimulationsStatus();
  const cancelSim = useCancelSimulation();
  const stopSim = useStopSimulation();

  const handleStopClick = (id: string, simulationId: string) =>
    stopSim.mutate(
      { runId: id, simulationId },
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
  const handleCancelClick = (id: string, simulationId: string) =>
    cancelSim.mutate(
      { runId: id, simulationId },
      {
        onSuccess: () => {
          toast({
            id: 'sim-cancel-success',
            title: t('common.success'),
            description: t('simulation.cancel_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            toast({
              id: 'sim-cancel-error',
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

  const getTabName = (status: SimulationStatus) =>
    getSims.data?.list.find((sim) => sim.id === status.simulationId)?.name ?? 'Unknown';

  return (
    <Card p={0}>
      <Accordion allowToggle>
        <AccordionItem borderRadius="15px">
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton p={0}>
                  <Alert
                    status="success"
                    borderBottomLeftRadius={isExpanded ? '0px' : undefined}
                    borderBottomRightRadius={isExpanded ? '0px' : undefined}
                  >
                    <AlertIcon />
                    <AlertTitle>
                      {t('simulation.currently_running', { count: currentlyRunningStatus.length })}
                    </AlertTitle>
                    <Spacer />
                    <AccordionIcon />
                  </Alert>
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Tabs key={getStatus.data?.length}>
                  <TabList>
                    {getStatus.data?.map((status) => (
                      <Tab key={status.id}>{getTabName(status)}</Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {getStatus.data?.map((status) => (
                      <TabPanel key={status.id}>
                        <SingleSimulationCurrentlyRunning
                          status={status}
                          simulation={getSims.data?.list.find((sim) => sim.id === status.simulationId)}
                          onStop={handleStopClick}
                          isStopLoading={stopSim.isLoading}
                          onCancel={handleCancelClick}
                          isCancelLoading={cancelSim.isLoading}
                        />
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default CurrentlyRunningCard;
