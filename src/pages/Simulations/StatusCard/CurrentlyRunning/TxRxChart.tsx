import * as React from 'react';
import { useColorMode } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  LineControllerChartOptions,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Line } from 'react-chartjs-2';
import { useSimulatorStore } from 'contexts/SimulatorSocketProvider/useStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getDivisionFactor = (maxBytes: number) => {
  if (maxBytes < 1024) {
    return { factor: 1, unit: 'B' };
  }
  if (maxBytes < 1024 * 1024) {
    return { factor: 1024, unit: 'KB' };
  }
  if (maxBytes < 1024 * 1024 * 1024) {
    return { factor: 1024 * 1024, unit: 'MB' };
  }
  return { factor: 1024 * 1024 * 1024, unit: 'GB' };
};

type Props = {
  statusId: string;
};

const TxRxChart = ({ statusId }: Props) => {
  const { colorMode } = useColorMode();
  const currentSimulationData = useSimulatorStore(
    React.useCallback((state) => state.currentSimulationsData[statusId] ?? [], [statusId]),
  );

  const { data, unit } = React.useMemo(() => {
    const { factor, unit: newUnit } = getDivisionFactor(Math.max(...currentSimulationData.map((o) => o.tx)));
    const labels = [] as string[];
    const tx = [] as number[];
    const rx = [] as number[];
    const acc = {
      tx: 0,
      rx: 0,
      entriesCount: 0,
      dates: [] as number[],
    };
    for (const curr of currentSimulationData) {
      if (labels.length === 0) {
        labels.push(curr.timestamp.toLocaleTimeString());
        tx.push(Math.floor((curr.tx / factor) * 100) / 100);
        rx.push(Math.floor((curr.rx / factor) * 100) / 100);
      } else {
        acc.tx += curr.tx;
        acc.rx += curr.rx;
        tx.push(Math.floor((curr.tx / factor) * 100) / 100);
        rx.push(Math.floor((curr.rx / factor) * 100) / 100);
        acc.entriesCount += 1;
        acc.dates.push(curr.timestamp.getTime() / 1000);
        labels.push(curr.timestamp.toLocaleTimeString());
      }
    }

    const newData = {
      labels,
      datasets: [
        {
          label: 'Tx',
          data: tx,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          pointRadius: 0,
        },
        {
          label: 'Rx',
          data: rx,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          pointRadius: 0,
        },
      ],
    };

    return {
      data: newData,
      unit: newUnit,
    };
  }, [currentSimulationData]);

  const options: _DeepPartialObject<
    CoreChartOptions<'line'> &
      ElementChartOptions<'line'> &
      PluginChartOptions<'line'> &
      DatasetChartOptions<'line'> &
      LineControllerChartOptions
  > = React.useMemo(
    () => ({
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: colorMode === 'dark' ? 'white' : undefined,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          position: 'nearest',
          intersect: false,

          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.formattedValue} ${unit}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: colorMode === 'dark' ? 'white' : undefined,
          },
          ticks: {
            color: colorMode === 'dark' ? 'white' : undefined,
            maxRotation: 10,
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          grid: {
            color: colorMode === 'dark' ? 'white' : undefined,
          },
          ticks: {
            color: colorMode === 'dark' ? 'white' : undefined,
            callback: (tickValue: number) => `${tickValue} ${unit}`,
          },
          beginAtZero: true,
        },
      },
      elements: {
        line: {
          tension: 0.4,
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
    }),
    [colorMode, unit],
  );

  return <Line options={options} data={data} />;
};

export default TxRxChart;
