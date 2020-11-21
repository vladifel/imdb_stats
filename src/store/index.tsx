import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { chartDataItemsReducer, IChartDataItemsState } from "./reducers/chartDataItems";
import { openInfoReducer, IOpenInfoState } from "./reducers/openInfo";

export interface ReduxState {
    chartDataItemsReducer: IChartDataItemsState,
    openInfoReducer: IOpenInfoState
}

export default createStore(combineReducers<ReduxState>({
    chartDataItemsReducer,
    openInfoReducer
}), composeWithDevTools(applyMiddleware(thunk)))