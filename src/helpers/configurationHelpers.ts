import { isNumber, parseToInt } from './numberHelpers';

export const isValidPort = (port?: string) => {
  if (!port) return false;
  const num = parseToInt(port);
  return num !== undefined && num > 0 && num < 65535;
};

export const getPortRange = (port?: string) => {
  if (!port) return undefined;

  const split = port.split('-');

  if (split.length === 2) {
    const first = parseToInt(split[0] ?? '');
    const second = parseToInt(split[1] ?? '');

    if (first !== undefined && second !== undefined) return second - first;
  }
  return undefined;
};

export const isValidPortRange = (v: string) => {
  if (isValidPort(v)) return true;
  const range = getPortRange(v);
  if (range !== undefined && range > 0) return true;
  return false;
};

export const isValidPortRanges = (first: string, second: string) => {
  const isFirstInt = isNumber(first);
  const isSecondInt = isNumber(second);
  if (first === second) return false;

  if (isFirstInt && isSecondInt) {
    const firstNum = parseToInt(first);
    const secondNum = parseToInt(second);
    return firstNum !== secondNum;
  }
  if (isFirstInt !== isSecondInt) return false;

  const firstRange = getPortRange(first);
  const secondRange = getPortRange(second);

  if (firstRange && secondRange) return firstRange === secondRange;

  return false;
};
