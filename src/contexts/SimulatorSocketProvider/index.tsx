import React, { useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSimulatorStore } from './useStore';
import { SimulationWebSocketRawMessage, WebSocketNotification } from './utils';
import { axiosOwls, axiosSec } from 'constants/axiosInstances';
import { useAuth } from 'contexts/AuthProvider';
import { SimulationStatus } from 'hooks/Network/Simulations';

const extractWebSocketNotification = (message?: SimulationWebSocketRawMessage): WebSocketNotification | undefined => {
  if (message && message.notification) {
    if (message.notification.type_id === 1000) {
      return {
        type: 'SIMULATION_STATUS',
        content: message.notification.content as SimulationStatus,
      };
    }
  }
  if (message?.notificationTypes) {
    return {
      type: 'INITIAL_MESSAGE',
      message,
    };
  }
  return undefined;
};

export type SimulatorSocketContextReturn = Record<string, unknown>;

const SimulatorSocketContext = React.createContext<SimulatorSocketContextReturn>({
  webSocket: undefined,
  isOpen: false,
});

export const SimulatorSocketProvider = ({ children }: { children: React.ReactElement }) => {
  const { token, isUserLoaded } = useAuth();
  const { addMessage, isOpen, setIsOpen, webSocket, onStartWebSocket } = useSimulatorStore((state) => ({
    addMessage: state.addMessage,
    setIsOpen: state.setWebSocketOpen,
    isOpen: state.isWebSocketOpen,
    webSocket: state.webSocket,
    onStartWebSocket: state.startWebSocket,
  }));

  const queryClient = useQueryClient();

  const onMessage = useCallback((message: MessageEvent<string>) => {
    try {
      const data = JSON.parse(message.data) as SimulationWebSocketRawMessage | undefined;
      const extracted = extractWebSocketNotification(data);
      if (extracted) {
        addMessage(extracted);
        if (extracted.type === 'SIMULATION_STATUS') {
          queryClient.setQueryData(['simulationStatus'], extracted.content);
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  }, []);

  // useEffect for created the WebSocket and 'storing' it in useRef
  useEffect(() => {
    if (isUserLoaded && axiosOwls?.defaults?.baseURL !== axiosSec?.defaults?.baseURL) {
      onStartWebSocket(token ?? '');
    }

    const wsCurrent = webSocket;
    return () => wsCurrent?.close();
  }, [isUserLoaded]);

  // useEffect for generating global notifications
  useEffect(() => {
    if (webSocket) {
      webSocket.addEventListener('message', onMessage);
    }

    return () => {
      if (webSocket) webSocket.removeEventListener('message', onMessage);
    };
  }, [webSocket]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      let timeoutId;

      if (webSocket) {
        if (document.visibilityState === 'hidden') {
          timeoutId = setTimeout(() => {
            if (webSocket) webSocket.onclose = () => {};
            webSocket?.close();
            setIsOpen(false);
          }, 5000);
        } else {
          clearTimeout(timeoutId);

          if (!isOpen && isUserLoaded && axiosOwls?.defaults?.baseURL !== axiosSec?.defaults?.baseURL) {
            onStartWebSocket(token ?? '');
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [webSocket, isOpen]);

  const values: SimulatorSocketContextReturn = useMemo(() => ({}), []);

  return <SimulatorSocketContext.Provider value={values}>{children}</SimulatorSocketContext.Provider>;
};

export const useGlobalSimulatorSocket: () => SimulatorSocketContextReturn = () =>
  React.useContext(SimulatorSocketContext);
