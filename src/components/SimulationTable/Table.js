import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import {
  CCardBody,
  CDataTable,
  CButton,
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CPopover,
  CSelect,
  CButtonToolbar,
  CButtonClose,
} from '@coreui/react';
import { cilTrash, cilSearch, cilMediaPlay } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactTooltip from 'react-tooltip';
import { v4 as createUuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

const SimulationTable = ({
  currentPage,
  simulations,
  simulationsPerPage,
  loading,
  updateSimulationsPerPage,
  pageCount,
  updatePage,
  deleteSimulation,
  toggleEdit,
  startSim,
}) => {
  const { t } = useTranslation();
  const columns = [
    { key: 'name', label: t('user.name'), filter: false, sorter: false, _style: { width: '10%' } },
    {
      key: 'gateway',
      label: t('simulation.gateway'),
      filter: false,
      sorter: false,
      _style: { width: '10%' },
    },
    { key: 'deviceType', label: t('firmware.device_type'), filter: false, sorter: false },
    { key: 'devices', label: t('common.devices'), filter: false, sorter: false },
    { key: 'macPrefix', label: t('simulation.mac_prefix'), filter: false, sorter: false },
    { key: 'stateInterval', label: t('simulation.state_interval'), filter: false, sorter: false },
    {
      key: 'minAssociations',
      label: t('simulation.min_associations'),
      filter: false,
      sorter: false,
    },
    {
      key: 'maxAssociations',
      label: t('simulation.max_associations'),
      filter: false,
      sorter: false,
    },
    { key: 'minClients', label: t('simulation.min_clients'), filter: false, sorter: false },
    { key: 'maxClients', label: t('simulation.max_clients'), filter: false, sorter: false },
    { key: 'simulationLength', label: t('simulation.length'), filter: false, sorter: false },
    { key: 'actions', label: '', filter: false, sorter: false, _style: { width: '1%' } },
  ];

  const hideTooltips = () => ReactTooltip.hide();

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      hideTooltips();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  const deleteButton = ({ name, id }) => {
    const tooltipId = createUuid();

    return (
      <CPopover content={t('common.delete')}>
        <div>
          <CButton
            color="primary"
            variant="outline"
            shape="square"
            size="sm"
            className="mx-1"
            data-tip
            data-for={tooltipId}
            data-event="click"
            style={{ width: '33px', height: '30px' }}
          >
            <CIcon content={cilTrash} size="sm" />
          </CButton>
          <ReactTooltip
            id={tooltipId}
            place="top"
            effect="solid"
            globalEventOff="click"
            clickable
            className={[styles.deleteTooltip, 'tooltipRight'].join(' ')}
            border
            borderColor="#321fdb"
            arrowColor="white"
            overridePosition={({ left, top }) => {
              const element = document.getElementById(tooltipId);
              const tooltipWidth = element ? element.offsetWidth : 0;
              const newLeft = left - tooltipWidth * 0.25;
              return { top, left: newLeft };
            }}
          >
            <CCardHeader color="primary" className={styles.tooltipHeader}>
              {t('simulation.delete_simulation', { name })}
              <CButtonClose
                style={{ color: 'white' }}
                onClick={(e) => {
                  e.target.parentNode.parentNode.classList.remove('show');
                  hideTooltips();
                }}
              />
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CButton
                    data-toggle="dropdown"
                    variant="outline"
                    color="danger"
                    onClick={() => deleteSimulation(id)}
                    block
                  >
                    {t('common.confirm')}
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </ReactTooltip>
        </div>
      </CPopover>
    );
  };

  return (
    <>
      <CCard className="m-0 p-0">
        <CCardBody className="p-0">
          <CDataTable
            addTableClasses="ignore-overflow table-sm"
            items={simulations ?? []}
            fields={columns}
            hover
            border
            loading={loading}
            scopedSlots={{
              name: (item) => <td className="align-middle">{item.name}</td>,
              gateway: (item) => <td className="align-middle">{item.gateway}</td>,
              deviceType: (item) => <td className="align-middle">{item.deviceType}</td>,
              devices: (item) => <td className="align-middle">{item.devices}</td>,
              macPrefix: (item) => <td className="align-middle">{item.macPrefix}</td>,
              healthCheckInterval: (item) => (
                <td className="align-middle">{item.healthCheckInterval}</td>
              ),
              stateInterval: (item) => <td className="align-middle">{item.stateInterval}</td>,
              minAssociations: (item) => <td className="align-middle">{item.minAssociations}</td>,
              maxAssociations: (item) => <td className="align-middle">{item.maxAssociations}</td>,
              minClients: (item) => <td className="align-middle">{item.minClients}</td>,
              maxClients: (item) => <td className="align-middle">{item.maxClients}</td>,
              simulationLength: (item) => (
                <td className="align-middle">
                  {item.simulationLength === 0 ? 'Infinity' : item.simulationLength}
                </td>
              ),
              actions: (item) => (
                <td className="text-center align-middle">
                  <CButtonToolbar
                    role="group"
                    className="justify-content-center"
                    style={{ width: '150px' }}
                  >
                    <CPopover content={t('simulation.run_simulation')}>
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mx-1"
                        style={{ width: '33px', height: '30px' }}
                        onClick={() => startSim(item.id)}
                      >
                        <CIcon content={cilMediaPlay} size="sm" />
                      </CButton>
                    </CPopover>
                    {deleteButton(item)}
                    <CPopover content={t('configuration.details')}>
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mx-1"
                        style={{ width: '33px', height: '30px' }}
                        onClick={() => toggleEdit(item.id)}
                      >
                        <CIcon content={cilSearch} size="sm" />
                      </CButton>
                    </CPopover>
                  </CButtonToolbar>
                </td>
              ),
            }}
          />
          <div className="d-flex flex-row pl-3">
            <div className="pr-3">
              <ReactPaginate
                previousLabel="← Previous"
                nextLabel="Next →"
                pageCount={pageCount}
                onPageChange={updatePage}
                forcePage={Number(currentPage)}
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
              />
            </div>
            <p className="pr-2 mt-1">{t('common.items_per_page')}</p>
            <div style={{ width: '100px' }} className="px-2">
              <CSelect
                custom
                defaultValue={simulationsPerPage}
                onChange={(e) => updateSimulationsPerPage(e.target.value)}
                disabled={loading}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </CSelect>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
};

SimulationTable.propTypes = {
  startSim: PropTypes.func.isRequired,
  currentPage: PropTypes.string,
  simulations: PropTypes.instanceOf(Array).isRequired,
  updateSimulationsPerPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  updatePage: PropTypes.func.isRequired,
  simulationsPerPage: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  deleteSimulation: PropTypes.func.isRequired,
};

SimulationTable.defaultProps = {
  currentPage: '0',
};

export default React.memo(SimulationTable);
