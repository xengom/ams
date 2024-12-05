import React from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";

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

const Treemap: React.FC<Props> = ({ data, valueFormat }) => {
  const transformData = (items: TreemapData[]) => {
    return {
      id: "root",
      children: items.map((item) => ({
        id: item.id,
        name: item.name,
        children: item.children?.map((child) => ({
          id: child.id,
          name: `${child.name}`,
          value: valueFormat === "number" ? child.value / 1000000 : child.value,
        })),
      })),
    };
  };

  return (
    <div style={{ height: "400px" }}>
      <ResponsiveTreeMap
        data={transformData(data)}
        identity="name"
        value="value"
        valueFormat={valueFormat === "number" ? ".0f" : ".1%"}
        label={(datum: any) => datum.data.name}
        labelSkipSize={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.2]],
        }}
        parentLabelPosition="top"
        parentLabelTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.1]],
        }}
        orientLabel={false}
      />
    </div>
  );
};

export default Treemap;
