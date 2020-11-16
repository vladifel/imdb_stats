import React, { useEffect, useState } from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
import { mapFromArray } from '../helpers/mapFromArray';
import { useWindowSize } from '../helpers/useWindowSize';
import { dynamicSortMultiple } from '../helpers/Sorting';
import ratingsFile from '../assets/ratings.json';
import ratingsFile2 from '../assets/ratings2.json';
import ratingsFile3 from '../assets/ratings3.json';
import { IChartData, IFilmData, IPersonData } from './LandingPage';
import './ChartArea.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const styles = () =>
    createStyles({
        chartArea: {
            display: 'flex',
            flexDirection: 'row',
        },
        divider: {
            marginTop: '0.5rem',
            marginLeft: 0,
        },
        infoArea: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: "#f3ce13",
            height: '100%',
            width: '12.75rem'
        },
        infoAreaBottom: {

        },
        infoAreaTop: {

        },
        loading: {
            height: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'

        },
        loadingIcon: {
            fontSize: '6rem',
            color: "#f3ce13",
            backgroundColor: '#252525',
            borderRadius: '0.55rem',
            marginBottom: '0.7rem'
        },
        loadingText: {
            fontSize: '1.5rem'
        },
        noDataText: {
            marginLeft: '1rem',
            fontSize: '2rem'
        }
    });

interface IChartAreaProps {
    selectedProf: string;
    selectedName: IPersonData;
}

type IChartAreaCombinedProps = IChartAreaProps & WithStyles<typeof styles>;


const infoArea = (chartData: IChartData, props: IChartAreaCombinedProps) => {
    return (
        <Grid container className={props.classes.infoArea}>
            <Grid item className={props.classes.infoAreaTop}>
                <Grid>
                    <Typography>
                        Name:
                </Typography>
                    <Typography>
                        {` ${chartData.name}`}
                    </Typography>
                </Grid>
                <Grid>
                    <Typography>
                        Number of movies:
                </Typography>
                    <Typography>
                        {` ${chartData.films.length}`}
                    </Typography>
                </Grid>
                <Grid>
                    <Typography>
                        Average Rating:
                </Typography>
                    <Typography>
                        {` ${Math.floor(chartData.averageScore * 100) / 100}`}
                    </Typography>
                </Grid>
            </Grid>
            <Divider variant="inset" className={props.classes.divider} />
            <Grid item className={props.classes.infoAreaBottom}>
                <List >
                    {chartData.films.map(film => {
                        let votesString = '';
                        if (film.imdbVotes) {
                            const votes = film.imdbVotes.toString();
                            for (let i = 0; i < votes.length; i++) {
                                (votes.length - i) % 3 === 0 && i !== 0 ? votesString += `,${votes[i]}` : votesString += votes[i];
                            }
                        }
                        return (
                            <ListItem>
                                <ListItemText
                                    primary={`${film.year}: ${film.title}`}
                                    secondary={`Rating: ${film.rating} (${votesString} votes)`}
                                />
                            </ListItem>
                        )
                    }
                    )}
                </List>
            </Grid>
        </Grid>
    )
}
const buildData = async (resultArray: any, ratings: any, ratings2: any, ratings3: any, props: IChartAreaCombinedProps): Promise<IChartData | undefined> => {
    if (!props.selectedName || !props.selectedProf) {
        return;
    }
    const chartData: IChartData = {
        id: props.selectedName.nconst,
        name: props.selectedName.primaryName,
        akas: resultArray.base.akas,
        image: resultArray.base.image,
        profession: props.selectedProf,
        averageScore: 0,
        films: []
    };
    const scores: number[] = [];
    for (let i = 0; i < resultArray.filmography.length; i++) {
        const film = resultArray.filmography[i];
        if (film.category !== 'self' && film.status === 'released' && film.titleType !== 'video') {
            if (
                (props.selectedProf === 'Actors' && (film.category === 'actor' || film.category === 'actress'))
                || (props.selectedProf === 'Directors' && film.category === 'director')
                || (props.selectedProf === 'Producers' && film.category === 'producer')
                || (props.selectedProf === 'Writers' && film.category === 'writer')
            ) {
                const rawId = film.id.split('/');
                const id = rawId[2];
                const rating = ratings[id] ? ratings[id] : ratings2[id] ? ratings2[id] : ratings3[id];
                if (rating) {
                    Number(rating.averageRating) && scores.push(Number(rating.averageRating));
                    const filmData = {
                        title: film.title,
                        year: film.year,
                        image: film.image,
                        id: id,
                        rating: Number(rating.averageRating) || null,
                        imdbVotes: Number(rating.numVotes) || null,
                    };
                    chartData.films.push(filmData);
                }
            }
        }
    }
    const avr = scores.reduce((a, b) => (a + b)) / scores.length;
    chartData.averageScore = avr || 0;
    return chartData;
}

