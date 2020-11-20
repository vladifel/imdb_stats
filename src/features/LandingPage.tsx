import React, { Fragment, useMemo, useState } from 'react';
import classNames from "classnames";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import actorsFile from '../assets/actors.json';
// import directorsFile from '../assets/directors.json';
// import producersFile from '../assets/producers.json';
// import writersFile from '../assets/writers.json';
import directorsData from '../assets/directors1000.json';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ChartArea from './ChartArea';
import { mapFromArray } from '../helpers/mapFromArray';
import ListBox from '../helpers/ListBox';
import { IconButton } from '@material-ui/core';
import { styles } from './LandingPage.styles';
import EntriesList from './EntriesList';
import InfoArea from './InfoArea';
import { useWindowSize } from '../helpers/useWindowSize';

export interface IPersonData {
    ImdbId: string;
    Name: any;
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
            options={['Actors', 'Directors']}
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

// const fetch = async (prof: string) => {
//     let url = '';
//     if (prof === 'Actors') {
//         url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/actors.json?alt=media&token=bde51ce1-5ec0-4601-b917-8da4bb3fa1cb';
//     } else if (prof === 'Directors') {
//         url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/directors.json?alt=media&token=777ac648-dfb9-41cc-8fab-728c02659767';
//     } else if (prof === 'Producers') {
//         url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/producers.json?alt=media&token=5ef5dd4d-ae56-4455-8fbd-e30773d28fe4';
//     } else if (prof === 'Writers') {
//         url = 'https://firebasestorage.googleapis.com/v0/b/imdbstatdata.appspot.com/o/writers.json?alt=media&token=46e99fc7-4981-480f-8a58-e39e574c2daf';
//     }
//     const options: any = {
//         method: 'GET',
//         url: url
//     };

//     return await axios.request(options).then(async response => {
//         return await response.data
//     }).catch(error => console.error(error));
// }

// const getData = async (prof: string) => {
//     const data: any = await fetch(prof);
//     if (data) {
//         return mapFromArray(Object.values(data!), 'primaryName');
//     }
//     return;
// }

const LandingPage: React.FunctionComponent<ILandingPageCombinedProps> = (props: ILandingPageCombinedProps) => {
    const [dataLoaded, setDataLoaded] = useState<Map<string, IPersonData> | undefined>(undefined);
    const [selectedName, setSelectedName] = useState<IPersonData | undefined>(undefined);
    const [nameToDisplay, setNameToDisplay] = useState<any>(undefined);
    const { width, height } = useWindowSize();

    useMemo(
        () => setDataLoaded(mapFromArray(Object.values(directorsData))),
        []);

    const handleAddAnother = () => {

    }

    const handleSearch = (value: string) => {
        if (dataLoaded) {
            setSelectedName(dataLoaded.get(value.toLowerCase()));
            setNameToDisplay(value);
        }
    }

    return (
        <Grid container className={props.classes.page}>
            <Grid container className={props.classes.root}>
                <Grid className={props.classes.rootLeft}>
                    <Grid item className={props.classes.nameSelectNew}>
                        <ListBox
                            dataMap={dataLoaded}
                            value={nameToDisplay}
                            handleLineClicked={handleSearch}
                        />
                    </Grid>
                    <Grid item className={props.classes.iconTwoMargins}>
                        <IconButton onClick={handleAddAnother}>
                            <GroupAddIcon className={props.classes.icon} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item style={{ width: '100%', height: '100%' }}>
                {selectedName
                    ? <ChartArea
                        height={height}
                        width={width}
                        selectedName={selectedName}
                    /> : undefined}
                <Grid className={props.classes.rootRight}>
                    <InfoArea
                        height={height} />
                </Grid>
            </Grid>

        </Grid>
    );
}

export default withStyles(styles)(LandingPage);