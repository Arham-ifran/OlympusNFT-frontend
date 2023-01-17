import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts'
class MonthlyEarningChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px',
              },
              value: {
                fontSize: '16px',
              },
              total: {
                show: true,
                label: 'Monthly Sales',
                formatter: function (w) {
                  return w.config.series[0]
                }
              }
            }
          }
        },
        labels: ['Monthly Sales'],
      },
    };
  }

  render() {
    if (this.props.data) {
      return (
        <div id="chart">
          <b>Monthly Sales</b>
          <ReactApexChart
            options={this.state.options}
            series={[this.props.data]}
            type="radialBar"
            height={350} />
        </div>
      );
    }
    return null
  }
}

export default MonthlyEarningChart;