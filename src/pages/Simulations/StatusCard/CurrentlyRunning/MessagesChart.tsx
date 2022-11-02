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
  ScaleChartOptions,
  LineControllerChartOptions,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Line } from 'react-chartjs-2';
import { useSimulatorStore } from 'contexts/SimulatorSocketProvider/useStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MessagesChart = () => {
  const { colorMode } = useColorMode();
  const currentSimulationData = useSimulatorStore((state) => state.currentSimulationData);

  const { data } = React.useMemo(() => {
    const labels = [] as string[];
    const msgsTx = [] as number[];
    const msgsRx = [] as number[];
    const acc = {
      msgsTx: 0,
      msgsRx: 0,
      entriesCount: 0,
      dates: [] as number[],
    };
    for (const curr of currentSimulationData) {
      if (labels.length === 0) {
        labels.push(curr.timestamp.toLocaleTimeString());
        msgsTx.push(curr.msgsTx);
        msgsRx.push(curr.msgsRx);
      } else if (acc.entriesCount < 3) {
        acc.msgsTx += curr.msgsTx;
        acc.msgsRx += curr.msgsRx;
        acc.entriesCount += 1;
        acc.dates.push(Math.floor(curr.timestamp.getTime() / 1000));
      } else {
        labels.push(
          new Date(Math.floor(acc.dates.reduce((a, b) => a + b, 0) / acc.entriesCount) * 1000).toLocaleTimeString(),
        );
        msgsTx.push(acc.msgsTx);
        msgsRx.push(acc.msgsRx);
        acc.msgsTx = 0;
        acc.msgsRx = 0;
        acc.entriesCount = 0;
        acc.dates = [];
      }
    }

    const newData = {
      labels,
      datasets: [
        {
          label: 'Tx Msgs.',
          data: msgsTx,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          pointRadius: 0,
        },
        {
          label: 'Rx Msgs.',
          data: msgsRx,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          pointRadius: 0,
        },
      ],
    };

    return {
      data: newData,
    };
  }, [currentSimulationData]);

  const options: _DeepPartialObject<
    CoreChartOptions<'line'> &
      ElementChartOptions<'line'> &
      PluginChartOptions<'line'> &
      DatasetChartOptions<'line'> &
      ScaleChartOptions<any> &
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
            label: (context) => `${context.dataset.label}: ${context.formattedValue}`,
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
            precision: 0,
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
    [colorMode],
  );

  return <Line options={options} data={data} />;
};

export default MessagesChart;
