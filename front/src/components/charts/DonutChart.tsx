import React from "react";
import { ResponsivePie } from "@nivo/pie";

interface DonutData {
  id: string;
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: DonutData[];
  valueFormat?: (value: number) => string;
}

const DonutChart: React.FC<Props> = ({
  data,
  valueFormat = (value) => `₩${Number(value).toLocaleString()}`,
}) => {
  return (
    <div style={{ height: "300px" }}>
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
        innerRadius={0.6}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        valueFormat={valueFormat}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 70,
            translateY: 0,
            itemsSpacing: 5,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
};

export default DonutChart;
