import { SimulationStatus } from 'hooks/Network/Simulations';
import { InitialSocketMessage } from 'models/Socket';

export type LogLevel = 'information' | 'critical' | 'debug' | 'error' | 'fatal' | 'notice' | 'trace' | 'warning';

type SimulationUpdateMessage = {
  notification: {
    notification_id: number;
    type_id: 1000;
    content: SimulationStatus;
  };
  notificationTypes?: undefined;
};

type LogMessage = {
  notification: {
    notificationId: number;
    type_id: number;
    content: {
      level: LogLevel;
      msg: string;
      source: string;
      thread_id: number;
      thread_name: string;
      timestamp: number;
    };
  };
  notificationTypes?: undefined;
};

export type SimulationWebSocketRawMessage = Partial<SimulationUpdateMessage> | InitialSocketMessage | LogMessage;

export type WebSocketNotification =
  | {
      type: 'SIMULATION_STATUS';
      content: SimulationStatus;
    }
  | {
      type: 'LOG';
      serialNumber?: undefined;
      serialNumbers?: undefined;
      notificationTypes?: undefined;
      log: LogMessage['notification']['content'];
    }
  | {
      type: 'INITIAL_MESSAGE';
      message: InitialSocketMessage;
    };

export type SocketEventCallback = {
  id: string;
  type: 'SIMULATION_STATUS';
  callback: () => void;
};
