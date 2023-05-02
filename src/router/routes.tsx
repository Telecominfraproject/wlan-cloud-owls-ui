import React from 'react';
import { Cloud, Info, ListBullets, UsersThree } from '@phosphor-icons/react';
import { Route } from 'models/Routes';

const SimulatorLogs = React.lazy(() => import('pages/Notifications/GeneralLogs'));
const SimulationsLogs = React.lazy(() => import('pages/Notifications/Simulations'));
const SecLogsPage = React.lazy(() => import('pages/Notifications/SecLogs'));
const SimulationsPage = React.lazy(() => import('pages/Simulations'));
const ProfilePage = React.lazy(() => import('pages/Profile'));
const EndpointsPage = React.lazy(() => import('pages/EndpointsPage'));
const SystemConfigurationPage = React.lazy(() => import('pages/SystemConfigurationPage'));
const UsersPage = React.lazy(() => import('pages/UsersPage'));

const routes: Route[] = [
  {
    id: 'simulations-page',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/',
    name: 'simulation.other',
    icon: () => <Cloud size={28} weight="bold" />,
    component: SimulationsPage,
  },
  {
    id: 'profile-page',
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/account',
    name: 'account.title',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: ProfilePage,
  },
  {
    id: 'logs-group',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    name: 'controller.devices.logs',
    icon: () => <ListBullets size={28} weight="bold" />,
    children: [
      {
        id: 'logs-devices',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/logs/simulations',
        name: 'simulation.other',
        navName: (t) => `${t('simulation.other')} ${t('controller.devices.logs')}`,
        component: SimulationsLogs,
      },
      {
        id: 'logs-controller',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/logs/simulator',
        name: 'RAW:Simulator',
        navName: (t) => `Simulator ${t('controller.devices.logs')}`,
        component: SimulatorLogs,
      },
      {
        id: 'logs-security',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/logs/security',
        name: 'logs.security',
        navName: (t) => `${t('logs.security')} ${t('controller.devices.logs')}`,
        component: SecLogsPage,
      },
    ],
  },
  {
    id: 'users-page',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/users',
    name: 'users.title',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: UsersPage,
  },
  {
    id: 'system-group',
    authorized: ['root', 'partner', 'admin'],
    name: 'system.title',
    icon: () => <Info size={28} weight="bold" />,
    children: [
      {
        id: 'system-services',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/services',
        name: 'system.services',
        component: EndpointsPage,
      },
      {
        id: 'system-configuration',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/systemConfiguration',
        name: 'system.configuration',
        component: SystemConfigurationPage,
      },
    ],
  },
];

export default routes;
