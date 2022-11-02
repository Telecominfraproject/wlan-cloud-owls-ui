import React from 'react';
import { Icon } from '@chakra-ui/react';
import { Cloud, Info, UsersThree } from 'phosphor-react';
import { Route } from 'models/Routes';

const SimulationsPage = React.lazy(() => import('pages/Simulations'));
const ProfilePage = React.lazy(() => import('pages/Profile'));
const SystemPage = React.lazy(() => import('pages/SystemPage'));
const UsersPage = React.lazy(() => import('pages/UsersPage'));

const routes: Route[] = [
  {
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/',
    name: 'simulation.other',
    icon: (active: boolean) => (
      <Icon as={Cloud} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: SimulationsPage,
  },
  {
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/account',
    name: 'account.title',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: ProfilePage,
  },
  {
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/users',
    name: 'users.title',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: UsersPage,
  },
  {
    authorized: ['root', 'partner', 'admin'],
    path: '/system',
    name: 'system.title',
    icon: (active: boolean) => (
      <Icon as={Info} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: SystemPage,
  },
];

export default routes;
