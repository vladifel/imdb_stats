import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { ReduxState } from "../../store";
import {
  chartDataInfoHidden,
  chartDataInfoShown,
  IChartDataItem,
} from "../../store/actions/chartDataItems";
import { infoAreaOpen } from "../../store/actions/openInfo";
import InfoArea from "./InfoArea";
import { styles } from "./InfoArea.styles";

export interface IDrawerActions {
  drawerOpen: boolean;
  itemSelected: string;

  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  handleItemSelected: (e: any) => void;
}

interface IInfoAreaProps {
  height: number;
}

type IInfoAreaCombinedProps = IInfoAreaProps & WithStyles<typeof styles>;

const InfoAreaContainer: React.FunctionComponent<IInfoAreaCombinedProps> = ({
  height,
  classes,
}: IInfoAreaCombinedProps) => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [itemSelected, setItemSelected] = useState<string>("");

  const chartDataItems: IChartDataItem[] = useSelector(
    (state: ReduxState) => state.chartDataItemsReducer.chartDataItems
  );
  const isInfoAreaOpen: boolean = useSelector(
    (state: ReduxState) => state.openInfoReducer.isInfoOpen
  );

  const handleDrawerOpen = () => {
    chartDataItems.length && setDrawerOpen(true);
    dispatch(infoAreaOpen(true));
  };

  const handleDrawerClosed = () => {
    dispatch(chartDataInfoHidden());
    dispatch(infoAreaOpen(false));
    setDrawerOpen(false);
  };

  const handleItemSelected = (event: any) => {
    setItemSelected(event.target.value);
    dispatch(chartDataInfoShown(event.target.value));
  };

  const drawerActions: IDrawerActions = {
    drawerOpen: drawerOpen,
    handleDrawerOpen: handleDrawerOpen,
    handleDrawerClose: handleDrawerClosed,
    itemSelected: itemSelected,
    handleItemSelected: handleItemSelected,
  };

  useEffect(() => {
    isInfoAreaOpen !== drawerOpen && setDrawerOpen(isInfoAreaOpen);
  }, [drawerOpen, isInfoAreaOpen]);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const changedIndex = chartDataItems.findIndex(item => item.isInfoOpen);
    if (changedIndex === -1) {
      setItemSelected(chartDataItems[0].id);
      dispatch(chartDataInfoShown(chartDataItems[0].id));
    } else {
      setItemSelected(chartDataItems[changedIndex].id);
    }
  }, [chartDataItems, dispatch, drawerOpen]);

  return (
    <Grid
      container
      className={classNames(
        classes.root,
        drawerActions.drawerOpen ? classes.rootOpen : classes.rootClosed
      )}
    >
      <InfoArea height={height} chartDataItems={chartDataItems} drawerActions={drawerActions} />
    </Grid>
  );
};

export default withStyles(styles)(InfoAreaContainer);
