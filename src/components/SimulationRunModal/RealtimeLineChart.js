import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const RealtimeLineChart = ({ yAxis, title, data, range }) => {
  const options = {
    chart: {
      id: title,
      height: 300,
      type: 'realtime',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 100,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: title,
      align: 'left',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
      range,
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      title: {
        text: yAxis,
        style: {
          fontSize: '15px',
        },
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
        format: 'HH:MM:ss',
      },
    },
  };

  useEffect(() => {
    ApexCharts.exec(title, 'updateSeries', data);
  }, [data]);

  return <Chart type="line" options={options} series={data} height={300} />;
};

RealtimeLineChart.propTypes = {
  yAxis: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  range: PropTypes.number.isRequired,
};

export default RealtimeLineChart;
