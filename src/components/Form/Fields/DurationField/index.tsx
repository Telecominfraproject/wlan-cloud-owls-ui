import * as React from 'react';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFastField } from 'hooks/useFastField';

type Props = {
  name: string;
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  unit?: string;
};

const DurationField = ({ name, label, isRequired, isDisabled, unit }: Props) => {
  const { t } = useTranslation();
  const { value, onChange, isError, error } = useFastField<number | undefined>({ name });

  const onRadioChange = (v: string) => {
    if (v === '0') onChange(0);
    else onChange(3600);
  };

  return (
    <FormControl isInvalid={isError} isRequired={isRequired} isDisabled={isDisabled}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
      </FormLabel>
      <Flex h="40px">
        <RadioGroup onChange={onRadioChange} defaultValue={value === 0 ? '0' : '1'} my="auto">
          <Stack spacing={5} direction="row">
            <Radio colorScheme="blue" value="0">
              {t('simulation.infinite')}
            </Radio>
            <Radio colorScheme="green" value="1">
              <Flex>
                <Text my="auto" mr={2}>
                  {t('common.custom')}
                </Text>
              </Flex>
            </Radio>
          </Stack>
        </RadioGroup>
        <InputGroup>
          <NumberInput
            isDisabled={value === 0 || isDisabled}
            min={1}
            value={value}
            onChange={(_, v) => {
              if (Number.isNaN(v) || v === 0) onChange(1);
              else onChange(v);
            }}
            w="120px"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <InputRightAddon>{unit}</InputRightAddon>
        </InputGroup>
      </Flex>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default DurationField;
