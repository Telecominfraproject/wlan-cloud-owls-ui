import React, { useEffect, useState } from 'react';
import { useAuth, useFormFields, useToast } from 'ucentral-libs';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave } from '@coreui/icons';
import PropTypes from 'prop-types';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import AddSimulationForm from './Form';

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
  macPrefix: {
    value: '',
    error: false,
    required: true,
    minLength: 6,
    maxLength: 6,
  },
  healthCheckInterval: {
    value: 60,
    error: false,
    required: true,
    min: 30,
    max: 6000,
  },
  stateInterval: {
    value: 60,
    error: false,
    required: true,
    min: 30,
    max: 6000,
  },
  minAssociations: {
    value: 2,
    error: false,
    min: 0,
    max: 4,
    required: true,
  },
  maxAssociations: {
    value: 8,
    error: false,
    min: 0,
    max: 32,
    required: true,
  },
  minClients: {
    value: 2,
    error: false,
    min: 0,
    max: 4,
    required: true,
  },
  maxClients: {
    value: 4,
    error: false,
    min: 0,
    max: 32,
    required: true,
  },
  simulationLength: {
    value: 3600,
    error: false,
    required: true,
    min: -1,
  },
  threads: {
    value: 16,
    error: false,
    required: true,
    min: 4,
    max: 1024,
  },
  clientInterval: {
    value: 1,
    error: false,
    required: true,
    min: 1,
    maximum: 60,
  },
  keepAlive: {
    value: 300,
    error: false,
    required: true,
    min: 120,
    max: 3000,
  },
  reconnectInterval: {
    value: 30,
    error: false,
    required: true,
    min: 10,
    max: 300,
  },
  deviceType: {
    value: 'cig_wf160d',
    error: false,
    required: true,
    minLength: 1,
  },
  devices: {
    value: 10,
    error: false,
    required: true,
    min: 1,
    max: 50000,
  },
  concurrentDevices: {
    value: 5,
    error: false,
    required: true,
    min: 1,
    max: 1000,
  },
};

const AddSimulationModal = ({ show, toggle, refresh }) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);

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

  const addSimulation = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {};

      for (const [k, v] of Object.entries(fields)) {
        if (!fields.ignore) parameters[k] = v.value;
      }

      axiosInstance
        .post(`${endpoints.owls}/api/v1/simulation`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('simulation.success_creating'),
            color: 'success',
            autohide: true,
          });
          refresh();
          toggle();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('simulation.error_creating', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (show) setFormFields(initialForm);
  }, [show]);

  return (
    <CModal size="xl" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('simulation.add')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton color="primary" variant="outline" onClick={addSimulation}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="pb-5">
        <AddSimulationForm
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          updateFieldWithKey={updateField}
        />
      </CModalBody>
    </CModal>
  );
};

AddSimulationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddSimulationModal;
