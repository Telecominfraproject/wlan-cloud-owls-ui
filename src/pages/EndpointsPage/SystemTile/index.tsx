import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spacer,
  Tag,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ArrowsClockwise, ArrowSquareOut } from '@phosphor-icons/react';
import { MultiValue, Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import { RefreshButton } from '../../../components/Buttons/RefreshButton';
import FormattedDate from '../../../components/InformationDisplays/FormattedDate';
import SystemLoggingButton from './LoggingButton';
import SystemCertificatesTable from './SystemCertificatesTable';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { Modal } from 'components/Modals/Modal';
import { useGetOwlStatus } from 'contexts/AuthProvider/utils';
import { compactSecondsToDetailed } from 'helpers/dateFormatting';
import { EndpointApiResponse } from 'hooks/Network/Endpoints';
import { useGetSubsystems, useGetSystemInfo, useReloadSubsystems } from 'hooks/Network/System';

interface Props {
  endpoint: EndpointApiResponse;
  token: string;
}

const SystemTile = ({ endpoint, token }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subs, setSubs] = useState<{ value: string; label: string }[]>([]);
  const {
    data: system,
    refetch: refreshSystem,
    isFetching: isFetchingSystem,
  } = useGetSystemInfo({ endpoint: endpoint.uri, name: endpoint.type, token });
  const {
    data: subsystems,
    refetch: refreshSubsystems,
    isFetching: isFetchingSubsystems,
  } = useGetSubsystems({ enabled: true, endpoint: endpoint.uri, name: endpoint.type, token });
  const resetSubs = () => setSubs([]);
  const { mutateAsync: reloadSubsystems, isLoading: isReloading } = useReloadSubsystems({
    endpoint: endpoint.uri,
    resetSubs,
    token,
  });
  const getStatus = useGetOwlStatus({ endpoint, token: `Bearer ${token}`, enabled: endpoint.type === 'owls' });
  let url = system?.UI;

  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }

  const openUI = () => window.open(url, '_blank');

  const handleReloadClick = () => {
    reloadSubsystems(subs.map((sub) => sub.value));
  };

  const refresh = () => {
    refreshSystem();
    refreshSubsystems();
  };

  return (
    <>
      <Card>
        {
          // @ts-ignore
          <CardHeader alignItems="center">
            <Heading>{endpoint.type}</Heading>
            {getStatus.data ? (
              <Tag colorScheme={getStatus.data.master ? 'purple' : 'teal'} size="lg" ml={2} mt={1}>
                {getStatus.data.master ? 'Primary' : 'Secondary'}
              </Tag>
            ) : null}
            <Spacer />
            <HStack>
              <Tooltip label="Go to UI">
                <IconButton
                  aria-label="Go to UI"
                  onClick={openUI}
                  icon={<ArrowSquareOut size={20} />}
                  colorScheme="blue"
                  hidden={url === undefined}
                />
              </Tooltip>
              <SystemLoggingButton endpoint={endpoint} token={token} />
              <RefreshButton onClick={refresh} isFetching={isFetchingSystem || isFetchingSubsystems} />
            </HStack>
          </CardHeader>
        }
        <CardBody>
          <VStack w="100%">
            <SimpleGrid minChildWidth="500px" w="100%">
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.endpoint')}:
                </Heading>
                {endpoint.uri}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.hostname')}:
                </Heading>
                {system?.hostname}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.os')}:
                </Heading>
                {system?.os}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.processors')}:
                </Heading>
                {system?.processors}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.start')}:
                </Heading>
                {system?.start ? <FormattedDate date={system?.start} /> : '-'}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.uptime')}:
                </Heading>
                {system?.uptime ? compactSecondsToDetailed(system.uptime, t) : '-'}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('system.version')}:
                </Heading>
                {system?.version}
              </Flex>
              <Flex>
                <Heading size="sm" w="150px" my="auto">
                  {t('certificates.title')}:
                </Heading>
                {system?.certificates && system.certificates?.length > 0 ? (
                  <Button variant="link" onClick={onOpen} p={0} m={0} maxH={7}>
                    {t('common.details')} {system.certificates.length}
                  </Button>
                ) : (
                  t('common.unknown')
                )}
              </Flex>
            </SimpleGrid>
            <Flex w="100%">
              <Heading size="sm" w="150px" my="auto">
                {t('system.subsystems')}:
              </Heading>
              <Box w="400px">
                <Select
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: '15px',
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      backgroundColor: 'unset',
                      border: 'unset',
                    }),
                  }}
                  isMulti
                  closeMenuOnSelect={false}
                  options={
                    subsystems && subsystems?.length > 0 ? subsystems.map((sys) => ({ value: sys, label: sys })) : []
                  }
                  onChange={
                    setSubs as (
                      newValue: MultiValue<{
                        value: string;
                        label: string;
                      }>,
                    ) => void
                  }
                  value={subs}
                  placeholder={t('system.systems_to_reload')}
                />
              </Box>
              <Tooltip hasArrow label={t('system.reload_chosen_subsystems')}>
                <IconButton
                  aria-label="Reload subsystems"
                  ml={2}
                  onClick={handleReloadClick}
                  icon={<ArrowsClockwise size={20} />}
                  colorScheme="blue"
                  isLoading={isReloading}
                  isDisabled={subs.length === 0}
                />
              </Tooltip>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('certificates.title')}
        options={{
          modalSize: 'sm',
        }}
      >
        <SystemCertificatesTable certificates={system?.certificates} />
      </Modal>
    </>
  );
};

export default SystemTile;
