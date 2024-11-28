import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import treemap from "highcharts/modules/treemap";

treemap(Highcharts);

interface TreemapData {
  id: string;
  name: string;
  value: number;
  children?: TreemapData[];
  parent?: string;
  __typename?: string;
}

interface Props {
  data: TreemapData[];
  title: string;
  valueFormat: "number" | "percentage";
}

const Treemap: React.FC<Props> = ({ data, title, valueFormat }) => {
  // 자산군별 색상
  const assetClassColors = {
    US_EQUITY: "#7CB5EC", // 파란색
    KR_EQUITY: "#90ED7D", // 초록색
    BOND: "#F7A35C", // 주황색
    CASH: "#8085E9", // 보라색
    COMMODITY: "#F15C80", // 분홍색
  };

  // 계좌별 색상
  const accountColors = {
    KW: "#2f7ed8", // 진한 파란색
    MA: "#0d233a", // 네이비
    ISA: "#8bbc21", // 진한 초록색
    KRX: "#910000", // 진한 빨간색
    MA_CMA: "#1aadce", // 하늘색
    CASH: "#492970", // 진한 보라색
    IRA: "#f28f43", // 진한 주황색
  };

  const flattenedData = data.flatMap((item) => {
    const parentNode = {
      id: item.id,
      name: item.name,
      value: valueFormat === "number" ? item.value / 1000000 : item.value,
      color:
        assetClassColors[item.id as keyof typeof assetClassColors] ||
        accountColors[item.id as keyof typeof accountColors], // 부모 노드에 색상 지정
    };

    const childNodes =
      item.children?.map((child) => ({
        id: child.id,
        name: child.name,
        value: valueFormat === "number" ? child.value / 1000000 : child.value,
        parent: item.id,
      })) || [];

    return [parentNode, ...childNodes];
  });

  const options = {
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        levels: [
          {
            level: 1,
            layoutAlgorithm: "squarified",
            dataLabels: {
              enabled: true,
              align: "left",
              verticalAlign: "top",
              style: { fontSize: "15px", fontWeight: "bold" },
            },
            borderWidth: 3,
            borderColor: "#FFFFFF",
          },
          {
            level: 2,
            layoutAlgorithm: "squarified",
            dataLabels: {
              enabled: true,
              style: { fontSize: "12px" },
            },
            borderWidth: 1,
            borderColor: "#FFFFFF",
          },
        ],
        data: flattenedData,
      },
    ],
    title: {
      text: title,
      style: {
        fontSize: "16px",
      },
    },
    tooltip: {
      pointFormatter: function () {
        const value =
          valueFormat === "number"
            ? "₩" + Highcharts.numberFormat(this.value * 1000000, 0)
            : this.value + "%";
        return `<b>${this.name}</b>: ${value}`;
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Treemap;
