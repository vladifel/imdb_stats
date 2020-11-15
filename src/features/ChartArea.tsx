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
    Scatter
} from 'recharts';
import { mapFromArray } from '../helpers/mapFromArray';
import { useWindowSize } from '../helpers/useWindowSize';
import { dynamicSortMultiple } from '../helpers/Sorting';
import ratingsFile from '../assets/ratings.json';
import ratingsFile2 from '../assets/ratings2.json';
import ratingsFile3 from '../assets/ratings3.json';
import { IChartData, IFilmData, IPersonData } from './LandingPage';
import './ChartArea.css';

const styles = () =>
    createStyles({
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

const buildData = async (resultArray: any, ratings: any, ratings2: any,ratings3: any,props: IChartAreaCombinedProps): Promise<IChartData | undefined> => {
    if (!props.selectedName || !props.selectedProf) {
        return;
    }
    const chartData: IChartData = {
        id: props.selectedName.nconst,
        name: props.selectedName.primaryName,
        akas: resultArray.base.akas,
        image: resultArray.base.image,
        profession: props.selectedProf,
        films: []
    };
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
                const rating = ratings[id] ? ratings[id] : ratings2[id] ? ratings2[id] :ratings3[id];
                if (rating) {
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
    return chartData;
}

const fetchData = async (ratings: any, ratings2: any,ratings3: any,props: IChartAreaCombinedProps) => {
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

const ChartArea: React.FunctionComponent<IChartAreaCombinedProps> = (props: IChartAreaCombinedProps) => {
    const [chartData, setChartData] = useState<IFilmData[]>([]);
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
        setChartData([]);
        const fetch = async () => {
            const dataToFetch = await fetchData(ratings, ratings2, ratings3,props);
            if (dataToFetch) {
                if (dataToFetch.films.length) {
                    setNoData(false);
                    const data = dataToFetch.films.sort(dynamicSortMultiple("year"));
                    setChartData(data);
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
        <div style={{ width: width - 30, height: height - 100 }}>
            {noData
                ? <Grid container className={props.classes.loading}>
                    <Typography className={props.classes.noDataText}>
                        {'Insufficient voters or rating data, please make another selection'}
                    </Typography>
                </Grid>
                : chartData.length
                    ? <ResponsiveContainer>
                        <ScatterChart
                            margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                            <XAxis
                                label={{ value: "Years", offset: -10, position: 'insideBottomRight' }}
                                dataKey="year"
                                tickCount={8}
                                type='number'
                                padding={{ left: 30, right: 30 }}
                                domain={['dataMin', 'dataMax']}
                            />
                            <YAxis
                                label={{ value: "Imdb Rating", angle: -90, offset: 10, position: 'insideLeft' }}
                                dataKey="rating"
                                type='number'
                                tickCount={8}
                                padding={{ top: 30, bottom: 30 }}
                                domain={['dataMin', 'dataMax']}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip content={<CustomTooltip props={props} />} />
                            <Legend />
                            <Scatter name={name} data={chartData} fill="#f3ce13" />
                        </ScatterChart>
                    </ResponsiveContainer>
                    : <Grid container className={props.classes.loading}>
                        <SiImdb id='loading_icon' className={props.classes.loadingIcon} />
                        <Typography className={props.classes.loadingText}>
                            Loading...
                    </Typography>
                    </Grid>}
        </div>
    );
}

export default withStyles(styles)(ChartArea);