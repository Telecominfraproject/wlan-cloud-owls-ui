import React from 'react';
import PropTypes from 'prop-types';
import {
  CForm,
  CInput,
  CLabel,
  CCol,
  CFormText,
  CRow,
  CInvalidFeedback,
  CSelect,
  CSwitch,
} from '@coreui/react';
import { RequiredAsterisk } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const EditSimulationForm = ({ disable, fields, updateField, updateFieldWithKey, editing }) => {
  const { t } = useTranslation();

  return (
    <CForm>
      <CRow>
        <CLabel className="mb-2" sm="2" col htmlFor="name">
          {t('user.name')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="name"
            type="text"
            required
            value={fields.name.value}
            onChange={updateField}
            invalid={fields.name.error}
            disabled={disable || !editing}
            maxLength="50"
          />
          <CFormText hidden={!fields.name.error} color={fields.name.error ? 'danger' : ''}>
            {t('common.required')}
          </CFormText>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="gateway">
          {t('simulation.gateway')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="gateway"
            type="text"
            required
            value={fields.gateway.value}
            onChange={updateField}
            invalid={fields.gateway.error}
            disabled={disable || !editing}
            maxLength="50"
          />
          <CFormText hidden={!fields.gateway.error} color={fields.gateway.error ? 'danger' : ''}>
            {t('common.required')}
          </CFormText>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="macPrefix">
          {t('simulation.mac_prefix')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="macPrefix"
            type="text"
            required
            value={fields.macPrefix.value}
            onChange={updateField}
            invalid={fields.macPrefix.error}
            disabled={disable || !editing}
            maxLength="50"
          />
          <CFormText
            hidden={!fields.macPrefix.error}
            color={fields.macPrefix.error ? 'danger' : ''}
          >
            {t('simulation.prefix_length')}
          </CFormText>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="devices">
          {t('common.devices')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="devices"
            type="number"
            required
            value={fields.devices.value}
            onChange={updateField}
            invalid={
              fields.devices.value < fields.devices.min || fields.devices.value > fields.devices.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CFormText hidden={!fields.devices.error} color={fields.devices.error ? 'danger' : ''}>
            {t('common.required')}
          </CFormText>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="healthCheckInterval">
          {t('simulation.healtcheck_interval')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="healthCheckInterval"
            type="number"
            required
            value={fields.healthCheckInterval.value}
            onChange={updateField}
            invalid={
              fields.healthCheckInterval.value < fields.healthCheckInterval.min ||
              fields.healthCheckInterval.value > fields.healthCheckInterval.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.healthCheckInterval.min,
              max: fields.healthCheckInterval.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="stateInterval">
          {t('simulation.state_interval')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="stateInterval"
            type="number"
            required
            value={fields.stateInterval.value}
            onChange={updateField}
            invalid={
              fields.stateInterval.value < fields.stateInterval.min ||
              fields.stateInterval.value > fields.stateInterval.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.stateInterval.min,
              max: fields.stateInterval.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="clientInterval">
          {t('simulation.client_interval')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="clientInterval"
            type="number"
            required
            value={fields.clientInterval.value}
            onChange={updateField}
            invalid={
              fields.clientInterval.value < fields.clientInterval.min ||
              fields.clientInterval.value > fields.clientInterval.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.clientInterval.min,
              max: fields.clientInterval.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="reconnectInterval">
          {t('simulation.reconnect_interval')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="reconnectInterval"
            type="number"
            required
            value={fields.reconnectInterval.value}
            onChange={updateField}
            invalid={
              fields.reconnectInterval.value < fields.reconnectInterval.min ||
              fields.reconnectInterval.value > fields.reconnectInterval.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.reconnectInterval.min,
              max: fields.reconnectInterval.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="minAssociations">
          {t('simulation.min_associations')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="minAssociations"
            type="number"
            required
            value={fields.minAssociations.value}
            onChange={updateField}
            invalid={
              fields.minAssociations.value < fields.minAssociations.min ||
              fields.minAssociations.value > fields.minAssociations.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.minAssociations.min,
              max: fields.minAssociations.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="maxAssociations">
          {t('simulation.max_associations')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="maxAssociations"
            type="number"
            required
            value={fields.maxAssociations.value}
            onChange={updateField}
            invalid={
              fields.maxAssociations.value < fields.maxAssociations.min ||
              fields.maxAssociations.value > fields.maxAssociations.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.maxAssociations.min,
              max: fields.maxAssociations.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="minClients">
          {t('simulation.min_clients')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="minClients"
            type="number"
            required
            value={fields.minClients.value}
            onChange={updateField}
            invalid={
              fields.minClients.value < fields.minClients.min ||
              fields.minClients.value > fields.minClients.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.minClients.min,
              max: fields.minClients.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="maxClients">
          {t('simulation.max_clients')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="maxClients"
            type="number"
            required
            value={fields.maxClients.value}
            onChange={updateField}
            invalid={
              fields.maxClients.value < fields.maxClients.min ||
              fields.maxClients.value > fields.maxClients.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.maxClients.min,
              max: fields.maxClients.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="simulationLength">
          {t('simulation.length')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CRow>
            <div style={{ display: 'flex', paddingLeft: '15px' }}>
              <CLabel className="mt-1 mr-2" htmlFor="simulationLength">
                Infinity?
              </CLabel>
              <CSwitch
                className="mt-1"
                color="primary"
                disabled={disable || !editing}
                checked={fields.simulationLength.value === 0}
                onClick={() =>
                  updateFieldWithKey('simulationLength', {
                    value: fields.simulationLength.value === 0 ? 720 : 0,
                  })
                }
                labelOn="Yes"
                labelOff="No"
              />
              {fields.simulationLength.value !== 0 && (
                <CInput
                  id="simulationLength"
                  type="number"
                  required
                  disabled={disable || !editing}
                  value={fields.simulationLength.value}
                  onChange={updateField}
                  invalid={
                    fields.simulationLength.value !== 0 && fields.simulationLength.value < 720
                  }
                  pattern="[0-9]*"
                  style={{ width: '100px', marginLeft: '10px' }}
                />
              )}
            </div>
          </CRow>
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.simulationLength.min,
              max: fields.simulationLength.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="threads">
          {t('simulation.threads')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="threads"
            type="number"
            required
            value={fields.threads.value}
            onChange={updateField}
            invalid={
              fields.threads.value < fields.threads.min || fields.threads.value > fields.threads.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.threads.min,
              max: fields.threads.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="keepAlive">
          {t('simulation.keep_alive')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CInput
            id="keepAlive"
            type="number"
            required
            value={fields.keepAlive.value}
            onChange={updateField}
            invalid={
              fields.keepAlive.value < fields.keepAlive.min ||
              fields.keepAlive.value > fields.keepAlive.max
            }
            disabled={disable || !editing}
            pattern="[0-9]*"
            style={{ width: '100px' }}
          />
          <CInvalidFeedback>
            {t('common.min_max', {
              min: fields.keepAlive.min,
              max: fields.keepAlive.max,
            })}
          </CInvalidFeedback>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="deviceType">
          {t('configuration.device_type')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <CSelect
            custom
            id="deviceType"
            type="text"
            required
            value={fields.deviceType.value}
            onChange={updateField}
            invalid={fields.deviceType.error}
            disabled={disable || !editing}
            maxLength="50"
          >
            <option value="cig_wf160d">cig_wf160d</option>
            <option value="cig_wf188">cig_wf188</option>
            <option value="cig_wf188n">cig_wf188n</option>
            <option value="cig_wf194c">cig_wf194c</option>
            <option value="cig_wf194c4">cig_wf194c4</option>
            <option value="edgecore_eap101">edgecore_eap101</option>
            <option value="edgecore_eap102">edgecore_eap102</option>
            <option value="edgecore_ecs4100-12ph">edgecore_ecs4100-12ph</option>
            <option value="edgecore_ecw5211">edgecore_ecw5211</option>
            <option value="edgecore_ecw5410">edgecore_ecw5410</option>
            <option value="edgecore_oap100">edgecore_oap100</option>
            <option value="edgecore_spw2ac1200">edgecore_spw2ac1200</option>
            <option value="edgecore_spw2ac1200-lan-poe">edgecore_spw2ac1200-lan-poe</option>
            <option value="edgecore_ssw2ac2600">edgecore_ssw2ac2600</option>
            <option value="hfcl_ion4.yml">hfcl_ion4.yml</option>
            <option value="indio_um-305ac">indio_um-305ac</option>
            <option value="linksys_e8450-ubi">linksys_e8450-ubi</option>
            <option value="linksys_ea6350">linksys_ea6350</option>
            <option value="linksys_ea6350-v4">linksys_ea6350-v4</option>
            <option value="linksys_ea8300">linksys_ea8300</option>
            <option value="mikrotik_nand">mikrotik_nand</option>
            <option value="tp-link_ec420-g1">tp-link_ec420-g1</option>
            <option value="tplink_cpe210_v3">tplink_cpe210_v3</option>
            <option value="tplink_cpe510_v3">tplink_cpe510_v3</option>
            <option value="tplink_eap225_outdoor_v1">tplink_eap225_outdoor_v1</option>
            <option value="tplink_ec420">tplink_ec420</option>
            <option value="tplink_ex227">tplink_ex227</option>
            <option value="tplink_ex228">tplink_ex228</option>
            <option value="tplink_ex447">tplink_ex447</option>
            <option value="wallys_dr40x9">wallys_dr40x9</option>
          </CSelect>
        </CCol>
      </CRow>
    </CForm>
  );
};

EditSimulationForm.propTypes = {
  disable: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldWithKey: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
};

export default EditSimulationForm;