const fetchData = async (ratings: any, ratings2: any, ratings3: any, props: IChartAreaCombinedProps) => {
    const options: any = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/actors/get-all-filmography',
        params: { nconst: props.selectedName!.nconst },
        headers: {
            'x-rapidapi-key': 'b93408b0b0msh15310ee4e250e2bp15df7cjsnd43da7ee2788',
            'x-rapidapi-host': 'imdb8.p.rapidapi.com'
        }
    };

    return await axios.request(options).then(async response => {
        return await buildData(response.data, ratings, ratings2, ratings3, props);
    }).catch(function (error) {
        console.error(error);
    });
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload) {
        const rowData = payload[0].payload
        return (
            <Grid style={{
                backgroundColor: 'rgba(243, 206, 19, 0.5)'
            }}>
                <Typography style={{
                    margin: '0 0.5rem',
                    fontWeight: 1000
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
                    {`Voters: ${rowData.imdbVotes}`}
                </Typography>
            </Grid>
        );
    }

    return null;
};

const chartComponent = (name: string, chartData: IChartData, width: number, height: number, props: IChartAreaCombinedProps) => {
    const range = [200, 800];
    const data = chartData.films.sort(dynamicSortMultiple("year"));

    return (
        <div style={{ width: width - 221, height: height - 100 }}>
            <ResponsiveContainer>
                <ScatterChart
                    margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                    <XAxis
                        label={{ value: "Years", offset: -10, position: 'insideBottomRight', fontWeight: 500 }}
                        dataKey="year"
                        tickCount={8}
                        type='number'
                        padding={{ left: 30, right: 30 }}
                        fontFamily="sans-serif"
                        fontSize='1.2rem'
                        fontWeight={700}
                        strokeWidth={10}
                        domain={['dataMin', 'dataMax']}
                    />
                    <YAxis
                        label={{ value: "Imdb Rating", angle: -90, offset: 10, position: 'insideLeft', fontWeight: 500 }}
                        dataKey="rating"
                        type='number'
                        tickCount={8}
                        fontSize='1.2rem'
                        fontFamily="sans-serif"
                        fontWeight={700}
                        strokeWidth={10}
                        padding={{ top: 30, bottom: 30 }}
                        domain={['dataMin', 'dataMax']}
                    />
                    <ZAxis scale='log' type="number" dataKey="rating" range={range} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip content={<CustomTooltip props={props} />} />
                    <Legend />
                    <Scatter name={name} data={data} fill="#f3ce13" >
                        <LabelList dataKey="rating" style={{ pointerEvents: 'none' }} />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>

    )
}

const ChartArea: React.FunctionComponent<IChartAreaCombinedProps> = (props: IChartAreaCombinedProps) => {
    const [chartData, setChartData] = useState<IChartData | undefined>(undefined);
    const [name, setName] = useState<string>('');
    const [noData, setNoData] = useState<boolean>(false);
    const { width, height } = useWindowSize();

    const ratings = React.useMemo(
        () => {
            const data = Object.values(ratingsFile);
            return mapFromArray(data, 'tconst');
        },
        []);
    const ratings2 = React.useMemo(
        () => {
            const data = Object.values(ratingsFile2);
            return mapFromArray(data, 'tconst');
        },
        []);
    const ratings3 = React.useMemo(
        () => {
            const data = Object.values(ratingsFile3);
            return mapFromArray(data, 'tconst');
        },
        []);

    useEffect(() => {
        setNoData(false);
        setChartData(undefined);
        const fetch = async () => {
            const dataToFetch = await fetchData(ratings, ratings2, ratings3, props);
            if (dataToFetch) {
                if (dataToFetch.films.length) {
                    setNoData(false);
                    setChartData(dataToFetch);
                    let plotName = '';
                    if (props.selectedProf === 'Actors') {
                        plotName = `Staring ${dataToFetch.name}`;
                    } else if (props.selectedProf === 'Directors') {
                        plotName = `Directed by ${dataToFetch.name}`;
                    } else if (props.selectedProf === 'Producers') {
                        plotName = `Produced by ${dataToFetch.name}`;
                    } else if (props.selectedProf === 'Writers') {
                        plotName = `Written by ${dataToFetch.name}`;
                    }
                    setName(plotName);
                } else {
                    setNoData(true);
                }
            }
        }
        fetch();
    }, [props.selectedName]);
    return (
        noData
            ? <Grid container className={props.classes.loading
            } >
                <Typography className={props.classes.noDataText}>
                    {'Insufficient voters or rating data, please make another selection'}
                </Typography>
            </Grid >
            : chartData && chartData.films.length
                ? <Grid container className={props.classes.chartArea}>
                    <Grid item>
                        {chartComponent(name, chartData, width, height, props)}
                    </Grid>
                    <Grid item>
                        {infoArea(chartData, props)}
                    </Grid>
                </Grid>
                : <Grid container className={props.classes.loading}>
                    <SiImdb id='loading_icon' className={props.classes.loadingIcon} />
                    <Typography className={props.classes.loadingText}>
                        Loading...
                    </Typography>
                </Grid>
    );
}

export default withStyles(styles)(ChartArea);