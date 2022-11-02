import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosOwls } from 'constants/axiosInstances';
import { AtLeast } from 'models/General';

export type Simulation = {
  clientInterval: number;
  concurrentDeviceS: number;
  deviceType: string;
  devices: number;
  gateway: string;
  healthCheckInterval: number;
  id: string;
  keepAlive: number;
  key: string;
  macPrefix: number;
  minAssociations: number;
  maxAssociations: number;
  minClients: number;
  maxClients: number;
  name: string;
  reconnectionInterval: number;
  simulationLength: number;
  stateInterval: number;
  threads: number;
};

const getSimulations = () => async () =>
  axiosOwls.get(`simulation`).then((response) => response.data as { list: Simulation[] });

export const useGetSimulations = () =>
  useQuery(['simulations', 'all'], getSimulations(), {
    keepPreviousData: true,
    staleTime: 30000,
  });

const getSimulation = (id?: string) => async () =>
  axiosOwls.get(`simulation?id=${id}`).then((response) => response.data as { list: Simulation[] });
export const useGetSimulation = ({ id }: { id?: string }) =>
  useQuery(['simulation', id], getSimulation(id), {
    keepPreviousData: true,
    enabled: id !== undefined,
    staleTime: 30000,
  });

const createSimulation = async (newSimulation: Partial<Simulation>) => axiosOwls.post(`simulation`, newSimulation);
export const useCreateSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation(createSimulation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['simulations']);
    },
  });
};

const updateSimulation = async (newSimulation: AtLeast<Simulation, 'id'>) =>
  axiosOwls.put(`simulation?id=${newSimulation.id}`, newSimulation);
export const useUpdateSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateSimulation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['simulation']);
      queryClient.invalidateQueries(['simulations']);
    },
  });
};

const deleteSimulation = async ({ id }: { id: string }) => axiosOwls.delete(`simulation?id=${id}`);
export const useDeleteSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteSimulation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['simulations']);
    },
  });
};

const startSimulation = async ({ id }: { id: string }) =>
  axiosOwls.post(`operation?simulationId=${id}&operation=start`);
export const useStartSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation(startSimulation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['simulationStatus']);
    },
  });
};
const stopSimulation = async ({ id }: { id: string }) => axiosOwls.post(`operation?id=${id}&operation=stop`);
export const useStopSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation(stopSimulation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['simulationStatus']);
    },
  });
};
const cancelSimulation = async ({ id }: { id: string }) => axiosOwls.post(`operation?id=${id}&operation=cancel`);
export const useCancelSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation(cancelSimulation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['simulationStatus']);
    },
  });
};

export type SimulationStatus = {
  endTime: number;
  errorDevices: number;
  id: string;
  liveDevices: number;
  msgsRx: number;
  msgsTx: number;
  owner: string;
  rx: number;
  simulationId: string;
  startTime: number;
  state: 'running' | 'completed' | 'cancelled' | 'none';
  timeToFullDevices: number;
  tx: number;
};
const getSimulationStatus = async () => axiosOwls.get(`status`).then((response) => response.data as SimulationStatus);
export const useGetSimulationStatus = () =>
  useQuery(['simulationStatus'], getSimulationStatus, {
    keepPreviousData: true,
    staleTime: Infinity,
  });

const getSimulationHistory = async () =>
  axiosOwls.get(`results`).then((response) => response.data.list as SimulationStatus[]);
export const useGetSimulationHistory = () =>
  useQuery(['simulationStatus', 'all'], getSimulationHistory, {
    keepPreviousData: true,
    staleTime: 30000,
  });

const deleteSimulationResult = async ({ id }: { id: string }) => axiosOwls.delete(`results?id=${id}`);
export const useDeleteSimulationResult = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteSimulationResult, {
    onSuccess: () => {
      queryClient.invalidateQueries(['simulationStatus']);
    },
  });
};
