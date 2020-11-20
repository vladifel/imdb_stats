import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { chartDataItemsReducer, IChartDataItemsState } from "./reducers/chartDataItems";

export interface ReduxState {
    chartDataItemsReducer: IChartDataItemsState,
}

export default createStore(combineReducers<ReduxState>({
    chartDataItemsReducer,

}), composeWithDevTools(applyMiddleware(thunk)))