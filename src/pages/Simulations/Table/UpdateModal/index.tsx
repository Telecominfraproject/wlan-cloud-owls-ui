import * as React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Tooltip,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Play, Stop } from '@phosphor-icons/react';
import axios from 'axios';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimulationSchema } from '../../utils';
import { SaveButton } from 'components/Buttons/SaveButton';
import { ToggleEditButton } from 'components/Buttons/ToggleEditButton';
import DurationField from 'components/Form/Fields/DurationField';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { Modal } from 'components/Modals/Modal';
import { DEVICE_TYPES } from 'constants/deviceTypes';
import { useGetDeviceTypes } from 'hooks/Network/Firmware';
import {
  Simulation,
  useGetSimulationsStatus,
  useStartSimulation,
  useStopSimulation,
  useUpdateSimulation,
} from 'hooks/Network/Simulations';
import { useFormRef } from 'hooks/useFormRef';
import { useMutationResult } from 'hooks/useMutationResult';
import { AxiosError } from 'models/Axios';

type Props = {
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
  simulation: Simulation;
};

const UpdateSimulationModal = ({ modalProps, simulation }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen: isEditing, onToggle: onToggleEditing, onClose: stopEditing } = useDisclosure();
  const getDeviceTypes = useGetDeviceTypes();
  const { form, formRef } = useFormRef();
  const [formKey, setFormKey] = React.useState(uuid());
  const updateSim = useUpdateSimulation();
  const { onSuccess, onError } = useMutationResult({
    objName: t('simulation.one'),
    operationType: 'update',
    onClose: () => {},
  });
  const getStatus = useGetSimulationsStatus();
  const startSim = useStartSimulation();
  const stopSim = useStopSimulation();

  const currentSimulationStatus = getStatus.data?.find(({ simulationId }) => simulationId === simulation.id);

  // const handleDeleteDevicesClick = () => {
  //   onOpenDevicesDelete(simulation);
  // };

  const handleStartClick = () =>
    startSim.mutate(
      { id: simulation.id },
      {
        onSuccess: () => {
          toast({
            id: 'sim-start-success',
            title: t('common.success'),
            description: t('simulation.start_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            toast({
              id: 'sim-start-error',
              title: t('common.error'),
              description: e?.response?.data?.ErrorDescription,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        },
      },
    );
  const handleStopClick = () =>
    stopSim.mutate(
      { simulationId: simulation.id, runId: currentSimulationStatus?.id ?? '' },
      {
        onSuccess: () => {
          toast({
            id: 'sim-stop-success',
            title: t('common.success'),
            description: t('simulation.stop_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          if (axios.isAxiosError(e)) {
            toast({
              id: 'sim-stop-error',
              title: t('common.error'),
              description: e?.response?.data?.ErrorDescription,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        },
      },
    );

  React.useEffect(() => {
    setFormKey(uuid());
    stopEditing();
  }, [modalProps.isOpen, simulation]);

  React.useEffect(() => {
    setFormKey(uuid());
  }, [isEditing]);

  return (
    <Modal
      isOpen={modalProps.isOpen}
      onClose={modalProps.onClose}
      title={simulation.name}
      topRightButtons={
        <>
          <SaveButton
            onClick={form.submitForm}
            isLoading={form.isSubmitting}
            hidden={!isEditing}
            isDisabled={!form.isValid || !form.dirty}
          />
          <ToggleEditButton
            toggleEdit={onToggleEditing}
            isEditing={isEditing}
            isDisabled={currentSimulationStatus?.state === 'running'}
          />
          {/* <Tooltip hasArrow label={t('simulation.delete_simulation_devices')} placement="top">
            <IconButton
              aria-label={t('simulation.delete_simulation_devices')}
              colorScheme="yellow"
              icon={<Broom size={20} />}
              isDisabled={currentSimulationStatus?.state === 'running'}
              onClick={handleDeleteDevicesClick}
            />
          </Tooltip> */}
          {currentSimulationStatus && currentSimulationStatus.state === 'running' ? (
            <Tooltip hasArrow label={t('simulation.stop')} placement="top">
              <IconButton
                aria-label={t('simulation.stop')}
                colorScheme="yellow"
                icon={<Stop size={20} />}
                onClick={handleStopClick}
                isDisabled={isEditing}
                isLoading={stopSim.isLoading}
              />
            </Tooltip>
          ) : (
            <Tooltip hasArrow label={t('simulation.start')} placement="top" isDisabled={!getStatus.data}>
              <IconButton
                aria-label={t('simulation.start')}
                colorScheme="green"
                icon={<Play size={20} />}
                onClick={handleStartClick}
                isLoading={startSim.isLoading}
                isDisabled={isEditing}
              />
            </Tooltip>
          )}
        </>
      }
    >
      {simulation && (
        <Formik
          innerRef={formRef as React.Ref<FormikProps<object>>}
          key={formKey}
          initialValues={simulation}
          validationSchema={SimulationSchema(t, (getDeviceTypes.data?.deviceTypes ?? DEVICE_TYPES)[0])}
          onSubmit={async (data, { setSubmitting, resetForm }) =>
            updateSim.mutateAsync(
              { ...(data as Partial<Simulation>), id: simulation.id },
              {
                onSuccess: () => {
                  onSuccess();
                  setSubmitting(false);
                  resetForm();
                  modalProps.onClose();
                },
                onError: (e) => {
                  onError(e as AxiosError);
                  setSubmitting(false);
                },
              },
            )
          }
        >
          <Form>
            <Box>
              <SimpleGrid minChildWidth="200px" spacing={2} mb={2}>
                <StringField name="name" label={t('common.name')} isRequired isDisabled={!isEditing} />
                <StringField name="gateway" label={t('simulation.controller')} isRequired isDisabled={!isEditing} />
                <NumberField
                  name="threads"
                  label={t('simulation.threads')}
                  w="100px"
                  isRequired
                  isDisabled={!isEditing}
                />
              </SimpleGrid>
              <DurationField
                name="simulationLength"
                label={t('simulation.duration')}
                isRequired
                unit="s"
                isDisabled={!isEditing}
              />
              <Heading size="sm" mt={4}>
                {t('devices.title')}
              </Heading>
              <Wrap>
                <WrapItem>
                  <SelectField
                    name="deviceType"
                    label={t('common.type')}
                    options={
                      (getDeviceTypes.data?.deviceTypes ?? DEVICE_TYPES).map((v) => ({
                        value: v,
                        label: v,
                      })) ?? []
                    }
                    isRequired
                    isDisabled={!isEditing}
                  />
                </WrapItem>
                <WrapItem>
                  <StringField
                    name="macPrefix"
                    label={t('simulation.mac_prefix')}
                    w="120px"
                    isRequired
                    isDisabled={!isEditing}
                  />
                </WrapItem>
                <WrapItem>
                  <NumberField name="devices" label={t('devices.title')} w="140px" isRequired isDisabled={!isEditing} />
                </WrapItem>
                <WrapItem>
                  <NumberField
                    name="concurrentDevices"
                    w="100px"
                    label={t('simulation.concurrent_devices')}
                    isRequired
                    isDisabled={!isEditing}
                  />
                </WrapItem>
              </Wrap>
              <Heading size="sm" mt={4}>
                {t('configurations.advanced_settings')}
              </Heading>
              <Flex my={2}>
                <Box mr={2} w="170px">
                  <NumberField
                    name="minAssociations"
                    label={t('simulation.min_associations')}
                    isRequired
                    isDisabled={!isEditing}
                  />
                </Box>
                <Box w="170px">
                  <NumberField
                    name="maxAssociations"
                    label={t('simulation.max_associations')}
                    isRequired
                    isDisabled={!isEditing}
                  />
                </Box>
              </Flex>
              <Flex my={2}>
                <Box mr={2} w="170px">
                  <NumberField
                    name="minClients"
                    label={t('simulation.min_clients')}
                    isRequired
                    isDisabled={!isEditing}
                  />
                </Box>
                <Box mr={2} w="170px">
                  <NumberField
                    name="maxClients"
                    label={t('simulation.max_clients')}
                    isRequired
                    isDisabled={!isEditing}
                  />
                </Box>
                <Box w="170px">
                  <NumberField
                    name="clientInterval"
                    label={t('simulation.client_interval')}
                    isRequired
                    isDisabled={!isEditing}
                  />
                </Box>
              </Flex>
              <Flex my={2}>
                <Box mr={2} w="190px">
                  <NumberField
                    name="healthCheckInterval"
                    label={t('simulation.healthcheck_interval')}
                    isRequired
                    unit="s"
                    isDisabled={!isEditing}
                  />
                </Box>
                <Box mr={2} w="160px">
                  <NumberField
                    name="stateInterval"
                    label={t('simulation.state_interval')}
                    isRequired
                    unit="s"
                    isDisabled={!isEditing}
                  />
                </Box>
                <Box w="180px">
                  <NumberField
                    name="reconnectInterval"
                    label={t('simulation.reconnect_interval')}
                    isRequired
                    unit="s"
                    isDisabled={!isEditing}
                  />
                </Box>
              </Flex>
              <Box w="160px" my={2}>
                <NumberField
                  name="keepAlive"
                  label={t('simulation.keep_alive')}
                  isRequired
                  unit="s"
                  isDisabled={!isEditing}
                />
              </Box>
            </Box>
          </Form>
        </Formik>
      )}
    </Modal>
  );
};

export default UpdateSimulationModal;
