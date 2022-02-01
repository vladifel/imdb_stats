import { OpenInfoActionTypes } from "../types/openInfo";

// Action Definition
export interface IInfoAreaOpen {
  type: typeof OpenInfoActionTypes.INFO_OPEN_STATE_CHANGE;
  isOpen: boolean;
}

// Action Types
export type OpenInfoActions = IInfoAreaOpen;

// Action Creators
export const infoAreaOpen = (isOpen: boolean): IInfoAreaOpen => {
  return {
    type: OpenInfoActionTypes.INFO_OPEN_STATE_CHANGE,
    isOpen,
  };
};
