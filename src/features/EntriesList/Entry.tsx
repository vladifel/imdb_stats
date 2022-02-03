import React, { Fragment } from "react";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  LinearProgress,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Tooltip,
} from "@material-ui/core";

import { ReduxState } from "../../store";
import {
  chartDataColorChanged,
  chartDataInfoShown,
  chartDataRemoved,
  chartDataShown,
} from "../../store/actions/chartDataItems";
import { infoAreaOpen } from "../../store/actions/openInfo";
import { IChartData } from "../types";
import CheckboxComponent from "../Shared/CheckboxComponent";
import LensIconComponent from "../Shared/LensIconComponent";
import InfoIconComponent from "../Shared/InfoIconComponent";
import EraseIconComponent from "../Shared/EraseIconComponent";
import { styles } from "./EntriesList.styles";

interface IEntryProps {
  key: string;
  id: string;
  color: string;
  data: IChartData;
  isLoading: boolean;
  isShown: boolean;
}

type IEntryCombinedProps = IEntryProps & WithStyles<typeof styles>;

const Entry: React.FunctionComponent<IEntryCombinedProps> = ({
  id,
  color,
  data,
  isLoading,
  isShown,
  classes,
}: IEntryCombinedProps) => {
  const dispatch = useDispatch();

  const isInfoAreaOpen = useSelector((state: ReduxState) => state.openInfoReducer.isInfoOpen);
  const handleCheckboxCheck = () => {
    dispatch(chartDataShown(id, !isShown));
  };

  const handleInfoClick = () => {
    dispatch(chartDataInfoShown(id));
    !isInfoAreaOpen && dispatch(infoAreaOpen(true));
  };

  const handleColorChange = (color: string) => {
    id && dispatch(chartDataColorChanged(id, color));
  };

  const handleEraseClick = () => {
    dispatch(chartDataRemoved(id));
  };

  return (
    <ListItem key={id} className={classes.itemContainer}>
      <CheckboxComponent
        title="Hide from chart"
        isChecked={isShown}
        onChange={handleCheckboxCheck}
      />
      <LensIconComponent name={id} color={color} onColorChange={handleColorChange} />
      <ListItemText
        primary={
          <Tooltip title={data.name} enterDelay={500} enterNextDelay={500}>
            <Fragment>
              {isLoading ? (
                <LinearProgress color="secondary" style={{ width: "7rem" }} />
              ) : undefined}
              <Typography className={classes.text}>{data.name}</Typography>
            </Fragment>
          </Tooltip>
        }
      />
      <ListItemSecondaryAction>
        <Grid container className={classes.rightContainer}>
          <Grid item>
            <InfoIconComponent title="Open artist info" onClick={handleInfoClick} />
          </Grid>
          <Grid item>
            <EraseIconComponent title="Remove from chart" onClick={handleEraseClick} />
          </Grid>
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default withStyles(styles)(Entry);
