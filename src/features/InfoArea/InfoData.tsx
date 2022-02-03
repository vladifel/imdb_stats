import React, { FC } from "react";
import classNames from "classnames";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Link, List, ListItem, ListItemText } from "@material-ui/core";

import { IChartData } from "../types";
import { styles } from "./InfoArea.styles";

interface IInfoDataProps {
  chartData: IChartData;
}

type IInfoDataCombinedProps = IInfoDataProps & WithStyles<typeof styles>;

const InfoData: FC<IInfoDataCombinedProps> = ({ chartData, classes }: IInfoDataCombinedProps) => {
  const { films } = chartData;
  return (
    <List>
      {films.map(({ id, year, title, rating, imdbVotes }) => (
        <ListItem key={id}>
          <ListItemText
            primary={
              <Link
                className={classNames(classes.linkColor, classes.listText)}
                href={`https://www.imdb.com/title/${id}/`}
                target="_blank"
              >
                {`${year}: ${title}`}
              </Link>
            }
            secondary={`Rating: ${rating} (${imdbVotes?.toLocaleString()} votes)`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default withStyles(styles)(InfoData);
