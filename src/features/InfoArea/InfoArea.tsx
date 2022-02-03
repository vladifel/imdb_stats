import React, { FC } from "react";
import classNames from "classnames";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Divider, Grid } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import { IChartDataItem } from "../../store/actions/chartDataItems";
import { IDrawerActions } from "./InfoAreaContainer";
import CloseIconButton from "../Shared/CloseIconButton";
import InfoData from "./InfoData";
import InfoHead from "./InfoHead";
import ItemSelection from "./ItemSelection";
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
  const { drawerOpen, itemSelected, handleItemSelected, handleDrawerOpen, handleDrawerClose } =
    drawerActions;
  const dataToShow = chartDataItems.filter(item => item.id === drawerActions.itemSelected);

  const handleIconClick = () => {
    drawerOpen ? handleDrawerClose() : handleDrawerOpen();
  };

  return (
    <Grid>
      <Grid className={classes.topClosed}>
        <Grid
          className={classNames(
            classes.buttonContainer,
            drawerOpen ? classes.buttonContainerOpen : classes.buttonContainerClosed
          )}
        >
          <CloseIconButton
            title={`${drawerOpen ? "Close" : "Open"} artist info`}
            handleIconClick={handleIconClick}
          >
            <InfoIcon className={classNames(classes.icon, drawerOpen && classes.iconOpen)} />
          </CloseIconButton>
          {drawerOpen && (
            <ItemSelection
              chartDataItems={chartDataItems}
              itemSelected={itemSelected}
              handleItemSelected={handleItemSelected}
            />
          )}
        </Grid>
      </Grid>
      {dataToShow.length > 0 && drawerOpen && (
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
