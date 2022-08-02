import React, { useEffect, useState } from 'react';
import { useAuth, useFormFields, useToast, FormattedDate } from 'ucentral-libs';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CPopover,
  CNav,
  CNavLink,
  CTabPane,
  CTabContent,
  CDataTable,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave, cilPen, cilMediaPlay, cilTrash } from '@coreui/icons';
import PropTypes from 'prop-types';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import { cleanBytesString, compactSecondsToDetailed } from 'utils/helper';
import EditSimulationForm from './Form';

const initialForm = {
  name: {
    value: '',
    error: false,
    required: true,
  },
  gateway: {
    value: '',
    error: false,
    required: true,
  },
  certificate: {
    value: '',
    error: false,
    required: true,
  },
  key: {
    value: '',
    error: false,
    required: true,
  },
  macPrefix: {
    value: '',
    error: false,
    required: true,
    minLength: 6,
    maxLength: 6,
  },
  devices: {
    value: 1,
    error: false,
    required: true,
    min: 1,
  },
  healthCheckInterval: {
    value: 30,
    error: false,
    required: true,
    min: 30,
    max: 6000,
  },
  stateInterval: {
    value: 30,
    error: false,
    required: true,
    min: 30,
    max: 6000,
  },
  minAssociations: {
    value: 0,
    error: false,
    min: 0,
    max: 4,
    required: true,
  },
  maxAssociations: {
    value: 0,
    error: false,
    min: 0,
    max: 32,
    required: true,
  },
  minClients: {
    value: 0,
    error: false,
    min: 0,
    max: 4,
    required: true,
  },
  maxClients: {
    value: 0,
    error: false,
    min: 0,
    max: 32,
    required: true,
  },
  simulationLength: {
    value: 720,
    error: false,
    required: true,
    min: -1,
  },
  threads: {
    value: 1,
    error: false,
    required: true,
    min: 1,
  },
  clientInterval: {
    value: 1,
    error: false,
    required: true,
    min: 1,
  },
  reconnectInterval: {
    value: 1,
    error: false,
    required: true,
    min: 1,
  },
  keepAlive: {
    value: 1,
    error: false,
    required: true,
    min: 1,
  },
  deviceType: {
    value: 'cig_wf160d',
    error: false,
    required: true,
    minLength: 1,
  },
};

