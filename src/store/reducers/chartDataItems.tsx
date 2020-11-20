import { ChartDataItemsActionTypes } from '../types/chartDataItems';
import { IChartDataItem, ChartDataItemsActions } from '../actions/chartDataItems';

export interface IChartDataItemsState {
    chartDataItems: IChartDataItem[],
}

export interface IChartDataItemsReducerState {
    chartDataItemsReducer: IChartDataItemsState
}

const initialState: IChartDataItemsState = {
    chartDataItems: [],
}

export const chartDataItemsReducer = (state = initialState, action: ChartDataItemsActions): IChartDataItemsState => {
    switch (action.type) {
        case ChartDataItemsActionTypes.CHART_DATA_SHOW_STATE_CHANGE: {
            const newChartDataItems = [...state.chartDataItems];
            newChartDataItems.map(item => item.id === action.id && (item.isShown = action.isShown));
            return {
                ...state,
                chartDataItems: newChartDataItems
            }
        }
        case ChartDataItemsActionTypes.CHART_DATA_ADDED: {
            return {
                ...state,
                chartDataItems: [...state.chartDataItems, action.chartDataItem]
            }
        }
        case ChartDataItemsActionTypes.CHART_DATA_REMOVED: {
            return {
                ...state,
                chartDataItems: state.chartDataItems.filter(item => item.id !== action.id)
            }
        }
        case ChartDataItemsActionTypes.CHART_DATA_SELECTED: {
            const newChartDataItems = [...state.chartDataItems];
            newChartDataItems.map(item => item.id === action.id ? item.isSelected = true : item.isSelected = false);
            return {
                ...state,
                chartDataItems: newChartDataItems
            }
        }
        case ChartDataItemsActionTypes.CHART_DATA_INFO_SHOWN: {
            const newChartDataItems = [...state.chartDataItems];
            newChartDataItems.map(item => item.id === action.id ? item.isInfoOpen = true : item.isInfoOpen = false);
            return {
                ...state,
                chartDataItems: newChartDataItems
            }
        }
        case ChartDataItemsActionTypes.CHART_DATA_INFO_HIDDEN: {
            const newChartDataItems = [...state.chartDataItems];
            newChartDataItems.map(item => item.isInfoOpen = false);
            return {
                ...state,
                chartDataItems: newChartDataItems
            }
        }
        case ChartDataItemsActionTypes.CHART_DATA_COLOR_CHANGED: {
            const newChartDataItems = [...state.chartDataItems];
            newChartDataItems.map(item => item.id === action.id && (item.color = action.color));
            return {
                ...state,
                chartDataItems: newChartDataItems
            }
        }
        default: {
            return state
        }
    }
}