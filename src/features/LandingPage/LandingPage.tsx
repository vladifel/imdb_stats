import React, { FC, useCallback, useMemo, useState } from "react";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

import directorsData from "assets/directors1000.json";
import { useWindowSize } from "utils/hooks/useWindowSize";
import ListBox from "utils/ListBox/ListBox";
import ChartArea from "features/ChartArea/ChartArea";
import InfoAreaContainer from "features/InfoArea/InfoAreaContainer";

import { IPersonData } from "../types";
import { mapFromArray } from "./helpers";
import { styles } from "./LandingPage.styles";

type ILandingPageCombinedProps = WithStyles<typeof styles>;

const LandingPage: FC<ILandingPageCombinedProps> = ({ classes }: ILandingPageCombinedProps) => {
  const [selectedName, setSelectedName] = useState<IPersonData | undefined>(undefined);
  const [nameToDisplay, setNameToDisplay] = useState<string | undefined>(undefined);

  const { width, height } = useWindowSize();

  const data = useMemo(() => mapFromArray(Object.values(directorsData)), []);

  const handleAddAnother = useCallback(() => {
    if (data && nameToDisplay) {
      setSelectedName(data.get(nameToDisplay.toLowerCase()));
      setNameToDisplay(undefined);
    }
  }, [data, nameToDisplay]);

  const handleSearch = useCallback(
    (value: string) => {
      setSelectedName(undefined);
      data && setNameToDisplay(value);
    },
    [data]
  );

  return (
    <Grid container className={classes.page}>
      <Grid container className={classes.root}>
        <Grid className={classes.rootLeft}>
          <Grid item className={classes.nameSelectNew}>
            <ListBox dataMap={data} value={nameToDisplay} handleLineClicked={handleSearch} />
          </Grid>
          <Grid item className={classes.iconTwoMargins}>
            <Tooltip title="Add to chart" placement="right" enterDelay={500} enterNextDelay={500}>
              <IconButton onClick={handleAddAnother}>
                <GroupAddIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{ width: "100%", height: "100%" }}>
        <ChartArea height={height} width={width} selectedName={selectedName} />
        <Grid className={classes.rootRight}>
          <InfoAreaContainer height={height} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(LandingPage);
