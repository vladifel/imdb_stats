import React, { Fragment, useEffect, useState } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { styles } from './ChartArea.styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { SiImdb } from 'react-icons/si';
import axios from "axios";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip, Legend,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    LabelList,
    ZAxis
} from 'recharts';
import { dynamicSortMultiple } from '../helpers/Sorting';
import { IChartData, IPersonData } from './LandingPage';
import { chartDataAddedAsync, chartDataUpdatedAsync, IChartDataItem } from '../store/actions/chartDataItems';
import { useDispatch, useSelector } from 'react-redux';
import { getRandomRgbaColor } from '../helpers/ColorGenerator';
import { ReduxState } from '../store';
import EntriesList from './EntriesList';
import { getVotesString } from '../helpers/getVotesString';
import './ChartArea.css';

interface IChartAreaProps {
    height: number;
    width: number;
    selectedName: IPersonData;
}

type IChartAreaCombinedProps = IChartAreaProps & WithStyles<typeof styles>;

const buildData = async (resultArray: any, props: IChartAreaCombinedProps): Promise<IChartData | undefined> => {
    if (!props.selectedName) {
        return;
    }
    const chartData: IChartData = {
        id: props.selectedName.ImdbId,
        name: props.selectedName.Name,
        akas: resultArray.base.akas,
        image: resultArray.base.image,
        profession: 'Director',
        averageScore: 0,
        films: [],
        filmsData: []
    };
    resultArray.filmography.forEach((film: any) => {
        if (film.category !== 'self'
            && film.status === 'released'
            && film.titleType !== 'video'
            && film.category === 'director'
        ) {
            chartData.filmsData.push(film);
        }
    })
    return chartData;
}

const buildRatings = async (film: any) => {
    const rawId = film.id.split('/');
    const id = rawId[2];
    const ratingData = await getRatingsData(id);
    if (ratingData.rating) {
        const filmData = {
            title: film.title,
            year: film.year,
            image: film.poster,
            id: id,
            rating: Number(ratingData.rating) || null,
            imdbVotes: Number(ratingData.rating_votes) || null,
        };
        return filmData;
    }
}

const fetchData = async (props: IChartAreaCombinedProps) => {
    const options: any = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/actors/get-all-filmography',
        params: { nconst: props.selectedName.ImdbId },
        headers: {
            'x-rapidapi-key': 'b93408b0b0msh15310ee4e250e2bp15df7cjsnd43da7ee2788',
            'x-rapidapi-host': 'imdb8.p.rapidapi.com'
        }
    };
    return await axios.request(options).then(async response => {
        return await buildData(response.data, props);
    }).catch(function (error) {
        console.error(error);
    });
}

const fetchRatings = async (movieId: string) => {
    const options: any = {
        method: 'GET',
        url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${movieId}`,
        headers: {
            'x-rapidapi-key': 'b93408b0b0msh15310ee4e250e2bp15df7cjsnd43da7ee2788',
            'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com'
        }
    };
    // const options: any = {
    //     method: 'GET',
    //     url: `http://www.omdbapi.com/?i=${movieId}&apikey=262c131`,
    // };
    return await axios.request(options)
        .then(response => response.data)
        .catch(error => console.error(error));
}

const getRatingsData = async (movieId: string) => (
    await fetchRatings(movieId).then(res => res)
)

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload) {
        const rowData = payload[0].payload;
        const votesString = rowData.imdbVotes ? getVotesString(rowData.imdbVotes) : '';
        return (
            <Grid style={{
                backgroundColor: 'rgba(255,193,7,0.5)',
                borderRadius: '0.6rem'
            }}>
                <Typography style={{
                    margin: '0 0.5rem',
                    fontSize: '1.2rem'
                }}>
                    {rowData.title}
                </Typography>
                <Typography style={{
                    margin: '0 0.5rem'
                }}>
                    {`year: ${rowData.year}`}
                </Typography>
                <Typography style={{
                    margin: '0 0.5rem'
                }}>
                    {`Imdb score: ${rowData.rating}`}
                </Typography>
                <Typography style={{
                    margin: '0 0.5rem',
                    color: rowData.imdbVotes > 1000 ? 'black' : 'red'
                }}>
                    {`Voters: ${votesString}`}
                </Typography>
            </Grid>
        );
    }
    return null;
};

