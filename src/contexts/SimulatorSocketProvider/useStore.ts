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
  webSocket?: WebSocket;
  websocketTimer: NodeJS.Timeout | null;
  send: (str: string) => void;
  startWebSocket: (token: string, tries?: number) => void;
  isWebSocketOpen: boolean;
  setWebSocketOpen: (isOpen: boolean) => void;
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
  isWebSocketOpen: false,
  setWebSocketOpen: (isOpen: boolean) => set({ isWebSocketOpen: isOpen }),
  send: (str: string) => {
    const ws = get().webSocket;
    if (ws) ws.send(str);
  },
  websocketTimer: null,
  startWebSocket: (token: string) => {
    set({
      webSocket: new WebSocket(
        `${
          axiosOwls?.defaults?.baseURL ? axiosOwls.defaults.baseURL.replace('https', 'wss').replace('http', 'ws') : ''
        }/ws`,
      ),
    });
    const ws = get().webSocket;
    if (ws) {
      ws.onopen = () => {
        const timer = get().websocketTimer;
        if (timer) clearTimeout(timer);
        set({ isWebSocketOpen: true, websocketTimer: null });
        ws.send(`token:${token}`);
      };
      ws.onclose = () => {
        const timer = get().websocketTimer;
        if (timer) clearTimeout(timer);
        set({
          isWebSocketOpen: false,
          websocketTimer: setInterval(() => get().startWebSocket(token), 60 * 1000),
        });
      };
    }
  },
  currentSimulationsData: {},
}));
