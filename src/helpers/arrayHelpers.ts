export const arrayMoveIndex = <T>(arr: T[], startIndex: number, endIndex: number) => {
  const newArr = arr;

  const splicedEl = newArr.splice(startIndex, 1)[0];
  if (splicedEl) {
    newArr.splice(endIndex, 0, splicedEl);
  }

  return newArr;
};

export const arrayMoveIndexes = (arr: unknown[], startIndex: number, endIndex: number) => {
  const newArr = arr;

  newArr.splice(endIndex, 0, newArr.splice(startIndex, 1)[0]);

  return newArr;
};

export const getScaledArray = (arr: number[], minAllowed: number, maxAllowed: number) => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max - min === 0) return arr.map(() => (minAllowed + maxAllowed) / 2);
  return arr.map((num) => ((maxAllowed - minAllowed) * (num - min)) / (max - min) + minAllowed);
};
