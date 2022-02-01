import React, { FC } from "react";
import classNames from "classnames";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Divider, Grid } from "@material-ui/core";

import { IChartDataItem } from "../../store/actions/chartDataItems";
import { IDrawerActions } from "./InfoAreaContainer";
import CloseIconButton from "./CloseIconButton";
import InfoData from "./InfoData";
import InfoHead from "./InfoHead";
import { styles } from "./InfoArea.styles";

interface IInfoAreaProps {
  height: number;
  chartDataItems: IChartDataItem[];
  drawerActions: IDrawerActions;
}

type IInfoAreaCombinedProps = IInfoAreaProps & WithStyles<typeof styles>;

const InfoArea: FC<IInfoAreaCombinedProps> = ({
  height,
  chartDataItems,
  drawerActions,
  classes,
}: IInfoAreaCombinedProps) => {
  const dataToShow = chartDataItems.filter(item => item.id === drawerActions.itemSelected);
  return (
    <Grid>
      <CloseIconButton chartDataItems={chartDataItems} drawerActions={drawerActions} />
      {dataToShow.length > 0 && drawerActions.drawerOpen && (
        <Grid container style={{ height: height - 100 }} className={classNames(classes.infoArea)}>
          <InfoHead chartData={dataToShow[0].data} />
          <Divider variant="inset" className={classes.divider} />
          <Grid
            id="info_scroll_area"
            item
            style={{ height: height - 250 }}
            className={classes.infoAreaBottom}
          >
            <InfoData chartData={dataToShow[0].data} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default withStyles(styles)(InfoArea);
