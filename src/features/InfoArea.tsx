import React, { Dispatch, Fragment, useEffect, useMemo, useState } from 'react';
import classNames from "classnames";
import axios from "axios";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { styles } from './InfoArea.styles';
import { chartDataInfoShown, chartDataRemovedAsync, chartDataSelected, chartDataShownAsync, chartDataSelectedAsync, IChartDataItem, chartDataInfoHiddenAsync } from '../store/actions/chartDataItems';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { IChartDataItemsState } from '../store/reducers/chartDataItems';
import { ReduxState } from '../store';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import { IChartData } from './LandingPage';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';

interface IDrawerActions {
    drawerOpen: boolean;
    handleDrawerOpen: () => void;
    handleDrawerClose: () => void;
    itemSelected: string;
    handleItemSelected: (e: any) => void;
}

interface IInfoAreaProps {
    height: number
}

type IInfoAreaCombinedProps = IInfoAreaProps & WithStyles<typeof styles>;

const infoHeadComponent = (chartData: IChartData, props: IInfoAreaCombinedProps) => {
    const name = chartData.name.split(' ');
    const fn = name[0];
    name.shift();
    return (
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
    )
}

const infoDataComponent = (chartData: IChartData, props: IInfoAreaCombinedProps) => {
    return (
        <List >
            {chartData.films.map(film => {
                let votesString = '';
                if (film.imdbVotes) {
                    const votes = film.imdbVotes.toString();
                    for (let i = 0; i < votes.length; i++) {
                        (votes.length - i) % 3 === 0 && i !== 0
                            ? votesString += `,${votes[i]}`
                            : votesString += votes[i];
                    }
                }
                return (
                    <ListItem key={film.id}>
                        <ListItemText
                            primary={
                                <Link
                                    className={classNames(
                                        props.classes.linkColor,
                                        props.classes.listText
                                    )}
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
    )
}

const closedIconButton = (selectedIndex: number, chartDataItems: IChartDataItem[], drawerActions: IDrawerActions, props: IInfoAreaCombinedProps) => {
    return (
        <Grid className={props.classes.topClosed}>
            <Grid className={classNames(
                props.classes.buttonContainer,
                drawerActions.drawerOpen
                    ? props.classes.buttonContainerOpen
                    : props.classes.buttonContainerClosed
            )}>
                <IconButton
                    onClick={drawerActions.drawerOpen
                        ? drawerActions.handleDrawerClose
                        : drawerActions.handleDrawerOpen
                    }
                >
                    <InfoIcon
                        className={classNames(props.classes.icon, drawerActions.drawerOpen && props.classes.iconOpen)}
                    />
                </IconButton>
                {drawerActions.drawerOpen
                    ? itemSelection(selectedIndex, chartDataItems, drawerActions, props)
                    : undefined}
            </Grid>
        </Grid>
    )
}

const itemSelection = (selectedIndex: number, chartDataItems: IChartDataItem[], drawerActions: IDrawerActions, props: IInfoAreaCombinedProps) => {

    return (
        <FormControl variant="outlined">
            <InputLabel id="info_select_label"
                classes={{
                    root: props.classes.cssFocus,
                }}
            >
                Info
                </InputLabel>
            <Select
                labelId="info_select_label"
                id="info_select"
                className={props.classes.select}
                value={drawerActions.itemSelected}
                onChange={drawerActions.handleItemSelected}
                label="Age"
            >
                {chartDataItems.map(item => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                        classes={{ selected: props.classes.selectedItem }}
                    >
                        {item.data.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

const infoAreaComponent = (chartDataItems: IChartDataItem[], dispatch: Dispatch<any>, drawerActions: IDrawerActions, props: IInfoAreaCombinedProps) => {
    const selectedIndex = chartDataItems.findIndex(item => item.isSelected);
    let chartData: IChartDataItem | undefined = undefined;
    if (selectedIndex !== -1) {
        chartData = chartDataItems[selectedIndex];
    } else if (selectedIndex === -1 && chartDataItems.length) {
        dispatch(chartDataSelectedAsync(chartDataItems[0].id));
        chartData = chartDataItems[0];
    }
    return (
        <Grid>
            {closedIconButton(selectedIndex === -1 ? 0 : selectedIndex, chartDataItems, drawerActions, props)}
            {chartData && drawerActions.drawerOpen ?
                <Grid container
                    style={{ height: props.height - 100 }}
                    className={classNames(props.classes.infoArea)}>
                    {infoHeadComponent(chartData.data, props)}
                    <Divider variant="inset" className={props.classes.divider} />
                    <Grid id='info_scroll_area' item
                        style={{ height: props.height - 250 }}
                        className={props.classes.infoAreaBottom}
                    >
                        {infoDataComponent(chartData.data, props)}
                    </Grid>
                </Grid>
                : undefined}
        </Grid>

    )
}

const InfoArea: React.FunctionComponent<IInfoAreaCombinedProps> = (props: IInfoAreaCombinedProps) => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [itemSelected, setItemSelected] = useState<string>('');

    const chartDataItems: IChartDataItem[] = useSelector((state: ReduxState) => state.chartDataItemsReducer.chartDataItems);
    const dispatch = useDispatch();

    const handleDrawerOpen = () => {
        chartDataItems.length && setDrawerOpen(true);
    }

    const handleDrawerClosed = () => {
        setDrawerOpen(false);
        dispatch(chartDataInfoHiddenAsync())
    }

    const handleItemSelected = (event: any) => {
        setItemSelected(event.target.value);
        dispatch(chartDataSelectedAsync(event.target.value));
    }

    const drawerActions: IDrawerActions = {
        drawerOpen: drawerOpen,
        handleDrawerOpen: handleDrawerOpen,
        handleDrawerClose: handleDrawerClosed,
        itemSelected: itemSelected,
        handleItemSelected: handleItemSelected
    }

    useEffect(() => {
        const changedIndex = chartDataItems.findIndex(item => item.isInfoOpen);
        if (changedIndex !== -1) {
            !drawerOpen && setDrawerOpen(true);
            setItemSelected(chartDataItems[changedIndex].data.name.toLowerCase());
        }
    }, [chartDataItems])


    return (
        <Grid container className={classNames(
            props.classes.root,
            drawerActions.drawerOpen
                ? props.classes.rootOpen
                : props.classes.rootClosed
        )}>
            {infoAreaComponent(chartDataItems, dispatch, drawerActions, props)}
        </Grid>
    );
}

export default withStyles(styles)(InfoArea);