const EditSimulationModal = ({ show, toggle, toggleResult, refresh, id }) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [sim, setSim] = useState({});
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState(0);

  const columns = [
    {
      key: 'startTime',
      label: t('simulation.started'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    {
      key: 'endTime',
      label: t('simulation.end'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    {
      key: 'timeToFullDevices',
      label: t('device.all_devices'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    {
      key: 'timePerDevice',
      label: t('common.time_per_device'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    {
      key: 'liveDevices',
      label: t('common.devices'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    {
      key: 'errorDevices',
      label: t('common.errors'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    { key: 'tx', label: 'TX', filter: false, sorter: false, _style: { width: '1%' } },
    {
      key: 'msgsTx',
      label: t('simulation.messages_transmitted'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    { key: 'rx', label: 'RX', filter: false, sorter: false, _style: { width: '1%' } },
    {
      key: 'msgsRx',
      label: t('simulation.received_messages'),
      filter: false,
      sorter: false,
      _style: { width: '1%' },
    },
    {
      key: 'owner',
      label: t('configuration.owner'),
      filter: false,
      sorter: false,
    },
    { key: '_action', label: '', filter: false, sorter: false, _style: { width: '1%' } },
  ];

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (
        (typeof field.value === 'string' &&
          (field.value === '' ||
            (field.minLength && field.value.length < field.minLength) ||
            (field.maxLength && field.value.length < field.maxLength))) ||
        (!Number.isNaN(field.value) &&
          ((field.min && field.value < field.min) || (field.max && field.value > field.max)))
      ) {
        updateField(key, { error: true });
        success = false;
        break;
      }
    }
    return success;
  };

  const getResults = () => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owls}/api/v1/results?id=${id}`, {
        headers,
      })
      .then((response) => {
        const finalResults = [];

        for (const result of response.data.list.sort((a, b) => b.startTime - a.startTime)) {
          if (result.simulationId === id) finalResults.push(result);
        }

        setResults(finalResults);
      })
      .catch(() => {});
  };
  const saveSimulation = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        id,
      };

      for (const [k, v] of Object.entries(fields)) {
        if (!fields.ignore) parameters[k] = v.value;
      }

      axiosInstance
        .put(`${endpoints.owls}/api/v1/simulation?id=${id}`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('simulation.successful_edit'),
            color: 'success',
            autohide: true,
          });
          refresh();
          toggle();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('simulation.error_edit', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getSim = () => {
    setLoading(true);

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owls}/api/v1/simulation?id=${id}`, {
        headers,
      })
      .then((response) => {
        const newSim = response.data.list.find((el) => el.id === id);

        if (newSim !== undefined) {
          const newFields = fields;
          for (const [key] of Object.entries(newFields)) {
            if (newSim[key] !== undefined) {
              newFields[key].value = newSim[key];
            }
          }
          setSim(newSim);
          setFormFields({ ...newFields }, true);

          return axiosInstance.get(`${endpoints.owls}/api/v1/results?id=${id}`, {
            headers,
          });
        }
        return null;
      })
      .then((response) => {
        if (response) {
          const finalResults = [];

          for (const result of response.data.list.sort((a, b) => b.startTime - a.startTime)) {
            if (result.simulationId === id) finalResults.push(result);
          }

          setResults(finalResults);
        }
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

  const startSim = () => {
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
        toggle();
        toggleResult();
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

  const deleteResult = (delId) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(`${endpoints.owls}/api/v1/results?id=${delId}`, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('simulation.successful_delete'),
          color: 'success',
          autohide: true,
        });
        getResults();
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

  useEffect(() => {
    if (show) {
      setEditing(false);
      getSim();
    }
  }, [show]);

  return (
    <CModal size="xl" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">
          {t('common.edit')} {sim.name}
        </CModalTitle>
        <div className="text-right">
          <CPopover content={t('simulation.run_simulation')}>
            <CButton color="primary" variant="outline" onClick={startSim} disabled={editing}>
              <CIcon content={cilMediaPlay} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.save')}>
            <CButton
              color="primary"
              variant="outline"
              onClick={saveSimulation}
              disabled={!editing}
              className="ml-2"
            >
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.edit')}>
            <CButton
              color="primary"
              variant="outline"
              className="ml-2"
              onClick={() => setEditing(true)}
              disabled={editing}
            >
              <CIcon content={cilPen} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="pt-0 pb-5">
        <CNav variant="tabs" className="mb-0 p-0">
          <CNavLink
            className="font-weight-bold"
            href="#"
            active={index === 0}
            onClick={() => setIndex(0)}
          >
            {t('common.main')}
          </CNavLink>
          <CNavLink
            className="font-weight-bold"
            href="#"
            active={index === 1}
            onClick={() => setIndex(1)}
          >
            {t('simulation.previous_runs')}
          </CNavLink>
        </CNav>
        <CTabContent>
          <CTabPane active={index === 0} className="pt-2">
            {index === 0 ? (
              <EditSimulationForm
                show={show}
                disable={loading}
                editing={editing}
                fields={fields}
                updateField={updateFieldWithId}
                updateFieldWithKey={updateField}
              />
            ) : null}
          </CTabPane>
          <CTabPane active={index === 1} className="pt-2">
            {index !== 1 ? null : (
              <CDataTable
                addTableClasses="ignore-overflow table-sm"
                items={results ?? []}
                fields={columns}
                hover
                border
                loading={loading}
                scopedSlots={{
                  startTime: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '90px' }}>
                        <FormattedDate date={item.startTime} />
                      </div>
                    </td>
                  ),
                  endTime: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '90px' }}>
                        <FormattedDate date={item.endTime} />
                      </div>
                    </td>
                  ),
                  timeToFullDevices: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '115px' }}>
                        {compactSecondsToDetailed(
                          item.timeToFullDevices,
                          t('common.day'),
                          t('common.days'),
                          t('common.seconds'),
                        )}
                      </div>
                    </td>
                  ),
                  timePerDevice: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '100px' }}>
                        {item.timeToFullDevices > 0
                          ? Math.round(
                              ((item.liveDevices + item.errorDevices) / item.timeToFullDevices) *
                                100,
                            ) / 100
                          : '-'}
                      </div>
                    </td>
                  ),
                  tx: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '80px' }}>{cleanBytesString(item.tx)}</div>
                    </td>
                  ),
                  rx: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '80px' }}>{cleanBytesString(item.rx)}</div>
                    </td>
                  ),
                  liveDevices: (item) => <td className="align-middle">{item.liveDevices}</td>,
                  errorDevices: (item) => <td className="align-middle">{item.errorDevices}</td>,
                  msgsTx: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '70px' }}>{item.msgsTx}</div>
                    </td>
                  ),
                  msgsRx: (item) => (
                    <td className="align-middle">
                      <div style={{ width: '70px' }}>{item.msgsRx}</div>
                    </td>
                  ),
                  minClients: (item) => <td className="align-middle">{item.minClients}</td>,
                  maxClients: (item) => <td className="align-middle">{item.maxClients}</td>,
                  owner: (item) => <td className="align-middle">{item.owner}</td>,
                  _action: (item) => (
                    <td className="align-middle">
                      <CPopover content={t('common.delete')}>
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          className="mx-1"
                          onClick={() => deleteResult(item.id)}
                          style={{ width: '33px', height: '30px' }}
                        >
                          <CIcon name="cil-trash" content={cilTrash} size="sm" />
                        </CButton>
                      </CPopover>
                    </td>
                  ),
                }}
              />
            )}
          </CTabPane>
        </CTabContent>
      </CModalBody>
    </CModal>
  );
};

EditSimulationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  toggleResult: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default EditSimulationModal;
