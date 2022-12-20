import * as React from 'react';
import { Box, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimulationSchema } from '../../utils';
import { CreateButton } from 'components/Buttons/CreateButton';
import { SaveButton } from 'components/Buttons/SaveButton';
import DurationField from 'components/Form/Fields/DurationField';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ConfirmCloseAlertModal } from 'components/Modals/ConfirmCloseAlert';
import { Modal } from 'components/Modals/Modal';
import { DEVICE_TYPES } from 'constants/deviceTypes';
import { useGetDeviceTypes } from 'hooks/Network/Firmware';
import { Simulation, useCreateSimulation } from 'hooks/Network/Simulations';
import { useFormModal } from 'hooks/useFormModal';
import { useFormRef } from 'hooks/useFormRef';
import { useMutationResult } from 'hooks/useMutationResult';
import { AxiosError } from 'models/Axios';

const CreateSimulationModal = () => {
  const { t } = useTranslation();
  const getDeviceTypes = useGetDeviceTypes();
  const deviceTypes = getDeviceTypes.data?.deviceTypes ?? DEVICE_TYPES;
  const { form, formRef } = useFormRef();
  const [formKey, setFormKey] = React.useState(uuid());
  const { isOpen, isConfirmOpen, onOpen, closeConfirm, closeModal, closeCancelAndForm } = useFormModal({
    isDirty: form?.dirty,
  });
  const createSim = useCreateSimulation();
  const { onSuccess, onError } = useMutationResult({
    objName: t('simulation.one'),
    operationType: 'create',
    onClose: () => {},
  });

  React.useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);
  return (
    <>
      <CreateButton onClick={onOpen} />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={t('crud.create_object', { obj: t('simulation.one') })}
        topRightButtons={
          <SaveButton
            onClick={form.submitForm}
            isLoading={form.isSubmitting}
            isDisabled={!form.isValid || !form.dirty}
          />
        }
      >
        <Formik
          innerRef={formRef as React.Ref<FormikProps<object>>}
          key={formKey}
          initialValues={SimulationSchema(t, deviceTypes[0]).cast(undefined)}
          validationSchema={SimulationSchema(t, deviceTypes[0])}
          onSubmit={async (data, { setSubmitting, resetForm }) =>
            createSim.mutateAsync(data as Partial<Simulation>, {
              onSuccess: () => {
                onSuccess();
                closeCancelAndForm();
                setSubmitting(false);
                resetForm();
              },
              onError: (e) => {
                onError(e as AxiosError);
                setSubmitting(false);
              },
            })
          }
        >
          <Form>
            <Box>
              <SimpleGrid minChildWidth="200px" spacing={2} mb={2}>
                <StringField name="name" label={t('common.name')} isRequired />
                <StringField name="gateway" label={t('simulation.controller')} isRequired />
                <NumberField name="threads" label={t('simulation.threads')} w="100px" isRequired />
              </SimpleGrid>
              <DurationField name="simulationLength" label={t('simulation.duration')} isRequired unit="s" />
              <Heading size="sm" mt={4}>
                {t('devices.title')}
              </Heading>
              <SimpleGrid minChildWidth="200px" spacing={2}>
                <SelectField
                  name="deviceType"
                  label={t('common.type')}
                  options={
                    deviceTypes.map((v) => ({
                      value: v,
                      label: v,
                    })) ?? []
                  }
                  isRequired
                />
                <StringField name="macPrefix" label={t('simulation.mac_prefix')} w="110px" isRequired />
                <NumberField name="devices" label={t('devices.title')} w="100px" isRequired />
                <NumberField name="concurrentDevices" w="100px" label={t('simulation.concurrent_devices')} isRequired />
              </SimpleGrid>
              <Heading size="sm" mt={4}>
                {t('configurations.advanced_settings')}
              </Heading>
              <Flex my={2}>
                <Box mr={2} w="160px">
                  <NumberField name="minAssociations" label={t('simulation.min_associations')} isRequired />
                </Box>
                <Box w="160px">
                  <NumberField name="maxAssociations" label={t('simulation.max_associations')} isRequired />
                </Box>
              </Flex>
              <Flex my={2}>
                <Box mr={2} w="160px">
                  <NumberField name="minClients" label={t('simulation.min_clients')} isRequired />
                </Box>
                <Box mr={2} w="160px">
                  <NumberField name="maxClients" label={t('simulation.max_clients')} isRequired />
                </Box>
                <Box w="160px">
                  <NumberField name="clientInterval" label={t('simulation.client_interval')} isRequired />
                </Box>
              </Flex>
              <Flex my={2}>
                <Box mr={2} w="180px">
                  <NumberField
                    name="healthCheckInterval"
                    label={t('simulation.healthcheck_interval')}
                    isRequired
                    unit="s"
                  />
                </Box>
                <Box mr={2} w="160px">
                  <NumberField name="stateInterval" label={t('simulation.state_interval')} isRequired unit="s" />
                </Box>
                <Box w="160px">
                  <NumberField
                    name="reconnectInterval"
                    label={t('simulation.reconnect_interval')}
                    isRequired
                    unit="s"
                  />
                </Box>
              </Flex>
              <Box w="160px" my={2}>
                <NumberField name="keepAlive" label={t('simulation.keep_alive')} isRequired unit="s" />
              </Box>
            </Box>
          </Form>
        </Formik>
      </Modal>
      <ConfirmCloseAlertModal isOpen={isConfirmOpen} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </>
  );
};

export default CreateSimulationModal;
