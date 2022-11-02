import * as React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Center, Spinner } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CurrentlyRunningCard from './CurrentlyRunning';
import { Card } from 'components/Containers/Card';
import { useGetSimulationStatus } from 'hooks/Network/Simulations';

const StatusCard = () => {
  const { t } = useTranslation();
  const getStatus = useGetSimulationStatus();

  if (getStatus.isLoading) {
    return (
      <Card p={0} h="48px">
        <Center my="auto">
          <Spinner size="lg" />
        </Center>
      </Card>
    );
  }

  if (getStatus.data?.state === 'running') {
    return <CurrentlyRunningCard />;
  }

  return (
    <Card p={0}>
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>{t('common.status')}</AlertTitle>
        <AlertDescription>{t('simulation.no_sim_running')}</AlertDescription>
      </Alert>
    </Card>
  );
};

export default StatusCard;
