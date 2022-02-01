import { ChartDataItemsActionTypes } from "../types/chartDataItems";
import { IChartData } from "../../features/types";

export interface IChartDataItem {
  id: string;
  color: string;
  isLoading: boolean;
  isShown: boolean;
  isInfoOpen: boolean;
  data: IChartData;
}

// Action Definition
export interface IChartDataShown {
  type: typeof ChartDataItemsActionTypes.CHART_DATA_SHOW_STATE_CHANGE;
  id: string;
  isShown: boolean;
}

export interface IChartDataAdded {
  type: typeof ChartDataItemsActionTypes.CHART_DATA_ADDED;
  chartDataItem: IChartDataItem;
}

export interface IChartDataUpdated {
  type: typeof ChartDataItemsActionTypes.CHART_DATA_UPDATED;
  id: string;
  chartDataItem: IChartDataItem;
}

export interface IChartDataRemoved {
  type: typeof ChartDataItemsActionTypes.CHART_DATA_REMOVED;
  id: string;
}

export interface IChartDataInfoShown {
  type: typeof ChartDataItemsActionTypes.CHART_DATA_INFO_SHOWN;
  id: string;
}

export interface IChartDataInfoHidden {
  type: typeof ChartDataItemsActionTypes.CHART_DATA_INFO_HIDDEN;
}

export interface IChartDataColorChanged {
  type: typeof ChartDataItemsActionTypes.CHART_DATA_COLOR_CHANGED;
  id: string;
  color: string;
}

// Action Types
export type ChartDataItemsActions =
  | IChartDataShown
  | IChartDataAdded
  | IChartDataUpdated
  | IChartDataRemoved
  | IChartDataInfoShown
  | IChartDataInfoHidden
  | IChartDataColorChanged;

// Action Creators
export const chartDataShown = (id: string, isShown: boolean): IChartDataShown => {
  return {
    type: ChartDataItemsActionTypes.CHART_DATA_SHOW_STATE_CHANGE,
    id,
    isShown,
  };
};

export const chartDataAdded = (chartDataItem: IChartDataItem): IChartDataAdded => {
  return {
    type: ChartDataItemsActionTypes.CHART_DATA_ADDED,
    chartDataItem,
  };
};

export const chartDataUpdated = (id: string, chartDataItem: IChartDataItem): IChartDataUpdated => {
  return {
    type: ChartDataItemsActionTypes.CHART_DATA_UPDATED,
    id,
    chartDataItem,
  };
};

export const chartDataRemoved = (id: string): IChartDataRemoved => {
  return {
    type: ChartDataItemsActionTypes.CHART_DATA_REMOVED,
    id,
  };
};

export const chartDataInfoShown = (id: string): IChartDataInfoShown => {
  return {
    type: ChartDataItemsActionTypes.CHART_DATA_INFO_SHOWN,
    id,
  };
};

export const chartDataInfoHidden = (): IChartDataInfoHidden => {
  return {
    type: ChartDataItemsActionTypes.CHART_DATA_INFO_HIDDEN,
  };
};

export const chartDataColorChanged = (id: string, color: string): IChartDataColorChanged => {
  return {
    type: ChartDataItemsActionTypes.CHART_DATA_COLOR_CHANGED,
    id,
    color,
  };
};
