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
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ChartArea from './ChartArea';
import { mapFromArray } from '../helpers/mapFromArray';
import ListBox from '../helpers/ListBox';
import Typography from '@material-ui/core/Typography';
import { IconButton } from '@material-ui/core';
import { styles } from './LandingPage.styles';

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

const profSelect = (isTwo: boolean, selectedProf: string | null, handleSetSelectedProf: (isTwo: boolean, event: any, value: string | null) => void, props: ILandingPageCombinedProps) => {
    return (
        <Autocomplete
            id="prof_selector"
            options={['Actors', 'Directors', 'Producers', 'Writers']}
            value={selectedProf}
            onChange={(event, value) => handleSetSelectedProf(isTwo, event, value)}
            renderInput={(params) => <TextField {...params} label="Profession" variant="outlined" />}
            classes={{
                inputRoot: props.classes.inputRoot,
                option: props.classes.options,
                root: props.classes.rootAutoComplete
            }}
        />
    )
}

const fetch = async (prof: string) => {
    let url = '';
    if (prof === 'Actors') {
        url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/actors.json?alt=media&token=bde51ce1-5ec0-4601-b917-8da4bb3fa1cb';
    } else if (prof === 'Directors') {
        url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/directors.json?alt=media&token=777ac648-dfb9-41cc-8fab-728c02659767';
    } else if (prof === 'Producers') {
        url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/producers.json?alt=media&token=5ef5dd4d-ae56-4455-8fbd-e30773d28fe4';
    } else if (prof === 'Writers') {
        url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/writers.json?alt=media&token=46e99fc7-4981-480f-8a58-e39e574c2daf';
    }
    const options: any = {
        method: 'GET',
        url: url
    };

    return await axios.request(options).then(async response => {
        return await response.data
    }).catch(error => console.error(error));
}

const getData = async (prof: string) => {
    const data: any = await fetch(prof);
    if (data) {
        return mapFromArray(Object.values(data!), 'primaryName');
    }
    return;
}

const LandingPage: React.FunctionComponent<ILandingPageCombinedProps> = (props: ILandingPageCombinedProps) => {
    const [selectedProf, setSelectedProf] = useState<string | null>(null);
    const [dataLoaded, setDataLoaded] = useState<any>(undefined);
    const [selectedName, setSelectedName] = useState<IPersonData | null>(null);
    const [nameToDisplay, setNameToDisplay] = useState<any>(undefined);

    const [displayTwo, setDisplayTwo] = useState<boolean>(false);
    const [selectedProfTwo, setSelectedProfTwo] = useState<string | null>(null);
    const [dataLoadedTwo, setDataLoadedTwo] = useState<any>(undefined);
    const [selectedNameTwo, setSelectedNameTwo] = useState<IPersonData | null>(null);
    const [nameToDisplayTwo, setNameToDisplayTwo] = useState<any>(undefined);

    const actors = React.useMemo(() => {
        const data = Object.values(actorsFile);
        return mapFromArray(data, 'primaryName');

        //return getData('Actors');
    },
        []);
    const directors = React.useMemo(
        () => {
            const data = Object.values(directorsFile);
            return mapFromArray(data, 'primaryName');

            //return getData('Directors');
        },
        []);
    const producers = React.useMemo(
        () => {
            const data = Object.values(producersFile);
            return mapFromArray(data, 'primaryName');
            //return getData('Producers');
        },
        []);
    const writers = React.useMemo(
        () => {
            const data = Object.values(writersFile);
            return mapFromArray(data, 'primaryName');
            //return getData('Writers');
        },
        []);

    const handleSetSelectedProf = async (isTwo: boolean, event: any, value: string | null) => {
        isTwo ? setSelectedProfTwo(value) : setSelectedProf(value);
        isTwo ? setDataLoadedTwo(undefined) : setDataLoaded(undefined);
        let data: any = undefined;
        if (value === 'Actors') {
            //data = await actors.then(res => res);
            data = actors;
        } else if (value === 'Directors') {
            //data = await directors.then(res => res);
            data = directors;
        } else if (value === 'Producers') {
            //data = await producers.then(res => res);
            data = producers;
        } else if (value === 'Writers') {
            //data = await writers.then(res => res);
            data = writers;
        }
        isTwo ? setDataLoadedTwo(data) : setDataLoaded(data);
    }

    const handleSearch = (value: string) => {
        setSelectedName(dataLoaded[value as any]);
        setNameToDisplay(value);
    }

    const handleSearchTwo = (value: string) => {
        setSelectedNameTwo(dataLoadedTwo[value as any]);
        setNameToDisplayTwo(value);
    }

    const handleDisplayTwoOn = () => {
        setDisplayTwo(true);
    }
    return (
        <Grid container className={props.classes.page}>
            <Grid container className={props.classes.root}>
                <Grid className={props.classes.rootLeft}>
                    <Grid item className={props.classes.profSelect}>
                        {profSelect(false, selectedProf, handleSetSelectedProf, props)}
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
                            <Grid item className={props.classes.iconTwoMargins}>
                                <IconButton onClick={handleDisplayTwoOn}>
                                    <GroupAddIcon className={props.classes.icon} />
                                </IconButton>
                            </Grid>
                        </Fragment>
                        : undefined}
                    {displayTwo
                        ? <Fragment>
                            <Grid item className={props.classes.profSelect}>
                                {profSelect(true, selectedProfTwo, handleSetSelectedProf, props)}
                            </Grid>
                            {dataLoadedTwo
                                ? <Fragment>
                                    <Grid item className={props.classes.iconMargins}>
                                        <ForwardIcon className={props.classes.icon} />
                                    </Grid>
                                    <Grid item className={props.classes.nameSelectNew}>
                                        <ListBox
                                            dataMap={dataLoadedTwo}
                                            value={nameToDisplayTwo}
                                            handleLineClicked={handleSearchTwo}
                                        />
                                    </Grid>
                                </Fragment>
                                : undefined}
                        </Fragment>
                        : undefined}
                </Grid>
            </Grid>
            <Grid item style={{ width: '100%', height: '100%' }}>
                {selectedName && selectedProf
                    ? <ChartArea
                        selectedProf={selectedProf}
                        selectedName={selectedName}
                        selectedProfTwo={selectedProfTwo}
                        selectedNameTwo={selectedNameTwo}
                    /> : undefined}
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(LandingPage);