import ReconnectingWebSocket from 'reconnecting-websocket';
import create from 'zustand';
import { SocketEventCallback, WebSocketNotification } from './utils';
import { axiosOwls } from 'constants/axiosInstances';
import { SimulationStatus } from 'hooks/Network/Simulations';
import { NotificationType } from 'models/Socket';

export type WebSocketMessage =
  | {
      type: 'NOTIFICATION';
      data: WebSocketNotification;
      timestamp: Date;
    }
  | { type: 'UNKNOWN'; data: Record<string, unknown>; timestamp: Date };

export type SimulationOperationStatus = {
  rx: number;
  tx: number;
  msgsRx: number;
  msgsTx: number;
  timestamp: Date;
  operationId: string;
  simulationId: string;
  rawData: SimulationStatus;
};

export type SimulatorStoreState = {
  availableLogTypes: NotificationType[];
  hiddenLogIds: number[];
  setHiddenLogIds: (logsToHide: number[]) => void;
  lastMessage?: WebSocketMessage;
  allMessages: WebSocketMessage[];
  addMessage: (message: WebSocketNotification) => void;
  eventListeners: SocketEventCallback[];
  addEventListeners: (callback: SocketEventCallback[]) => void;
  webSocket?: ReconnectingWebSocket;
  send: (str: string) => void;
  startWebSocket: (token: string, tries?: number) => void;
  currentSimulationsData: Record<string, SimulationOperationStatus[]>;
};

export const useSimulatorStore = create<SimulatorStoreState>((set, get) => ({
  availableLogTypes: [],
  hiddenLogIds: [],
  setHiddenLogIds: (logsToHide: number[]) => {
    get().send(JSON.stringify({ 'drop-notifications': logsToHide }));
    set(() => ({
      hiddenLogIds: logsToHide,
    }));
  },
  allMessages: [] as WebSocketMessage[],
  addMessage: (msg: WebSocketNotification) => {
    const obj: WebSocketMessage = {
      type: 'NOTIFICATION',
      data: msg,
      timestamp: new Date(),
    };

    if (msg.type === 'SIMULATION_STATUS') {
      const allStoredStatus = get().currentSimulationsData;
      const newSimStatusMsg: SimulationOperationStatus = {
        rx: 0,
        tx: 0,
        msgsRx: 0,
        msgsTx: 0,
        timestamp: obj.timestamp,
        operationId: msg.content.id,
        simulationId: msg.content.simulationId,
        rawData: msg.content,
      };

      const key = newSimStatusMsg.operationId;
      if (!allStoredStatus[key]) allStoredStatus[key] = [];

      const prevContent = allStoredStatus[key] as SimulationOperationStatus[];
      const prevEntry = prevContent[Math.max(0, prevContent.length - 1)];
      if (prevEntry?.operationId === newSimStatusMsg.operationId) {
        newSimStatusMsg.rx = Math.max(0, newSimStatusMsg.rawData.rx - prevEntry.rawData.rx);
        newSimStatusMsg.tx = Math.max(0, newSimStatusMsg.rawData.tx - prevEntry.rawData.tx);
        newSimStatusMsg.msgsRx = Math.max(0, newSimStatusMsg.rawData.msgsRx - prevEntry.rawData.msgsRx);
        newSimStatusMsg.msgsTx = Math.max(0, newSimStatusMsg.rawData.msgsTx - prevEntry.rawData.msgsTx);
      }
      const newCurrSimStatus =
        prevEntry?.operationId === newSimStatusMsg.operationId ? [...prevContent, newSimStatusMsg] : [newSimStatusMsg];
      const newCurrentSimulationData = allStoredStatus;
      newCurrentSimulationData[key] = newCurrSimStatus.length <= 60 * 10 ? newCurrSimStatus : newCurrSimStatus.slice(1);

      const eventsToFire = get().eventListeners.filter(({ type }) => type === msg.type);

      if (eventsToFire.length > 0) {
        for (const event of eventsToFire) {
          event.callback();
        }

        return set((state) => ({
          allMessages:
            state.allMessages.length <= 1000 ? [...state.allMessages, obj] : [...state.allMessages.slice(1), obj],
          lastMessage: obj,
          eventListeners: get().eventListeners.filter(
            ({ id }) => !eventsToFire.find(({ id: findId }) => findId === id),
          ),
          currentSimulationsData: newCurrentSimulationData,
        }));
      }

      return set((state) => ({
        allMessages:
          state.allMessages.length <= 1000 ? [...state.allMessages, obj] : [...state.allMessages.slice(1), obj],
        lastMessage: obj,
        currentSimulationsData: newCurrentSimulationData,
      }));
    }

    if (msg.type === 'INITIAL_MESSAGE') {
      if (msg.message.notificationTypes) {
        set({ availableLogTypes: msg.message.notificationTypes });
      }
    }

    return set((state) => ({
      allMessages:
        state.allMessages.length <= 1000 ? [...state.allMessages, obj] : [...state.allMessages.slice(1), obj],
      lastMessage: obj,
    }));
  },
  eventListeners: [] as SocketEventCallback[],
  addEventListeners: (events: SocketEventCallback[]) =>
    set((state) => ({ eventListeners: [...state.eventListeners, ...events] })),
  send: (str: string) => {
    const ws = get().webSocket;
    if (ws) ws.send(str);
  },
  startWebSocket: (token: string) => {
    const ws = get().webSocket;

    if (ws) {
      // Close the previous websocket connection and remove it
      ws.close();
      set({ webSocket: undefined });
    }

    const newWs = new ReconnectingWebSocket(
      `${
        axiosOwls?.defaults?.baseURL ? axiosOwls.defaults.baseURL.replace('https', 'wss').replace('http', 'ws') : ''
      }/ws`,
      undefined,
      {
        startClosed: true,
      },
    );
    newWs.removeEventListener('open', (e) => {
      e.target?.send(`token:${token}`);
    });
    newWs.addEventListener('open', (e) => {
      e.target?.send(`token:${token}`);
    });
    newWs.reconnect();

    set({
      webSocket: newWs,
    });

    // Add global event listener, on window focus, call startWebSocket
    window.removeEventListener('focus', () => {
      get().startWebSocket(token);
    });
    window.addEventListener('focus', () => {
      get().startWebSocket(token);
    });
  },
  currentSimulationsData: {},
}));
