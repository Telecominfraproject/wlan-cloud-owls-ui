import { SimulationStatus } from 'hooks/Network/Simulations';

type SimulationUpdateMessage = {
  notification: {
    notificationId: number;
    type: 'owls_simulation_update';
    content: SimulationStatus;
  };
};

export type WebSocketInitialMessage = SimulationUpdateMessage;

export type WebSocketNotification = {
  type: 'SIMULATION_STATUS';
  content: SimulationStatus;
};

export type SocketEventCallback = {
  id: string;
  type: 'SIMULATION_STATUS';
  callback: () => void;
};
