import React, { FC } from "react";
import classNames from "classnames";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Link, Typography } from "@material-ui/core";

import { IChartData } from "../types";
import { styles } from "./InfoArea.styles";

interface IInfoHeadProps {
  chartData: IChartData;
}

type IInfoHeadCombinedProps = IInfoHeadProps & WithStyles<typeof styles>;

const InfoHead: FC<IInfoHeadCombinedProps> = ({ chartData, classes }: IInfoHeadCombinedProps) => {
  const { id, name, averageScore, films } = chartData;
  const chartName = name.split(" ");
  const firstName = chartName[0];
  chartName.shift();

  return (
    <Grid item className={classes.infoAreaTop}>
      <Grid container className={classes.infoAreaNameRow}>
        <Typography noWrap>
          <Link
            className={classNames(classes.linkColor, classes.infoAreaNameRowText)}
            href={`https://www.imdb.com/name/${id}/`}
            target="_blank"
          >
            {firstName}
          </Link>
        </Typography>
        <Typography noWrap>
          <Link
            className={classNames(classes.linkColor, classes.infoAreaNameRowText)}
            href={`https://www.imdb.com/name/${id}/`}
            target="_blank"
          >
            {chartName && chartName.join(" ")}
          </Link>
        </Typography>
      </Grid>
      <Grid container className={classes.infoAreaTopRows}>
        <Typography className={classes.highlightedText}>No. of movies:</Typography>
        <Typography>{` ${films.length}`}</Typography>
      </Grid>
      <Grid container className={classes.infoAreaTopRows}>
        <Typography className={classes.highlightedText}>Average Rating:</Typography>
        <Typography>{` ${Math.floor(averageScore * 100) / 100}`}</Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(InfoHead);
