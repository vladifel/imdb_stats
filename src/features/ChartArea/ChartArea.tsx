import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Snackbar, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { SiImdb } from "react-icons/si";

import {
  chartDataAdded,
  chartDataUpdated,
  IChartDataItem,
} from "../../store/actions/chartDataItems";
import { ReduxState } from "../../store";
import { IPersonData } from "../types";
import EntriesList from "../EntriesList/EntriesList";
import { buildDefaultData, buildRatings, fetchData } from "./helpers";
import ChartComponent from "./ChartComponent";
import { styles } from "./ChartArea.styles";
import "./ChartArea.css";

export interface IChartAreaProps {
  height: number;
  width: number;
  selectedName: IPersonData | undefined;
}

export type IChartAreaCombinedProps = IChartAreaProps & WithStyles<typeof styles>;

const ChartArea: React.FunctionComponent<IChartAreaCombinedProps> = ({
  height,
  width,
  selectedName,
  classes,
}: IChartAreaCombinedProps) => {
  const dispatch = useDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sameSelected, setSameSelected] = useState(false);
  const [dataToDisplay, setDataToDisplay] = useState<IChartDataItem[]>([]);

  const chartDataItems: IChartDataItem[] = useSelector(
    (state: ReduxState) => state.chartDataItemsReducer.chartDataItems,
    isEqual
  );

  useEffect(() => {
    const fetch = async () => {
      if (!selectedName) {
        return;
      }

      if (dataToDisplay.findIndex(item => item.id === selectedName.ImdbId) === -1) {
        setIsLoading(true);
        const dataToFetch = await fetchData(selectedName);

        if (dataToFetch) {
          if (dataToFetch.films.length >= 0) {
            let dataToDispatch = buildDefaultData(dataToFetch);

            let data = [...dataToDisplay];
            data.push(dataToDispatch);

            setIsLoading(false);
            setDataToDisplay(data);
            dispatch(chartDataAdded(dataToDispatch));

            let films = [...dataToDispatch.data.filmsData];

            const scores: number[] = [];

            for (let i = 0; i < films.length; i++) {
              const film = await buildRatings(films[i]);

              if (film && film.rating !== 0) {
                const dataToUpdate = [...data];
                dataToDispatch.data.films.push(film);
                dataToUpdate[dataToUpdate.length - 1] = dataToDispatch;
                setDataToDisplay(dataToUpdate);
                film.rating !== null && scores.push(film.rating);
              }
            }

            const avr = scores.reduce((a, b) => a + b) / scores.length;

            dataToDispatch.data.averageScore = avr || 0;
            dataToDispatch.isLoading = false;

            dispatch(chartDataUpdated(dataToDispatch.id, dataToDispatch));
          } else {
            setSnackbarOpen(true);
          }
        }
      } else {
        setSnackbarOpen(true);
        setSameSelected(true);
      }
    };
    fetch();
  }, [dispatch, selectedName]);

  useEffect(() => {
    chartDataItems.length !== dataToDisplay.length && setDataToDisplay(chartDataItems);
  }, [chartDataItems, dataToDisplay.length]);

  return (
    <Fragment>
      <Grid container className={classes.chartArea}>
        <Grid item>
          <EntriesList height={height} />
        </Grid>
        <Grid item>
          <ChartComponent height={height} width={width} />
        </Grid>
        {isLoading && (
          <Grid container className={classes.loading}>
            <SiImdb id="loading_icon" className={classes.loadingIcon} />
            <Typography className={classes.loadingText}>Loading...</Typography>
          </Grid>
        )}
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {sameSelected && selectedName
            ? `Film data for ${selectedName.Name} already displayed, please select another name`
            : "Insufficient voters or rating data, please make another selection"}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default withStyles(styles)(ChartArea);
