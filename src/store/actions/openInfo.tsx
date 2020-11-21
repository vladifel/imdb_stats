/* eslint-disable @typescript-eslint/ban-types */
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux';
import { OpenInfoActionTypes } from '../types/openInfo';

// Action Definition
export interface IInfoAreaOpen {
    type: typeof OpenInfoActionTypes.INFO_OPEN_STATE_CHANGE
    isOpen: boolean
}

// Action Types
export type OpenInfoActions = IInfoAreaOpen;

// Action Creators
export const infoAreaOpen = (isOpen: boolean): IInfoAreaOpen => {
    return {
        type: OpenInfoActionTypes.INFO_OPEN_STATE_CHANGE,
        isOpen
    }
}

//Thunks
export const infoAreaOpenAsync = (isOpen: boolean): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch(infoAreaOpen(isOpen))
            resolve()
        })
    }
}