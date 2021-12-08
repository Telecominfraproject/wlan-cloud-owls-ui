import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CPopover,
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMediaEject, cilMediaStop, cilX } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth, useToast, FormattedDate } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { cleanBytesString } from 'utils/helper';
import RealtimeLineChart from './RealtimeLineChart';

const initialDelayed = {
  tx: 0,
  rx: 0,
  txDelta: 0,
  rxDelta: 0,
};

const SimulationRunModal = ({ show, toggle }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [waitingForResult, setWaitingForResult] = useState(true);
  const [lastData, setLastData] = useState(null);
  const [delayedData, setDelayedData] = useState({ ...initialDelayed });
  const [charts, setCharts] = useState({
    dataChart: [
      { name: 'TX', data: [] },
      { name: 'RX', data: [] },
    ],
    msgChart: [
      { name: 'Messages TX', data: [] },
      { name: 'Messages RX', data: [] },
    ],
  });

  const addData = (data, oldData) => {
    const newData = data;
    const txSeries = charts.dataChart[0].data;
    const rxSeries = charts.dataChart[1].data;

    // Tx/Rx calcs
    const txDelta = data.tx - oldData.tx;
    const rxDelta = data.rx - oldData.rx;
    newData.txDelta = txDelta;
    newData.rxDelta = rxDelta;

    const date = new Date();
    txSeries.push({ x: date, y: Math.floor((newData.txDelta - oldData.txDelta) / 1024) });
    rxSeries.push({ x: date, y: Math.floor((newData.rxDelta - oldData.rxDelta) / 1024) });

    const newDataArray = [
      { name: 'TX', data: txSeries },
      { name: 'RX', data: rxSeries },
    ];

    const msgTxSeries = charts.msgChart[0].data;
    const msgRxSeries = charts.msgChart[1].data;
    msgTxSeries.push({ x: date, y: oldData.msgsTx ? data.msgsTx - oldData.msgsTx : 0 });
    msgRxSeries.push({ x: date, y: oldData.msgsRx ? data.msgsRx - oldData.msgsRx : 0 });
    const newMsgArray = [
      { name: 'Messages TX', data: msgTxSeries },
      { name: 'Messages RX', data: msgRxSeries },
    ];

    setCharts({
      dataChart: newDataArray,
      msgChart: newMsgArray,
    });

    setDelayedData(newData);
  };

  const changeStatus = (newState) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {};

    axiosInstance
      .post(
        `${endpoints.owls}/api/v1/operation?id=${lastData?.id}&operation=${newState}`,
        parameters,
        options,
      )
      .then((response) => {
        let label = '';

        switch (newState) {
          case 'resume':
            label = t('simulation.resume_success');
            break;
          case 'pause':
            label = t('simulation.pause_success');
            break;
          case 'stop':
            label = t('simulation.stop_success');
            break;
          case 'cancel':
            label = t('simulation.cancel_success');
            break;
          default:
            break;
        }

        addToast({
          title: t('common.success'),
          body: label,
          color: 'success',
          autohide: true,
        });

        setLastData(response.data);
        setWaitingForResult(false);
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('simulation.error_edit_run', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const getSimResult = () => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owls}/api/v1/status`, {
        headers,
      })
      .then((response) => {
        if (
          response.data.state === 'completed' ||
          response.data.state === 'cancelled' ||
          response.data.state === 'none'
        ) {
          setWaitingForResult(false);
        }
        setLastData({
          ...response.data,
          time: Math.floor(new Date().getTime() / 1000),
        });
      })
      .catch(() => {
        setWaitingForResult(false);
      });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(secondsElapsed + 1);
    }, 1000);
    if (!waitingForResult) {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [waitingForResult, secondsElapsed]);

  useEffect(() => {
    const refreshStatus = setInterval(() => {
      getSimResult();
    }, 2000);
    if (!waitingForResult) {
      clearInterval(refreshStatus);
    }
    return () => {
      clearInterval(refreshStatus);
    };
  }, [waitingForResult]);

  useEffect(() => {
    if (lastData !== null) {
      addData(lastData, delayedData);
    }
  }, [lastData]);

  useEffect(() => {
    if (show) setDelayedData({ ...initialDelayed });
  }, [show]);

  return (
    <CModal size="xl" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('simulation.run')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('simulation.stop')}>
            <CButton
              id="stop"
              color="primary"
              variant="outline"
              onClick={() => changeStatus('stop')}
              disabled={!lastData || lastData?.state !== 'running'}
              className="ml-2"
            >
              <CIcon content={cilMediaStop} />
            </CButton>
          </CPopover>
          <CPopover content={t('simulation.cancel')}>
            <CButton
              id="cancel"
              color="primary"
              variant="outline"
              onClick={() => changeStatus('cancel')}
              disabled={!lastData || lastData?.state !== 'running'}
              className="ml-2"
            >
              <CIcon content={cilMediaEject} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="py-3">
        <div className="d-flex align-middle justify-content-center">
          <CSpinner
            className="my-3"
            hidden={
              !waitingForResult ||
              lastData?.state === 'cancelled' ||
              lastData?.state === 'stopped' ||
              lastData?.state === 'completed'
            }
          />
        </div>
        {lastData !== null ? (
          <div>
            <CRow>
              <CCol lg="3" xl="2" className="mb-2">
                {t('status.connection_status')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {lastData?.state}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.last_refresh')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                <FormattedDate date={lastData?.time} />
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.started')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                <FormattedDate date={lastData?.startTime} />
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.end')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                <FormattedDate date={lastData?.endTime} />
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.time_full_devices')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {lastData?.timeToFullDevices} {t('common.seconds')}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('configuration.owner')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {lastData?.owner}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.live_devices')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {lastData?.liveDevices}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.error_devices')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {lastData?.errorDevices}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.transmitted')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {cleanBytesString(lastData?.tx)}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.received')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {cleanBytesString(lastData?.rx)}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.messages_transmitted')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {lastData?.msgsTx}
              </CCol>
              <CCol lg="3" xl="2" className="mb-2">
                {t('simulation.received_messages')}:
              </CCol>
              <CCol lg="3" xl="4" className="mb-2">
                {lastData?.msgsRx}
              </CCol>
            </CRow>
            <CRow hidden={lastData?.state !== 'running'}>
              <CCol>
                <RealtimeLineChart
                  yAxis="Data KB"
                  title="Data"
                  range={150 * 1000}
                  data={charts.dataChart}
                />
              </CCol>
            </CRow>
            <CRow hidden={lastData?.state !== 'running'}>
              <CCol>
                <RealtimeLineChart
                  yAxis="Messages"
                  title="Messages"
                  range={150 * 1000}
                  data={charts.msgChart}
                />
              </CCol>
            </CRow>
          </div>
        ) : null}
      </CModalBody>
    </CModal>
  );
};

SimulationRunModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default SimulationRunModal;
