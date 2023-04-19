import React from 'react';
import { VStack } from '@chakra-ui/react';
import StatusCard from './StatusCard';
import SimulationsTable from './Table';

const SimulationsPage = () => (
  <VStack spacing={4}>
    <>
      <StatusCard />
      <SimulationsTable />
    </>
  </VStack>
);

export default SimulationsPage;
