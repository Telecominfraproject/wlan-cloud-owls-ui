import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import routes from 'routes';
import { CSidebarNavItem } from '@coreui/react';
import { cilSettings, cilPeople, cilTask } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Header, Footer, PageContainer, Sidebar, ToastProvider, useAuth } from 'ucentral-libs';

const TheLayout = () => {
  const [showSidebar, setShowSidebar] = useState('responsive');
  const { endpoints, currentToken, user, avatar, logout } = useAuth();
  const { t, i18n } = useTranslation();

  return (
    <div className="c-app c-default-layout">
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        logo="assets/Small_Logo.png"
        options={
          <>
            <CSidebarNavItem
              className="font-weight-bold"
              name={t('simulation.title')}
              to="/simulations"
              icon={<CIcon content={cilTask} size="xl" className="mr-3" />}
            />
            <CSidebarNavItem
              className="font-weight-bold"
              name={t('user.users')}
              to="/users"
              icon={<CIcon content={cilPeople} size="xl" className="mr-3" />}
            />
            <CSidebarNavItem
              className="font-weight-bold"
              name={t('common.system')}
              to="/system"
              icon={<CIcon content={cilSettings} size="xl" className="mr-3" />}
            />
          </>
        }
        redirectTo="/devices"
        logoWidth="90px"
      />
      <div className="c-wrapper">
        <Header
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          routes={routes}
          t={t}
          i18n={i18n}
          logout={logout}
          logo="assets/Small_Logo.png"
          authToken={currentToken}
          endpoints={endpoints}
          user={user}
          avatar={avatar}
          hideBreadcrumb
        />
        <div className="c-body">
          <ToastProvider>
            <PageContainer t={t} routes={routes} redirectTo="/simulations" />
          </ToastProvider>
        </div>
        <Footer t={t} version={process.env.VERSION} />
      </div>
    </div>
  );
};

export default TheLayout;
