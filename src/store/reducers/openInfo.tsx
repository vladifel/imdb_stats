import { OpenInfoActions } from '../actions/openInfo';
import { OpenInfoActionTypes } from '../types/openInfo';


export interface IOpenInfoState {
    isInfoOpen: boolean,
}

export interface IChartDataItemsReducerState {
    openInfoReducer: IOpenInfoState
}

const initialState: IOpenInfoState = {
    isInfoOpen: false,
}

export const openInfoReducer = (state = initialState, action: OpenInfoActions): IOpenInfoState => {
    switch (action.type) {
        case OpenInfoActionTypes.INFO_OPEN_STATE_CHANGE: {
            return {
                ...state,
                isInfoOpen: action.isOpen
            }
        }
        default: {
            return state
        }
    }
}