/* eslint-disable @typescript-eslint/ban-types */
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux';
import { ChartDataItemsActionTypes } from '../types/chartDataItems';
import { IChartData } from '../../features/LandingPage';

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
    type: typeof ChartDataItemsActionTypes.CHART_DATA_SHOW_STATE_CHANGE
    id: string,
    isShown: boolean
}

export interface IChartDataAdded {
    type: typeof ChartDataItemsActionTypes.CHART_DATA_ADDED
    chartDataItem: IChartDataItem
}

export interface IChartDataUpdated {
    type: typeof ChartDataItemsActionTypes.CHART_DATA_UPDATED
    id: string,
    chartDataItem: IChartDataItem
}

export interface IChartDataRemoved {
    type: typeof ChartDataItemsActionTypes.CHART_DATA_REMOVED
    id: string
}

export interface IChartDataInfoShown {
    type: typeof ChartDataItemsActionTypes.CHART_DATA_INFO_SHOWN
    id: string
}

export interface IChartDataInfoHidden {
    type: typeof ChartDataItemsActionTypes.CHART_DATA_INFO_HIDDEN
}

export interface IChartDataColorChanged {
    type: typeof ChartDataItemsActionTypes.CHART_DATA_COLOR_CHANGED
    id: string,
    color: string
}

// Action Types
export type ChartDataItemsActions =
    IChartDataShown
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
        isShown
    }
}

export const chartDataAdded = (chartDataItem: IChartDataItem): IChartDataAdded => {
    return {
        type: ChartDataItemsActionTypes.CHART_DATA_ADDED,
        chartDataItem
    }
}

export const chartDataUpdated = (id: string, chartDataItem: IChartDataItem): IChartDataUpdated => {
    return {
        type: ChartDataItemsActionTypes.CHART_DATA_UPDATED,
        id,
        chartDataItem
    }
}

export const chartDataRemoved = (id: string): IChartDataRemoved => {
    return {
        type: ChartDataItemsActionTypes.CHART_DATA_REMOVED,
        id
    }
}

export const chartDataInfoShown = (id: string): IChartDataInfoShown => {
    return {
        type: ChartDataItemsActionTypes.CHART_DATA_INFO_SHOWN,
        id
    }
}

export const chartDataInfoHidden = (): IChartDataInfoHidden => {
    return {
        type: ChartDataItemsActionTypes.CHART_DATA_INFO_HIDDEN,
    }
}

export const chartDataColorChanged = (id: string, color: string): IChartDataColorChanged => {
    return {
        type: ChartDataItemsActionTypes.CHART_DATA_COLOR_CHANGED,
        id,
        color
    }
}
//Thunks
export const chartDataShownAsync = (id: string, isShown: boolean): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(chartDataShown(id, isShown))
            resolve()
        })
    }
}

export const chartDataAddedAsync = (chartDataItem: IChartDataItem): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(chartDataAdded(chartDataItem))
            resolve()
        })
    }
}

export const chartDataUpdatedAsync = (id: string, chartDataItem: IChartDataItem): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(chartDataUpdated(id, chartDataItem))
            resolve()
        })
    }
}

export const chartDataRemovedAsync = (id: string): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(chartDataRemoved(id))
            resolve()
        })
    }
}

export const chartDataInfoHiddenAsync = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(chartDataInfoHidden())
            resolve()
        })
    }
}

export const chartDataInfoShownAsync = (id: string): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(chartDataInfoShown(id))
            resolve()
        })
    }
}

export const chartDataColorChangedAsync = (id: string, color: string): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(chartDataColorChanged(id, color))
            resolve()
        })
    }
}