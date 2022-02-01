import React, { FC } from "react";
import classNames from "classnames";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import { IChartDataItem } from "../../store/actions/chartDataItems";
import { IDrawerActions } from "./InfoAreaContainer";
import ItemSelection from "./ItemSelection";
import { styles } from "./InfoArea.styles";

interface ICloseIconButtonProps {
  chartDataItems: IChartDataItem[];
  drawerActions: IDrawerActions;
}

type ICloseIconButtonCombinedProps = ICloseIconButtonProps & WithStyles<typeof styles>;

const CloseIconButton: FC<ICloseIconButtonCombinedProps> = ({
  chartDataItems,
  drawerActions,
  classes,
}: ICloseIconButtonCombinedProps) => {
  const { drawerOpen, itemSelected, handleDrawerOpen, handleDrawerClose, handleItemSelected } =
    drawerActions;
  return (
    <Grid className={classes.topClosed}>
      <Grid
        className={classNames(
          classes.buttonContainer,
          drawerOpen ? classes.buttonContainerOpen : classes.buttonContainerClosed
        )}
      >
        <Tooltip
          title={`${drawerOpen ? "Close" : "Open"} artist info`}
          placement="left"
          enterDelay={500}
          enterNextDelay={500}
        >
          <IconButton onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}>
            <InfoIcon className={classNames(classes.icon, drawerOpen && classes.iconOpen)} />
          </IconButton>
        </Tooltip>
        {drawerOpen && (
          <ItemSelection
            chartDataItems={chartDataItems}
            itemSelected={itemSelected}
            handleItemSelected={handleItemSelected}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(CloseIconButton);
