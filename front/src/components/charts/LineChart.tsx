import React from "react";
import { ResponsiveLine } from "@nivo/line";

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

const LineChart: React.FC<Props> = ({ data, series }) => {
  const sortedData = [...data].reverse();

  const chartData = series.map((s) => ({
    id: s.name,
    data: sortedData.map((item) => ({
      x: new Date(item.date).toLocaleDateString(),
      y: s.yAxis === 1 ? item[s.key] : item[s.key] / 1000000,
    })),
  }));

  const filterTicks = (value: string) => {
    const date = new Date(value);
    const isFirstDayOfMonth = date.getDate() === 1;
    return isFirstDayOfMonth;
  };

  return (
    <div style={{ height: "400px" }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
        }}
        curve="monotoneX"
        enablePoints={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          format: (value) => {
            const date = new Date(value);
            return date.toLocaleDateString("ko-KR", {
              year: "2-digit",
              month: "numeric",
            });
          },
          tickValues: chartData[0].data
            .filter((d) => filterTicks(d.x))
            .map((d) => d.x),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableGridX={false}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
