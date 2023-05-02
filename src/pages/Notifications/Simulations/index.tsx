import * as React from 'react';
import { Box, Flex, HStack, IconButton, Spacer, Table, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { Download } from '@phosphor-icons/react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import ReactVirtualizedAutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { v4 as uuid } from 'uuid';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { useSimulatorStore } from 'contexts/SimulatorSocketProvider/useStore';
import { dateForFilename } from 'helpers/dateFormatting';
import { useGetSimulations } from 'hooks/Network/Simulations';

const SimulationsLogCard = () => {
  const { t } = useTranslation();
  const { logs } = useSimulatorStore((state) => ({
    logs: state.allMessages,
  }));
  const getSimulations = useGetSimulations();

  const data = React.useMemo(() => {
    const arr = logs.filter((d) => d.type === 'NOTIFICATION' && d.data.type === 'SIMULATION_STATUS');
    return arr.reverse();
  }, [logs.length]);

  const getSimulationName = (id?: string) =>
    getSimulations.data?.list.find(({ id: simId }) => simId === id)?.name ?? id;

  type RowProps = { index: number; style: React.CSSProperties };
  const Row = React.useCallback(
    ({ index, style }: RowProps) => {
      const msg = data[index];
      if (msg?.type === 'NOTIFICATION' && msg?.data.type === 'SIMULATION_STATUS') {
        return (
          <Box style={style}>
            <Flex w="100%">
              <Box flex="0 1 110px">
                <Text>{msg.timestamp.toLocaleTimeString()}</Text>
              </Box>
              <Box flex="0 1 120px" textAlign="left">
                <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                  {getSimulationName(msg.data.content.simulationId) ?? '-'}
                </Text>
              </Box>
              <Box textAlign="left" w="calc(100% - 80px - 120px - 30px)">
                <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                  {JSON.stringify(msg.data.content)}
                </Text>
              </Box>
            </Flex>
          </Box>
        );
      }
      return null;
    },
    [t, data, getSimulations],
  );

  const downloadableLogs = React.useMemo(
    () =>
      data.map((msg) =>
        msg.type === 'NOTIFICATION' && msg.data.type === 'SIMULATION_STATUS'
          ? {
              timestamp: msg.timestamp.toLocaleString(),
              message: JSON.stringify(msg.data.content),
            }
          : {},
      ),
    [data],
  );

  return (
    <Card>
      <CardHeader>
        <Spacer />
        <HStack spacing={2}>
          <CSVLink
            filename={`logs_${dateForFilename(new Date().getTime() / 1000)}.csv`}
            data={downloadableLogs as object[]}
          >
            <Tooltip label={t('logs.export')} hasArrow>
              <IconButton aria-label={t('logs.export')} icon={<Download />} colorScheme="blue" />
            </Tooltip>
          </CSVLink>
        </HStack>
      </CardHeader>
      <CardBody>
        <Box overflowX="auto" w="100%">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th w="110px">{t('common.time')}</Th>
                <Th w="120px">{t('simulation.one')}</Th>
                <Th>{t('analytics.raw_data')}</Th>
              </Tr>
            </Thead>
          </Table>
          <Box ml={4} h="calc(70vh)">
            <ReactVirtualizedAutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  width={width}
                  itemCount={data.length}
                  itemSize={35}
                  itemKey={(index) => data[index]?.id ?? uuid()}
                >
                  {Row}
                </List>
              )}
            </ReactVirtualizedAutoSizer>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default SimulationsLogCard;
