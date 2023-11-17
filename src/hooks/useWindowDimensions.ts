import * as React from 'react';
import debounce from 'helpers/debounce';

export type UseWindowDimensionsProps = {
  delay?: number;
};

export const useWindowDimensions = ({ delay = 100 }: UseWindowDimensionsProps = {}): {
  innerWidth: number;
  innerHeight: number;
} => {
  const [dimension, setDimension] = React.useState<{ innerWidth: number; innerHeight: number }>({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  });

  React.useEffect(() => {
    const debouncedResizeHandler = debounce(() => {
      setDimension({ innerWidth: window.innerWidth, innerHeight: window.innerHeight });
    }, delay);
    window.addEventListener('resize', debouncedResizeHandler);
    return () => window.removeEventListener('resize', debouncedResizeHandler);
  }, []);

  return dimension;
};

export type WindowDimensions = ReturnType<typeof useWindowDimensions>;
