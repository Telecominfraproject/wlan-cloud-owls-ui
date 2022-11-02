export const parseToInt = (val: string) => {
  try {
    const parsed = parseInt(val, 10);
    if (Number.isNaN(parsed)) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
};

export const isNumber = (str: string) => {
  try {
    const num = Number(str);
    return !Number.isNaN(num);
  } catch {
    return false;
  }
};
