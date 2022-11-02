export const getSuccessColor = (colorMode = 'light') =>
  colorMode === 'light' ? 'var(--chakra-colors-success-600)' : 'var(--chakra-colors-success-600)';
export const getWarningColor = (colorMode = 'light') =>
  colorMode === 'light' ? 'var(--chakra-colors-warning-400)' : 'var(--chakra-colors-warning-400)';
export const getErrorColor = (colorMode = 'light') =>
  colorMode === 'light' ? 'var(--chakra-colors-danger-400)' : 'var(--chakra-colors-danger-400)';

const getMixedColors = (start: number, end: number, percent: number) => start + percent * (end - start);

const getHexFromRGB = (red: number, green: number, blue: number) => {
  let r = red.toString(16);
  let g = green.toString(16);
  let b = blue.toString(16);

  while (r.length < 2) {
    r = `0${r}`;
  }
  while (g.length < 2) {
    g = `0${g}`;
  }
  while (b.length < 2) {
    b = `0${b}`;
  }

  return `#${r}${g}${b}`;
};

const getColorChar = (str: string, index: number) => str[index] ?? '0';

export const getBlendedColor = (color1: string, color2: string, percent: number) => {
  if (color1.length >= 7 && color2.length >= 7) {
    const red1 = parseInt(getColorChar(color1, 1) + getColorChar(color1, 2), 16);
    const green1 = parseInt(getColorChar(color1, 3) + getColorChar(color1, 4), 16);
    const blue1 = parseInt(getColorChar(color1, 5) + getColorChar(color1, 6), 16);

    const red2 = parseInt(getColorChar(color2, 1) + getColorChar(color2, 2), 16);
    const green2 = parseInt(getColorChar(color2, 3) + getColorChar(color2, 4), 16);
    const blue2 = parseInt(getColorChar(color2, 5) + getColorChar(color2, 6), 16);

    const red = Math.round(getMixedColors(red1, red2, percent));
    const green = Math.round(getMixedColors(green1, green2, percent));
    const blue = Math.round(getMixedColors(blue1, blue2, percent));

    return getHexFromRGB(red, green, blue);
  }
  return color1;
};
