import * as Yup from 'yup';
import { testMac } from 'helpers/formTests';

export const SimulationSchema = (t: (str: string) => string, defaultType?: string) =>
  Yup.object().shape({
    name: Yup.string().required(t('form.required')).default('Simulation Name'),
    gateway: Yup.string().required(t('form.required')).default('https://your-controller-api-endpoint.your_domain.com'),
    macPrefix: Yup.string()
      .required(t('form.required'))
      .test('macPrefix-valid-mac', t('simulation.mac_prefix_length'), (val) => testMac(`${val}112233`))
      .test('macPrefix-length', t('simulation.mac_prefix_length'), (val) => val?.length === 6)
      .default('AABBCC'),
    healthCheckInterval: Yup.number().required(t('form.required')).moreThan(29).lessThan(6001).integer().default(60),
    stateInterval: Yup.number().required(t('form.required')).moreThan(29).lessThan(6001).integer().default(60),
    minAssociations: Yup.number().required(t('form.required')).moreThan(-1).lessThan(5).integer().default(2),
    maxAssociations: Yup.number().required(t('form.required')).moreThan(-1).lessThan(33).integer().default(8),
    minClients: Yup.number().required(t('form.required')).moreThan(-1).lessThan(5).integer().default(2),
    maxClients: Yup.number().required(t('form.required')).moreThan(-1).lessThan(33).integer().default(8),
    simulationLength: Yup.number().required(t('form.required')).moreThan(-1).integer().default(3600),
    threads: Yup.number().required(t('form.required')).moreThan(3).lessThan(1025).integer().default(16),
    clientInterval: Yup.number().required(t('form.required')).moreThan(0).lessThan(61).integer().default(1),
    reconnectInterval: Yup.number().required(t('form.required')).moreThan(9).lessThan(301).integer().default(30),
    keepAlive: Yup.number().required(t('form.required')).moreThan(119).lessThan(3001).integer().default(300),
    devices: Yup.number().required(t('form.required')).moreThan(0).lessThan(50001).integer().default(10),
    concurrentDevices: Yup.number().required(t('form.required')).moreThan(0).lessThan(1001).integer().default(5),
    deviceType: Yup.string()
      .required(t('form.required'))
      .default(defaultType ?? ''),
  });
