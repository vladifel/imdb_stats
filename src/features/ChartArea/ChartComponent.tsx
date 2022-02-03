import React, { FC, Fragment } from "react";
import {
  Scatter,
  LabelList,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { IChartDataItem } from "../../store/actions/chartDataItems";
import { dynamicSortMultiple } from "../../utils/Sorting/Sorting";
import TooltipContent from "./TooltipContent";
import { useSelector } from "react-redux";
import { ReduxState } from "../../store";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) {
    return null;
  }
  const { title, year, rating, imdbVotes } = payload[0].payload;
  return <TooltipContent title={title} year={year} rating={rating} imdbVotes={imdbVotes} />;
};

interface IChartComponentProps {
  height: number;
  width: number;
}

const ChartComponent: FC<IChartComponentProps> = ({ height, width }: IChartComponentProps) => {
  const chartDataItems: IChartDataItem[] = useSelector(
    (state: ReduxState) => state.chartDataItemsReducer.chartDataItems
  );

  const charts = chartDataItems
    .filter(({ isShown }) => isShown)
    .map(({ id, color, data: { name, films } }) => (
      <Scatter key={id} name={name} data={films.sort(dynamicSortMultiple("year"))} fill={color}>
        <LabelList
          dataKey="rating"
          /*
          // @ts-ignore */
          style={{
            fontFamily: "Impact",
            fontSize: "0.8rem",
            pointerEvents: "none",
          }}
        />
      </Scatter>
    ));

  return (
    <Fragment>
      {charts.length > 0 && (
        <div style={{ width: width - 221, height: height - 100 }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 50, right: 30, left: 10, bottom: 5 }}>
              <XAxis
                label={{
                  value: "Years",
                  offset: -10,
                  position: "insideBottomRight",
                  fontWeight: 500,
                  fontFamily: "Impact",
                }}
                tick={{
                  fontFamily: "Impact",
                  fontSize: "1.2rem",
                }}
                dataKey="year"
                tickCount={8}
                type="number"
                padding={{ left: 30, right: 30 }}
                stroke="black"
                /*
                            // @ts-ignore */
                strokeWidth={6}
                domain={["dataMin", "dataMax"]}
              />
              <YAxis
                label={{
                  value: "Imdb Rating",
                  angle: -90,
                  offset: 5,
                  position: "insideLeft",
                  fontWeight: 500,
                  fontFamily: "Impact",
                }}
                dataKey="rating"
                type="number"
                tickCount={8}
                tick={{
                  fontFamily: "Impact",
                  fontSize: "1.2rem",
                }}
                /*
                            // @ts-ignore */
                strokeWidth={6}
                stroke="black"
                padding={{ top: 30, bottom: 30 }}
                domain={["dataMin", "dataMax"]}
              />
              <ZAxis
                /*
                            // @ts-ignore */
                font="Impact"
                scale="log"
                type="number"
                dataKey="rating"
                range={[700, 700]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {charts}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </Fragment>
  );
};

export default ChartComponent;
