import React, { useMemo, useState } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { styles } from './LandingPage.styles';
import directorsData from '../assets/directors1000.json';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import IconButton from '@material-ui/core/IconButton';
import ChartArea from './ChartArea';
import { mapFromArray } from '../helpers/mapFromArray';
import ListBox from '../helpers/ListBox';
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
    filmsData: any[];
}

interface ILandingPageProps {

}

type ILandingPageCombinedProps = ILandingPageProps & WithStyles<typeof styles>;

const LandingPage: React.FunctionComponent<ILandingPageCombinedProps> = (props: ILandingPageCombinedProps) => {
    const [dataLoaded, setDataLoaded] = useState<Map<string, IPersonData> | undefined>(undefined);
    const [selectedName, setSelectedName] = useState<IPersonData | undefined>(undefined);
    const [nameToDisplay, setNameToDisplay] = useState<any>(undefined);
    const { width, height } = useWindowSize();

    useMemo(() => {
        setDataLoaded(mapFromArray(Object.values(directorsData)))
        // On first load
        setSelectedName(mapFromArray(Object.values(directorsData)).get('christopher nolan'));
    }, []);

    const handleAddAnother = () => {
        if (dataLoaded) {
            setSelectedName(dataLoaded.get(nameToDisplay.toLowerCase()));
            setNameToDisplay('');
        }

    }

    const handleSearch = (value: string) => {
        if (dataLoaded) {
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
                        <Tooltip
                            title='Add to chart'
                            placement='right'
                            enterDelay={500}
                            enterNextDelay={500}
                        >
                            <IconButton onClick={handleAddAnother}>
                                <GroupAddIcon className={props.classes.icon} />
                            </IconButton>
                        </Tooltip>
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