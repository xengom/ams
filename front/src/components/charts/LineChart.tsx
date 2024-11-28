import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface Series {
  name: string;
  key: string;
  type: string;
  yAxis?: number;
}

interface YAxis {
  title: string;
  format: "number" | "percentage";
}

interface Props {
  data: any[];
  series: Series[];
  yAxis: YAxis[];
}

const LineChart: React.FC<Props> = ({ data, series, yAxis }) => {
  const sortedData = [...data].reverse();

  const options = {
    chart: {
      type: "line",
      height: "100%",
    },
    title: { text: "" },
    xAxis: {
      categories: sortedData.map((item) => {
        try {
          const date = new Date(item.date);
          if (isNaN(date.getTime())) {
            console.error("Invalid date:", item.date);
            return "";
          }
          return `${date.getFullYear().toString().slice(-2)}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
        } catch (e) {
          console.error("Date parsing error:", e);
          return "";
        }
      }),
      labels: {
        rotation: -45,
        style: {
          fontSize: "11px",
        },
      },
    },
    yAxis: series.some((s) => s.yAxis === 1)
      ? [
          {
            title: { text: "" },
            labels: {
              formatter: function () {
                return Highcharts.numberFormat(this.value / 1000000, 0);
              },
            },
          },
          {
            title: { text: "" },
            labels: {
              formatter: function () {
                return this.value + "%";
              },
            },
            opposite: true,
          },
        ]
      : [
          {
            title: { text: "" },
            labels: {
              formatter: function () {
                return Highcharts.numberFormat(this.value / 1000000, 0);
              },
            },
          },
        ],
    series: series.map((s) => ({
      name: s.name,
      data: sortedData.map((item) => item[s.key]),
      type: s.type,
      yAxis: s.yAxis || 0,
    })),
    tooltip: {
      shared: true,
      formatter: function () {
        return this.points
          .map((point) => {
            const series = point.series;
            const value = point.y;
            const yAxis = series.yAxis;
            const format = yAxis.options.labels.formatter.call({ value });
            return `${series.name}: ${format}`;
          })
          .join("<br/>");
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;
