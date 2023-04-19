import * as React from 'react';
import { Box, Button, Center, Flex, Heading, SimpleGrid, Spacer, Spinner, Text, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import MessagesChart from './MessagesChart';
import TxRxChart from './TxRxChart';
import FormattedDate from 'components/InformationDisplays/FormattedDate';
import { useSimulatorStore } from 'contexts/SimulatorSocketProvider/useStore';
import { bytesString } from 'helpers/stringHelper';
import { SimulationStatus } from 'hooks/Network/Simulations';

type Props = {
  status: SimulationStatus;
  onStop: (id: string, simulationId: string) => void;
  isStopLoading: boolean;
  onCancel: (id: string, simulationId: string) => void;
  isCancelLoading: boolean;
};

const SingleSimulationCurrentlyRunning = ({ status, onStop, isStopLoading, onCancel, isCancelLoading }: Props) => {
  const { t } = useTranslation();
  const currentStatus = useSimulatorStore(
    React.useCallback((state) => state.currentSimulationsData[status.id] ?? [], [status.id]),
    (oldState, newState) => oldState?.length === newState?.length,
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
              <FormattedDate key={currentStatus.length} date={latestStatus.startTime} />
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.owner')}
              </Heading>
              <Text>{status.owner}</Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.time_to_full')}
              </Heading>
              <Text>
                {latestStatus.timeToFullDevices} {t('common.seconds')}
              </Text>
            </Box>
            <Box>
              <Heading size="sm" my="auto">
                {t('simulation.current_live_devices')}
              </Heading>
              <Text>{latestStatus.liveDevices}</Text>
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
            {t('simulation.realtime_messages')}
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
