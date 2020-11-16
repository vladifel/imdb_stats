import React, { Fragment, useState } from 'react';
import classNames from "classnames";
import axios from "axios";
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import actorsFile from '../assets/actors.json';
import directorsFile from '../assets/directors.json';
import producersFile from '../assets/producers.json';
import writersFile from '../assets/writers.json';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import ForwardIcon from '@material-ui/icons/Forward';
import ChartArea from './ChartArea';
import { mapFromArray } from '../helpers/mapFromArray';
import ListBox from '../helpers/ListBox';
import Typography from '@material-ui/core/Typography';

const styles = () =>
    createStyles({
        icon: {
            color: "#f3ce13",
            fontSize: '2rem'
        },
        iconMargins: {
            margin: '0 0.5rem'
        },
        inputRoot: {
            color: "black",
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(243, 206, 19, 0.7)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f3ce13"
            }
        },
        mediumIcon: {
            fontSize: '1.25rem'
        },
        nameSelectNew: {
            width: '20rem'
        },
        options: {
            fontSize: '0.8125rem',
            lineHeight: '1.2',
            color: '#252525',
            '&[aria-selected="true"]': {
                color: '#252525',
                fontWeight: 1000,
                backgroundColor: '#ffffff'
            },
            '&[data-focus="true"]': {
                color: '#252525',
                backgroundColor: 'rgba(243, 206, 19, 0.7)',
            },
        },
        profSelect: {
            width: '10rem',
            marginRight: '0.5rem'
        },
        rating: {
            display: "flex",
            justifyContent: 'flex-end'
        },
        root: {
            display: "flex",
            backgroundColor: '#ffffff',
            justifyContent: 'space-between',
            flexDirection: "row",
            flexWrap: 'nowrap',
            minHeight: '6.25rem',
            boxShadow: '0 0.125rem 0.3125rem 0 rgba(243, 206, 19, 0.5)',
        },
        rootAutoComplete: {
            '& label.Mui-focused': {
                color: "#f3ce13",
                fontWeight: 1000
            },
        },
        rootLeft: {
            display: "flex",
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: '5rem'
        },
        rootRight: {
            display: "flex",
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginRight: '4.3rem'
        }
    });

export interface IPersonData {
    nconst: string;
    primaryName: any;
}

export interface IFilmData {
    title: string;
    year: number;
    image: any;
    id: string;
    rating: number | null;
    imdbVotes: number | null;
}

export interface IChartData {
    id: string;
    name: string;
    akas: string[];
    image: any;
    profession: string;
    averageScore: number;
    films: IFilmData[];
}

interface ILandingPageProps {

}

type ILandingPageCombinedProps = ILandingPageProps & WithStyles<typeof styles>;

const profSelect = (selectedProf: string | null, handleSetSelectedProf: (event: any, value: string | null) => void, props: ILandingPageCombinedProps) => {
    return (
        <Autocomplete
            id="prof_selector"
            options={['Actors', 'Directors', 'Producers', 'Writers']}
            value={selectedProf}
            onChange={(event, value) => handleSetSelectedProf(event, value)}
            renderInput={(params) => <TextField {...params} label="Profession" variant="outlined" />}
            classes={{
                inputRoot: props.classes.inputRoot,
                option: props.classes.options,
                root: props.classes.rootAutoComplete
            }}
        />
    )
}

const LandingPage: React.FunctionComponent<ILandingPageCombinedProps> = (props: ILandingPageCombinedProps) => {
    const [selectedProf, setSelectedProf] = useState<string | null>(null);
    const [dataLoaded, setDataLoaded] = useState<any>(undefined);
    const [selectedName, setSelectedName] = useState<IPersonData | null>(null);
    const [nameToDisplay, setNameToDisplay] = useState<any>(undefined);

    const actors = React.useMemo(() => {
        const data = Object.values(actorsFile);
        return mapFromArray(data, 'primaryName');
        // const fetch = async () => {
        //     const options: any = {
        //         method: 'GET',
        //         url: 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/actors.json?alt=media&token=bde51ce1-5ec0-4601-b917-8da4bb3fa1cb',
        //     };

        //     return await axios.request(options).then(response => {
        //         return response.data
        //     }).catch(function (error) {
        //         console.error(error);
        //     });
        // }
        // const getActors = async () => {
        //     const data = await fetch();
        //     return mapFromArray(Object.values(data), 'primaryName');
        // }
        // getActors();
    },
        []);
    const directors = React.useMemo(
        () => {
            const data = Object.values(directorsFile);
            return mapFromArray(data, 'primaryName');
            // const fetch = async () => {
            //     const options: any = {
            //         method: 'GET',
            //         url: 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/directors.json?alt=media&token=777ac648-dfb9-41cc-8fab-728c02659767',
            //     };

            //     return await axios.request(options).then(async response => {
            //         return await response.data
            //     }).catch(error => console.error(error));
            // }
            // const getDirectors = async () => {
            //     const data = await fetch();
            //     return mapFromArray(Object.values(data), 'primaryName');
            // }
            // return getDirectors();
        },
        []);
    const producers = React.useMemo(
        () => {
            const data = Object.values(producersFile);
            return mapFromArray(data, 'primaryName');
        },
        []);
    const writers = React.useMemo(
        () => {
            const data = Object.values(writersFile);
            return mapFromArray(data, 'primaryName');
        },
        []);

    const handleSetSelectedProf = async (event: any, value: string | null) => {
        setSelectedProf(value);
        setDataLoaded(undefined);
        if (value === 'Actors') {
            setDataLoaded(actors);
        } else if (value === 'Directors') {
            // const dir = await directors.then(res => res);
            // setDataLoaded(dir);
            setDataLoaded(directors);
        } else if (value === 'Producers') {
            setDataLoaded(producers);
        } else if (value === 'Writers') {
            setDataLoaded(writers);
        }
    }

    const handleSearch = (value: string) => {
        setSelectedName(dataLoaded[value as any]);
        setNameToDisplay(value);
    }
    return (
        <Grid container>
            <Grid container className={props.classes.root}>
                <Grid className={props.classes.rootLeft}>
                    <Grid item className={props.classes.profSelect}>
                        {profSelect(selectedProf, handleSetSelectedProf, props)}
                    </Grid>
                    {dataLoaded
                        ? <Fragment>
                            <Grid item className={props.classes.iconMargins}>
                                <ForwardIcon className={props.classes.icon} />
                            </Grid>
                            <Grid item className={props.classes.nameSelectNew}>
                                <ListBox
                                    dataMap={dataLoaded}
                                    value={nameToDisplay}
                                    handleLineClicked={handleSearch}
                                />
                            </Grid>
                        </Fragment>
                        : undefined}
                </Grid>
            </Grid>
            <Grid item style={{ width: '100%', height: '100%' }}>
                {selectedName && selectedProf
                    ? <ChartArea
                        selectedProf={selectedProf}
                        selectedName={selectedName}
                    /> : undefined}
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(LandingPage);