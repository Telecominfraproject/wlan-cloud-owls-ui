import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth, useToast, useToggle } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';
import { CCard, CCardBody, CCardHeader, CPopover, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilStream, cilSync } from '@coreui/icons';
import AddSimulationModal from 'components/AddSimulationModal';
import EditSimulationModal from 'components/EditSimulationModal';
import SimulationRunModal from 'components/SimulationRunModal';
import Table from './Table';

const SimulationTable = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const [simulationCount, setSimulationCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(parseInt(sessionStorage.getItem('simulationTable') ?? 0, 10));
  const [simulationsPerPage, setSimulationsPerPage] = useState(
    getItem('simulationsPerPage') || '10',
  );
  const [simulations, setSimulations] = useState([]);
  const [showSimulations, setShownSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, toggleShowAdd] = useToggle(false);
  const [showResult, toggleShowResult] = useToggle(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState('');

  const toggleShowEdit = (id) => {
    if (id) setEditId(id);
    setShowEdit(!showEdit);
  };

  const getList = () => {
    setLoading(true);

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owls}/api/v1/simulation`, {
        headers,
      })
      .then((response) => {
        const simulationsCount = response.data.list.length;
        const pagesCount = Math.ceil(simulationsCount / simulationsPerPage);
        setPageCount(pagesCount);
        setSimulationCount(simulationsCount);

        let selectedPage = page;

        if (page >= pagesCount) {
          setItem('simulationTable', `${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }

        setSimulations(response.data.list);
        setShownSimulations(
          response.data.list.splice(selectedPage * simulationsPerPage, simulationsPerPage),
        );
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('simulation.error_fetching_simulations', {
            error: e.response?.data?.ErrorDescription,
          }),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const deleteSimulation = (id) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(`${endpoints.owls}/api/v1/simulation?id=${id}`, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('simulation.successful_delete'),
          color: 'success',
          autohide: true,
        });
        getList();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('simulation.error_delete', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateSimulationsPerPage = (value) => {
    setItem('simulationPerPage', value);
    setSimulationsPerPage(value);

    const newPageCount = Math.ceil(simulationCount / value);
    setPageCount(newPageCount);

    let selectedPage = page;

    if (page >= newPageCount) {
      setItem('simulationTable', `${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    setShownSimulations(simulations.slice(selectedPage * simulationsPerPage, simulationsPerPage));
  };

  const changePage = ({ selected: selectedPage }) => {
    sessionStorage.setItem('simulationTable', selectedPage);
    setPage(selectedPage);
    setShownSimulations(simulations.slice(selectedPage * simulationsPerPage, simulationsPerPage));
  };

  const startSim = (id) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {};

    axiosInstance
      .post(
        `${endpoints.owls}/api/v1/operation?simulationId=${id}&operation=start`,
        parameters,
        options,
      )
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('simulation.success_run_start'),
          color: 'success',
          autohide: true,
        });
        toggleShowResult();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('simulation.error_start_run', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const checkRunning = () => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owls}/api/v1/status`, {
        headers,
      })
      .then((response) => {
        if (response.data.state === 'running') {
          toggleShowResult();
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    getList();
    checkRunning();
  }, []);

  return (
    <CCard>
      <CCardHeader className="dark-header">
        <div className="d-flex flex-row-reverse align-items-center">
          <div className="text-right">
            <CPopover content={t('simulation.check_ongoing_sims')}>
              <CButton size="sm" color="info" onClick={toggleShowResult}>
                <CIcon content={cilStream} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.add')}>
              <CButton size="sm" color="info" onClick={toggleShowAdd} className="ml-2">
                <CIcon content={cilPlus} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.refresh')}>
              <CButton size="sm" color="info" onClick={getList} className="ml-2">
                <CIcon content={cilSync} />
              </CButton>
            </CPopover>
          </div>
          <div className="text-value-lg mr-auto">{t('simulation.title')}</div>
        </div>
      </CCardHeader>
      <CCardBody className="p-0">
        <Table
          startSim={startSim}
          currentPage={page}
          simulations={showSimulations}
          loading={loading}
          updateSimulationsPerPage={updateSimulationsPerPage}
          simulationsPerPage={simulationsPerPage}
          pageCount={pageCount}
          updatePage={changePage}
          pageRangeDisplayed={5}
          deleteSimulation={deleteSimulation}
          toggleEdit={toggleShowEdit}
        />
        <AddSimulationModal show={showAdd} toggle={toggleShowAdd} refresh={getList} />
        <EditSimulationModal
          show={showEdit}
          toggle={toggleShowEdit}
          toggleResult={toggleShowResult}
          refresh={getList}
          id={editId}
        />
        {showResult ? <SimulationRunModal show={showResult} toggle={toggleShowResult} /> : null}
      </CCardBody>
    </CCard>
  );
};

export default SimulationTable;
