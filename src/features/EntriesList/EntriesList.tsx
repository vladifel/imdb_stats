import React from "react";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Grid, List } from "@material-ui/core";

import { ReduxState } from "store";
import { IChartDataItem } from "store/actions/chartDataItems";

import Entry from "./Entry";
import { styles } from "./EntriesList.styles";

interface IEntriesListProps {
  height: number;
}

type IEntriesListCombinedProps = IEntriesListProps & WithStyles<typeof styles>;

const EntriesList: React.FunctionComponent<IEntriesListCombinedProps> = ({
  height,
  classes,
}: IEntriesListCombinedProps) => {
  const chartDataItems: IChartDataItem[] = useSelector(
    (state: ReduxState) => state.chartDataItemsReducer.chartDataItems
  );

  return (
    <Grid id="info_scroll_area" style={{ height: height - 100 }} container className={classes.page}>
      <List>
        {chartDataItems.map(({ id, color, data, isLoading, isShown }) => (
          <Entry
            key={id}
            id={id}
            color={color}
            data={data}
            isLoading={isLoading}
            isShown={isShown}
          />
        ))}
      </List>
    </Grid>
  );
};

export default withStyles(styles)(EntriesList);
