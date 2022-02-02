import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
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
import { buildDefaultData, buildRatings, fetchData, getDuplicateNameError } from "./helpers";
import ChartComponent from "./ChartComponent";
import { styles } from "./ChartArea.styles";
import "./ChartArea.css";

export interface IChartAreaProps {
  height: number;
  width: number;
  selectedName: IPersonData | undefined;
}

export type IChartAreaCombinedProps = IChartAreaProps & WithStyles<typeof styles>;

const areEqual = (prevProps: IChartAreaProps, nextProps: IChartAreaProps) =>
  prevProps.height === nextProps.height &&
  prevProps.width === nextProps.width &&
  prevProps.selectedName?.ImdbId === nextProps.selectedName?.ImdbId;

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
    chartDataItems.length !== dataToDisplay.length && setDataToDisplay(chartDataItems);
  }, [chartDataItems, dataToDisplay.length]);

  const fetchFilms = useCallback(
    async (name: IPersonData | undefined) => {
      if (!name) {
        return;
      }

      setIsLoading(true);
      const dataToFetch = await fetchData(name);

      if (!dataToFetch || !dataToFetch.films) {
        setSnackbarOpen(true);
        return;
      }

      let dataToDispatch = buildDefaultData(dataToFetch);

      let data = [...dataToDisplay];
      data.push(dataToDispatch);

      setIsLoading(false);
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
          film.rating != null && scores.push(film.rating);
        }
      }

      const avr = scores.reduce((a, b) => a + b) / scores.length;

      dataToDispatch.data.averageScore = avr || 0;
      dataToDispatch.isLoading = false;

      dispatch(chartDataUpdated(dataToDispatch.id, dataToDispatch));
    },
    [dataToDisplay, dispatch]
  );

  useEffect(() => {
    if (!selectedName) {
      return;
    }

    if (dataToDisplay.some(({ id }) => id === selectedName.ImdbId)) {
      setSameSelected(true);
    } else {
      setSameSelected(false);
      fetchFilms(selectedName);
    }
  }, [dataToDisplay, dispatch, fetchFilms, selectedName]);

  useEffect(() => {
    //only on startup
    fetchFilms({ ImdbId: "nm0634240", Name: "Christopher Nolan" });
  }, []);

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
      <Snackbar
        open={snackbarOpen || sameSelected}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {sameSelected && selectedName
            ? getDuplicateNameError(selectedName.Name)
            : "Insufficient voters or rating data, please make another selection"}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default memo(withStyles(styles)(ChartArea), areEqual);
