import * as React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import FormattedDate from 'components/InformationDisplays/FormattedDate';
import { Modal } from 'components/Modals/Modal';
import { secondsDuration } from 'helpers/dateFormatting';
import { bytesString, uppercaseFirstLetter } from 'helpers/stringHelper';
import { Simulation, useDeleteSimulationResult, useGetSimulationHistory } from 'hooks/Network/Simulations';

type Props = {
  simulation?: Simulation;
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
};
const HistoryModal = ({ simulation, modalProps }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const getHistory = useGetSimulationHistory({ id: simulation?.id ?? '' });
  const deleteResult = useDeleteSimulationResult();

  const handleDeleteClick = (id: string) => () =>
    deleteResult.mutate(
      { id },
      {
        onSuccess: () => {
          toast({
            id: 'result-delete-success',
            title: t('common.success'),
            description: t('simulation.result_delete_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            toast({
              id: 'result-delete-error',
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
    <Modal
      title={t('simulation.sim_history', { sim: simulation?.name })}
      isOpen={modalProps.isOpen}
      onClose={modalProps.onClose}
    >
      <Box>
        {getHistory.isLoading && (
          <Center my="120px">
            <Spinner />
          </Center>
        )}
        {getHistory.error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>{getHistory.error?.data?.ErrorDescription}</AlertDescription>
          </Alert>
        ) : null}
        {getHistory.data && (
          <Accordion allowMultiple>
            {getHistory.data
              ?.filter((sim) => sim.simulationId === simulation?.id)
              .sort((a, b) => b.endTime - a.endTime)
              .map((sim) => (
                <AccordionItem key={uuid()}>
                  <AccordionButton
                    bg={
                      sim.state === 'completed' ? 'var(--chakra-colors-green-500)' : 'var(--chakra-colors-yellow-200)'
                    }
                    _hover={{
                      bg:
                        sim.state === 'completed'
                          ? 'var(--chakra-colors-green-700)'
                          : 'var(--chakra-colors-yellow-300)',
                    }}
                    textColor={sim.state === 'completed' ? undefined : 'black'}
                  >
                    <Flex w="100%">
                      <Text mr={1}>{uppercaseFirstLetter(sim.state)} </Text>
                      <FormattedDate date={sim.endTime} />
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Flex>
                      <Spacer />
                      <DeleteButton onClick={handleDeleteClick(sim.id)} isLoading={deleteResult.isLoading} />
                    </Flex>
                    <SimpleGrid minChildWidth="200px" spacing={4}>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('common.started')}
                        </Heading>
                        <FormattedDate date={sim.startTime} />
                      </Box>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.duration')}
                        </Heading>
                        {secondsDuration(sim.endTime - sim.startTime, t)}
                      </Box>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.owner')}
                        </Heading>
                        <Text>{sim.owner}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.time_to_full')}
                        </Heading>
                        <Text>
                          {sim.timeToFullDevices} {t('common.seconds')}
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('common.success')} {t('devices.title')}
                        </Heading>
                        <Text>{sim.liveDevices}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.error_devices')}
                        </Heading>
                        <Text>{sim.errorDevices}</Text>
                      </Box>
                    </SimpleGrid>
                    <Heading mt={6} mb={1} size="sm" textDecor="underline">
                      {t('analytics.total_data')}
                    </Heading>
                    <HStack spacing={4} mb={4}>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.tx_messages')}
                        </Heading>
                        <Text>{sim.msgsTx.toLocaleString()}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.tx')}
                        </Heading>
                        <Text>{bytesString(sim.tx)}</Text>
                      </Box>
                    </HStack>
                    <HStack spacing={4} mb={4}>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.rx_messages')}
                        </Heading>
                        <Text>{sim.msgsRx.toLocaleString()}</Text>
                      </Box>
                      <Box>
                        <Heading size="sm" my="auto">
                          {t('simulation.rx')}
                        </Heading>
                        <Text>{bytesString(sim.rx)}</Text>
                      </Box>
                    </HStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        )}
      </Box>
    </Modal>
  );
};

export default HistoryModal;
