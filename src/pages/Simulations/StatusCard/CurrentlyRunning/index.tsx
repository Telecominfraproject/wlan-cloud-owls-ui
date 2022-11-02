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
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import MessagesChart from './MessagesChart';
import TxRxChart from './TxRxChart';
import { Card } from 'components/Containers/Card';
import FormattedDate from 'components/InformationDisplays/FormattedDate';
import { bytesString } from 'helpers/stringHelper';
import {
  useCancelSimulation,
  useGetSimulations,
  useGetSimulationStatus,
  useStopSimulation,
} from 'hooks/Network/Simulations';

const CurrentlyRunningCard = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const getSims = useGetSimulations();
  const getStatus = useGetSimulationStatus();
  const cancelSim = useCancelSimulation();
  const stopSim = useStopSimulation();

  const currentSim = getSims.data?.list?.find((sim) => sim.id === getStatus.data?.simulationId);

  const handleStopClick = () =>
    stopSim.mutate(
      { id: getStatus.data?.id ?? '' },
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
  const handleCancelClick = () =>
    cancelSim.mutate(
      { id: getStatus.data?.id ?? '' },
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
                    <AlertTitle>{t('simulation.sim_currently_running', { sim: currentSim?.name })}</AlertTitle>
                    <Spacer />
                    <AccordionIcon />
                  </Alert>
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Box>
                  {getStatus.data ? (
                    <>
                      <Flex>
                        <Heading my="auto" size="sm" textDecor="underline">
                          {currentSim?.name}
                        </Heading>
                        <Spacer />
                        <Button onClick={handleStopClick} isLoading={stopSim.isLoading} colorScheme="yellow" size="sm">
                          {t('simulation.stop')}
                        </Button>
                        <Tooltip label={t('simulation.cancel_explanation')}>
                          <Button
                            onClick={handleCancelClick}
                            isLoading={cancelSim.isLoading}
                            colorScheme="red"
                            size="sm"
                            ml={2}
                          >
                            {t('simulation.cancel')}
                          </Button>
                        </Tooltip>
                      </Flex>
                      <SimpleGrid minChildWidth="200px">
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('common.started')}
                          </Heading>
                          <FormattedDate date={getStatus.data?.startTime} />
                        </Box>
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.owner')}
                          </Heading>
                          <Text>{getStatus.data?.owner}</Text>
                        </Box>
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.time_to_full')}
                          </Heading>
                          <Text>
                            {getStatus.data.timeToFullDevices} {t('common.seconds')}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.current_live_devices')}
                          </Heading>
                          <Text>{getStatus.data.liveDevices}</Text>
                        </Box>
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.error_devices')}
                          </Heading>
                          <Text>{getStatus.data.errorDevices}</Text>
                        </Box>
                      </SimpleGrid>
                      <Heading mt={4} mb={1} size="sm" textDecor="underline">
                        {t('analytics.total_data')}
                      </Heading>
                      <SimpleGrid minChildWidth="200px">
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.tx_messages')}
                          </Heading>
                          <Text>{getStatus.data.msgsTx.toLocaleString()}</Text>
                        </Box>
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.tx')}
                          </Heading>
                          <Text>{bytesString(getStatus.data.tx)}</Text>
                        </Box>
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.rx_messages')}
                          </Heading>
                          <Text>{getStatus.data.msgsRx.toLocaleString()}</Text>
                        </Box>
                        <Box>
                          <Heading size="sm" my="auto">
                            {t('simulation.rx')}
                          </Heading>
                          <Text>{bytesString(getStatus.data.rx)}</Text>
                        </Box>
                        <Box />
                      </SimpleGrid>
                      <Heading mt={4} mb={0} size="sm" textDecor="underline">
                        {t('simulation.realtime_data')}
                      </Heading>
                      <Box h="calc(20vh)" w="100%">
                        <TxRxChart />
                      </Box>
                      <Heading mt={4} mb={0} size="sm" textDecor="underline">
                        {t('simulation.realtime_messages')}
                      </Heading>
                      <Box h="calc(20vh)" w="100%">
                        <MessagesChart />
                      </Box>
                    </>
                  ) : (
                    <Center my="50px">
                      <Spinner size="xl" />
                    </Center>
                  )}
                </Box>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default CurrentlyRunningCard;
