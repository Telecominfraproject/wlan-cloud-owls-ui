import * as React from 'react';
import { Box, Button, Center, Flex, Heading, SimpleGrid, Spacer, Spinner, Text, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import MessagesChart from './DevicesChart';
import TxRxChart from './TxRxChart';
import FormattedDate from 'components/InformationDisplays/FormattedDate';
import { useSimulatorStore } from 'contexts/SimulatorSocketProvider/useStore';
import { bytesString } from 'helpers/stringHelper';
import { Simulation, SimulationStatus } from 'hooks/Network/Simulations';

type Props = {
  status: SimulationStatus;
  simulation?: Simulation;
  onStop: (id: string, simulationId: string) => void;
  isStopLoading: boolean;
  onCancel: (id: string, simulationId: string) => void;
  isCancelLoading: boolean;
};

const SingleSimulationCurrentlyRunning = ({
  status,
  simulation,
  onStop,
  isStopLoading,
  onCancel,
  isCancelLoading,
}: Props) => {
  const { t } = useTranslation();
  const currentStatus = useSimulatorStore(
    React.useCallback((state) => state.currentSimulationsData[status.id] ?? [], [status.id]),
  );
  const latestStatus = currentStatus?.[currentStatus.length - 1]?.rawData ?? status;

  const handleStopClick = () => onStop(status.id, status.simulationId);
  const handleCancelClick = () => onCancel(status.id, status.simulationId);

  return (
    <Box>
      {status ? (
        <>
          <Flex>
            <Spacer />
            <Button onClick={handleStopClick} isLoading={isStopLoading} colorScheme="yellow" size="sm">
              {t('simulation.stop')}
            </Button>
            <Tooltip label={t('simulation.cancel_explanation')}>
              <Button onClick={handleCancelClick} isLoading={isCancelLoading} colorScheme="red" size="sm" ml={2}>
                {t('simulation.cancel')}
              </Button>
            </Tooltip>
          </Flex>
          <SimpleGrid minChildWidth="200px">
            <Box>
              <Heading size="sm" my="auto">
                {t('common.started')}
              </Heading>
              <FormattedDate key={JSON.stringify(status)} date={latestStatus.startTime} />
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.owner')}
              </Heading>
              <Text>{status.owner}</Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                Time to Completion
              </Heading>
              <Text>
                {latestStatus.timeToFullDevices} {t('common.seconds')}
              </Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                Current Devices
              </Heading>
              <Text>
                {latestStatus.liveDevices} (
                {simulation ? Math.round((latestStatus.liveDevices / simulation.devices) * 100) : '-'}%)
              </Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.error_devices')}
              </Heading>
              <Text>{latestStatus.errorDevices}</Text>
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
              <Text>{latestStatus.msgsTx.toLocaleString()}</Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.tx')}
              </Heading>
              <Text>{bytesString(latestStatus.tx)}</Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.rx_messages')}
              </Heading>
              <Text>{latestStatus.msgsRx.toLocaleString()}</Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.rx')}
              </Heading>
              <Text>{bytesString(latestStatus.rx)}</Text>
            </Box>
            <Box />
          </SimpleGrid>
          <Heading mt={4} mb={0} size="sm" textDecor="underline">
            {t('simulation.realtime_data')}
          </Heading>
          <Box h="calc(20vh)" w="100%">
            <TxRxChart statusId={status.id} />
          </Box>
          <Heading mt={4} mb={0} size="sm" textDecor="underline">
            Current Devices
          </Heading>
          <Box h="calc(20vh)" w="100%">
            <MessagesChart statusId={status.id} />
          </Box>
        </>
      ) : (
        <Center my="50px">
          <Spinner size="xl" />
        </Center>
      )}
    </Box>
  );
};

export default SingleSimulationCurrentlyRunning;
