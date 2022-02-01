import React, { Fragment } from "react";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  LinearProgress,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Tooltip,
} from "@material-ui/core";

import { IChartData } from "../types";
import CheckboxComponent from "./CheckboxComponent";
import LensIconComponent from "./LensIconComponent";
import InfoIconComponent from "./InfoIconComponent";
import EraseIconComponent from "./EraseIconComponent";
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
  return (
    <ListItem key={id} className={classes.itemContainer}>
      <CheckboxComponent id={id} isShown={isShown} />
      <LensIconComponent id={id} color={color} />
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
            <InfoIconComponent id={id} />
          </Grid>
          <Grid item>
            <EraseIconComponent id={id} />
          </Grid>
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default withStyles(styles)(Entry);
