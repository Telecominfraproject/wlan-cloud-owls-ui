import React from 'react';

const ProfilePage = React.lazy(() => import('pages/ProfilePage'));
const SimulationPage = React.lazy(() => import('pages/SimulationPage'));
const SystemPage = React.lazy(() => import('pages/SystemPage'));
const UserListPage = React.lazy(() => import('pages/UserListPage'));

export default [
  { path: '/simulations', exact: true, name: 'simulation.title', component: SimulationPage },
  { path: '/myprofile', exact: true, name: 'user.my_profile', component: ProfilePage },
  { path: '/users', exact: true, name: 'user.users', component: UserListPage },
  { path: '/system', exact: true, name: 'common.system', component: SystemPage },
];
