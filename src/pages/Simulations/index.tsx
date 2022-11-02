import React from 'react';
import { Flex, VStack } from '@chakra-ui/react';
import StatusCard from './StatusCard';
import SimulationsTable from './Table';
import { useAuth } from 'contexts/AuthProvider';

const SimulationsPage = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      <VStack spacing={4}>
        {isUserLoaded && (
          <>
            <StatusCard />
            <SimulationsTable />
          </>
        )}
      </VStack>
    </Flex>
  );
};

export default SimulationsPage;