const chartComponent = (chartData: IChartDataItem[], props: IChartAreaCombinedProps) => {
    const charts: any[] = []
    chartData.forEach(chart => {
        if (chart.isShown) {
            const sortedData = chart.data.films.sort(dynamicSortMultiple("year"));
            charts.push(
                <Scatter
                    key={chart.id}
                    name={chart.data.name}
                    data={sortedData}
                    fill={chart.color}
                >
                    <LabelList
                        dataKey="rating"
                        /*
                        // @ts-ignore */
                        style={{
                            fontFamily: "Impact",
                            fontSize: '0.8rem',
                            pointerEvents: 'none'
                        }}
                    />
                </Scatter>
            )
        }
    })
    return (
        charts.length ?
            <div style={{ width: props.width - 221, height: props.height - 100 }}>
                <ResponsiveContainer>
                    <ScatterChart
                        margin={{ top: 50, right: 30, left: 10, bottom: 5 }}>
                        <XAxis
                            label={{
                                value: "Years",
                                offset: -10,
                                position: 'insideBottomRight',
                                fontWeight: 500,
                                fontFamily: "Impact"
                            }}
                            tick={{
                                fontFamily: "Impact",
                                fontSize: '1.2rem'
                            }}
                            dataKey="year"
                            tickCount={8}
                            type='number'
                            padding={{ left: 30, right: 30 }}

                            stroke='black'
                            /*
                            // @ts-ignore */
                            strokeWidth={6}
                            domain={['dataMin', 'dataMax']}
                        />
                        <YAxis
                            label={{
                                value: "Imdb Rating",
                                angle: -90,
                                offset: 5,
                                position: 'insideLeft',
                                fontWeight: 500,
                                fontFamily: "Impact"
                            }}
                            dataKey="rating"
                            type='number'
                            tickCount={8}
                            tick={{
                                fontFamily: "Impact",
                                fontSize: '1.2rem',
                            }}
                            /*
                            // @ts-ignore */
                            strokeWidth={6}
                            stroke='black'
                            padding={{ top: 30, bottom: 30 }}
                            domain={['dataMin', 'dataMax']}
                        />
                        <ZAxis
                            /*
                            // @ts-ignore */
                            font="Impact"
                            scale='log'
                            type="number"
                            dataKey="rating"
                            range={[700, 700]}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<CustomTooltip props={props} />} />
                        <Legend />
                        {charts}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            : undefined
    )
}

const ChartArea: React.FunctionComponent<IChartAreaCombinedProps> = (props: IChartAreaCombinedProps) => {
    const [noData, setNoData] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sameSelected, setSameSelected] = useState<boolean>(false);
    const [dataToDisplay, setDataToDisplay] = useState<IChartDataItem[]>([]);

    const dispatch = useDispatch();
    const chartDataItems: IChartDataItem[] = useSelector((state: ReduxState) => state.chartDataItemsReducer.chartDataItems);

    useEffect(() => {
        const fetch = async () => {
            if (chartDataItems.findIndex(item => item.id === props.selectedName.ImdbId) === -1) {
                setIsLoading(true);
                const dataToFetch = await fetchData(props);
                if (dataToFetch) {
                    if (dataToFetch.films.length >= 0) {
                        let dataToDispatch: IChartDataItem = {
                            id: dataToFetch.id,
                            color: getRandomRgbaColor(0.5),
                            isLoading: true,
                            isShown: true,
                            isInfoOpen: false,
                            data: dataToFetch
                        };
                        let data = dataToDisplay;
                        data.push(dataToDispatch)
                        setIsLoading(false);
                        setDataToDisplay(data);
                        setNoData(false);
                        dispatch(chartDataAddedAsync(dataToDispatch));
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
                        const avr = scores.reduce((a, b) => (a + b)) / scores.length;
                        dataToDispatch.data.averageScore = avr || 0;
                        dataToDispatch.isLoading = false;
                        dispatch(chartDataUpdatedAsync(dataToDispatch.id, dataToDispatch));

                    } else {
                        setNoData(true);
                        setSnackbarOpen(true);
                    }
                }
            } else {
                setSnackbarOpen(true);
                setSameSelected(true);
            }
        }
        fetch();
    }, [props.selectedName]);

    useEffect(() => {
        if (chartDataItems.length !== dataToDisplay.length) {
            setDataToDisplay(chartDataItems);
        }
    }, [chartDataItems])

    return (
        <Fragment>
            <Grid container className={props.classes.chartArea}>
                <Grid item>
                    <EntriesList />
                </Grid>
                <Grid item>
                    {chartComponent(dataToDisplay, props)}
                </Grid>
                {isLoading
                    ? <Grid container className={props.classes.loading}>
                        <SiImdb id='loading_icon' className={props.classes.loadingIcon} />
                        <Typography className={props.classes.loadingText}>
                            Loading...
                    </Typography>
                    </Grid>
                    : undefined}
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {sameSelected
                        ? `Film data for ${props.selectedName.Name} already displayed, please select another name`
                        : 'Insufficient voters or rating data, please make another selection'}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default withStyles(styles)(ChartArea);