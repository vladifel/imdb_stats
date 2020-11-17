import React, { Fragment, useEffect, useState } from 'react';
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
import { IChartData, IPersonData } from './LandingPage';
import './ChartArea.css';
import TooltipMui from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { styles } from './ChartArea.styles';

interface IChartAreaProps {
    selectedProf: string;
    selectedName: IPersonData;
    selectedProfTwo: string | null;
    selectedNameTwo: IPersonData | null;
}

type IChartAreaCombinedProps = IChartAreaProps & WithStyles<typeof styles>;


const infoArea = (isSecond: boolean, chartData: IChartData, height: number, props: IChartAreaCombinedProps) => {
    const name: string[] = chartData.name.split(' ');
    const fn = name[0];
    name.shift();
    return (
        <Grid container
            style={{ height: height - 100 }}
            className={classNames(props.classes.infoArea, isSecond ? props.classes.infoAreaSecondColor : props.classes.infoAreaFirstColor)}>
            <Grid item className={props.classes.infoAreaTop}>
                <Grid container className={props.classes.infoAreaNameRow}>
                    <Typography noWrap >
                        <Link
                            className={classNames(props.classes.linkColor, props.classes.infoAreaNameRowText)}
                            href={`https://www.imdb.com/name/${chartData.id}/`}
                            target="_blank"
                        >
                            {fn}
                        </Link>
                    </Typography>
                    <Typography noWrap >
                        <Link
                            className={classNames(props.classes.linkColor, props.classes.infoAreaNameRowText)}
                            href={`https://www.imdb.com/name/${chartData.id}/`}
                            target="_blank"
                        >
                            {name && name.join(' ')}
                        </Link>
                    </Typography>
                </Grid>
                <Grid container className={props.classes.infoAreaTopRows}>
                    <Typography className={props.classes.highlightedText}>
                        No. of movies:
                </Typography>
                    <Typography>
                        {` ${chartData.films.length}`}
                    </Typography>
                </Grid>
                <Grid container className={props.classes.infoAreaTopRows}>
                    <Typography className={props.classes.highlightedText}>
                        Average Rating:
                </Typography>
                    <Typography>
                        {` ${Math.floor(chartData.averageScore * 100) / 100}`}
                    </Typography>
                </Grid>
            </Grid>
            <Divider variant="inset" className={props.classes.divider} />
            <Grid id='info_scroll_area' item style={{ height: height - 250 }} className={props.classes.infoAreaBottom}>
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
                            <ListItem key={film.id}>
                                <ListItemText
                                    primary={
                                        <Link
                                            className={classNames(props.classes.linkColor, props.classes.listText)}
                                            href={`https://www.imdb.com/title/${film.id}/`}
                                            target="_blank"
                                        >
                                            {`${film.year}: ${film.title}`}
                                        </Link>
                                    }
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
const buildData = async (resultArray: any, ratings: any, props: IChartAreaCombinedProps): Promise<IChartData | undefined> => {
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
                const rating = ratings[id];
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

const fetchData = async (isSecond: boolean, ratings: any, props: IChartAreaCombinedProps) => {
    const param = isSecond ? props.selectedNameTwo?.nconst : props.selectedName.nconst;
    const options: any = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/actors/get-all-filmography',
        params: { nconst: param },
        headers: {
            'x-rapidapi-key': 'b93408b0b0msh15310ee4e250e2bp15df7cjsnd43da7ee2788',
            'x-rapidapi-host': 'imdb8.p.rapidapi.com'
        }
    };

    return await axios.request(options).then(async response => {
        return await buildData(response.data, ratings, props);
    }).catch(function (error) {
        console.error(error);
    });
}

const fetchRatings = async () => {
    const options: any = {
        method: 'GET',
        url: 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/ratings.json?alt=media&token=9d5f585e-c7bc-428b-850c-936a38c5be94'
    };

    return await axios.request(options).then(async response => {
        return await response.data
    }).catch(error => console.error(error));
}

const getRatingsData = async () => {
    const data = await fetchRatings();
    return mapFromArray(Object.values(data), 'primaryName');
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload) {
        const rowData = payload[0].payload
        return (
            <Grid style={{
                backgroundColor: 'rgba(243, 206, 19, 0.5)',
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
                    {`Voters: ${rowData.imdbVotes}`}
                </Typography>
            </Grid>
        );
    }

    return null;
};

const chartComponent = (name: string[], chartData: IChartData[], width: number, height: number, props: IChartAreaCombinedProps) => {
    const dataOne = chartData[0].films.sort(dynamicSortMultiple("year"));
    const dataTwo = chartData.length === 2 ? chartData[1].films.sort(dynamicSortMultiple("year")) : undefined;
    console.log(chartData)
    return (
        <div style={{ width: width - 221, height: height - 100 }}>
            <ResponsiveContainer>
                <ScatterChart
                    margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
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
                    <Scatter name={name[0]} data={dataOne} fill="#f3ce13" >
                        <LabelList
                            dataKey="rating"
                        // style={{
                        //     fontFamily: "Impact",
                        //     fontSize: '0.8rem',
                        //     pointerEvents: 'none'
                        // }}
                        />
                    </Scatter>
                    {dataTwo ? <Scatter name={name[1]} data={dataTwo} fill="#fc8403" shape="star">
                        <LabelList
                            dataKey="rating"
                        // style={{
                        //     fontFamily: "Impact",
                        //     fontSize: '0.8rem',
                        //     pointerEvents: 'none'
                        // }}
                        />
                    </Scatter> : undefined}
                </ScatterChart>
            </ResponsiveContainer>
        </div>

    )
}

const setPlotName = (newName: string, isSecond: boolean, currName: string[], props: IChartAreaCombinedProps): string[] => {
    let newPlotName = currName;
    if (!isSecond) {
        if (props.selectedProf === 'Actors') {
            newPlotName[0] = `Staring ${newName}`;
        } else if (props.selectedProf === 'Directors') {
            newPlotName[0] = `Directed by ${newName}`;
        } else if (props.selectedProf === 'Producers') {
            newPlotName[0] = `Produced by ${newName}`;
        } else if (props.selectedProf === 'Writers') {
            newPlotName[0] = `Written by ${newName}`;
        }
    } else {
        newPlotName.length === 1 && newPlotName.push('');
        if (props.selectedProfTwo === 'Actors') {
            newPlotName[1] = `Staring ${newName}`;
        } else if (props.selectedProfTwo === 'Directors') {
            newPlotName[1] = `Directed by ${newName}`;
        } else if (props.selectedProfTwo === 'Producers') {
            newPlotName[1] = `Produced by ${newName}`;
        } else if (props.selectedProfTwo === 'Writers') {
            newPlotName[1] = `Written by ${newName}`;
        }
    }
    return newPlotName;
}

const ChartArea: React.FunctionComponent<IChartAreaCombinedProps> = (props: IChartAreaCombinedProps) => {
    const [chartData, setChartData] = useState<IChartData[] | undefined>(undefined);
    const [name, setName] = useState<string[]>([]);
    const [noData, setNoData] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const { width, height } = useWindowSize();

    const data: IChartData = {
        akas: ["Chris Nolan "],
        id: "nm0634240",
        averageScore: 7.96,
        name: "Christopher Nolan Nolan Nolan",
        profession: "Directors",
        image: {
            height: 400,
            id: "/name/nm0634240/images/rm2047771392",
            url: "https://m.media-amazon.com/images/M/MV5BNjE3NDQyOTYyMV5BMl5BanBnXkFtZTcwODcyODU2Mw@@._V1_.jpg",
            width: 289
        },
        films: [
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 1989
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 1996,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 1997
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 1998
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 1989
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 1996,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 1997
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 1998
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 1999
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 2000,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 2001
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 2002
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 2003
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 2004,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 2005
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 2006
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 2007
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 2008,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 2009
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 2010
            }
        ]
    }

    const data2: IChartData = {
        akas: ["Chris Nolan "],
        id: "nm0634240",
        averageScore: 7.96,
        name: "Christopher Nolan Nolan Nolan",
        profession: "Directors",
        image: {
            height: 400,
            id: "/name/nm0634240/images/rm2047771392",
            url: "https://m.media-amazon.com/images/M/MV5BNjE3NDQyOTYyMV5BMl5BanBnXkFtZTcwODcyODU2Mw@@._V1_.jpg",
            width: 289
        },
        films: [
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 1988
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 1995,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 1996
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 1997
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 1988
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 1997,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 1996
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 1999
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 1995
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 2001,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 2002
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 2003
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 2004
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 2005,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 2006
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 2007
            },
            {
                id: "tt6386408",
                image: undefined,
                imdbVotes: 128,
                rating: 7.3,
                title: "Tarantella",
                year: 2008
            }, {
                id: "tt6386412",
                image: undefined,
                imdbVotes: 96,
                rating: 8,
                title: "Larceny",
                year: 2009,
            }, {
                id: "tt0411302",
                image: { height: 1170, id: "/title/tt0411302/images/rm3995998720", url: "https://m.media-amazon.com/images/M/MV5BZTM0Nzk4ZD…MDAyNDc1MTViXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg", width: 780 },
                imdbVotes: 16261,
                rating: 7.1,
                title: "Doodlebug",
                year: 2010
            }, {
                id: "tt0154506",
                image: { height: 1199, id: "/title/tt0154506/images/rm2825270784", url: "https://m.media-amazon.com/images/M/MV5BMWZmNzk5M2…ZWVjODUwNTEzXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg", width: 809 },
                imdbVotes: 85694,
                rating: 7.5,
                title: "Following",
                year: 2011
            }
        ]
    }

    const ratings = React.useMemo(
        () => {
            const data = Object.values(ratingsFile);
            return mapFromArray(data, 'tconst');
            //return getRatingsData();
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
        setChartData([data, data2]);


        // let plotName: string[] = [];
        // const fetch = async () => {
        //     if (!chartData) {
        //         const dataToFetch = await fetchData(false, ratings, props);
        //         if (dataToFetch) {
        //             if (dataToFetch.films.length) {
        //                 setNoData(false);
        //                 setChartData([dataToFetch]);
        //                 plotName = setPlotName(dataToFetch.name, false, name, props);
        //                 setName(plotName);
        //             } else {
        //                 setNoData(true);
        //                 setSnackbarOpen(true);
        //             }
        //         }
        //     } else if (chartData.length === 1 && props.selectedNameTwo !== null) {
        //         const dataToFetch = await fetchData(true, ratings, props);
        //         if (dataToFetch) {
        //             if (dataToFetch.films.length) {
        //                 setNoData(false);
        //                 const currChartData = chartData;
        //                 currChartData.push(dataToFetch);
        //                 setChartData(currChartData);
        //                 plotName = setPlotName(dataToFetch.name, true, name, props);
        //                 setName(plotName);
        //             } else {
        //                 setSnackbarOpen(true);
        //             }
        //         }
        //     } else if (chartData.length === 2 && chartData[0].name !== props.selectedName.primaryName) {
        //         const dataToFetch = await fetchData(false, ratings, props);
        //         if (dataToFetch) {
        //             if (dataToFetch.films.length) {
        //                 setNoData(false);
        //                 let currChartData = chartData;
        //                 currChartData[0] = dataToFetch;
        //                 setChartData(currChartData);
        //                 plotName = setPlotName(dataToFetch.name, false, name, props);
        //                 setName(plotName);
        //             } else {
        //                 setSnackbarOpen(true);
        //             }
        //         }
        //     } else if (chartData.length === 2 && props.selectedNameTwo && chartData[1].name !== props.selectedNameTwo.primaryName) {
        //         const dataToFetch = await fetchData(true, ratings, props);
        //         if (dataToFetch) {
        //             if (dataToFetch.films.length) {
        //                 setNoData(false);
        //                 let currChartData = chartData;
        //                 currChartData[1] = dataToFetch;
        //                 setChartData(currChartData);
        //                 plotName = setPlotName(dataToFetch.name, true, name, props);
        //                 setName(plotName);
        //             } else {
        //                 setSnackbarOpen(true);
        //             }
        //         }
        //     }
        // }
        // fetch();


        // setNoData(false);
        // props.selectedNameTwo ? setChartData(chartData[0]) : setChartData(undefined);
        // const fetch = async () => {
        //     const dataToFetch = await fetchData(ratings, ratings2, ratings3, props);
        //     if (dataToFetch) {
        //         if (dataToFetch.films.length) {
        //             setNoData(false);
        //             setChartData(dataToFetch);
        //             let plotName = '';
        //             if (props.selectedProf === 'Actors') {
        //                 plotName = `Staring ${dataToFetch.name}`;
        //             } else if (props.selectedProf === 'Directors') {
        //                 plotName = `Directed by ${dataToFetch.name}`;
        //             } else if (props.selectedProf === 'Producers') {
        //                 plotName = `Produced by ${dataToFetch.name}`;
        //             } else if (props.selectedProf === 'Writers') {
        //                 plotName = `Written by ${dataToFetch.name}`;
        //             }
        //             setName(plotName);
        //         } else {
        //             setNoData(true);
        //         }
        //     }
        // }
        // fetch();
    }, [props.selectedName, props.selectedNameTwo]);

    return (
        <Fragment>
            {noData && !chartData
                ? <Grid container className={props.classes.loading
                } >
                    <Typography className={props.classes.noDataText}>
                        {'Insufficient voters or rating data, please make another selection'}
                    </Typography>
                </Grid >
                : chartData && chartData[0].films.length
                    ? <Grid container className={props.classes.chartArea}>
                        {chartData.length === 2
                            ? <Grid item>
                                {infoArea(true, chartData[1], height, props)}
                            </Grid>
                            : undefined}
                        <Grid item>
                            {chartComponent(name, chartData, chartData.length === 2 ? width - 220.8 : width, height, props)}
                        </Grid>
                        <Grid item>
                            {infoArea(false, chartData[0], height, props)}
                        </Grid>
                    </Grid>
                    : <Grid container className={props.classes.loading}>
                        <SiImdb id='loading_icon' className={props.classes.loadingIcon} />
                        <Typography className={props.classes.loadingText}>
                            Loading...
                    </Typography>
                    </Grid>}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    Insufficient voters or rating data, please make another selection
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default withStyles(styles)(ChartArea);