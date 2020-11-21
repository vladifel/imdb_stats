import React, { useEffect, useState } from 'react';
import classNames from "classnames";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { styles } from './InfoArea.styles';
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { chartDataInfoShown, IChartDataItem, chartDataInfoHiddenAsync } from '../store/actions/chartDataItems';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ReduxState } from '../store';
import { IChartData } from './LandingPage';
import { infoAreaOpenAsync } from '../store/actions/openInfo';
import { getVotesString } from '../helpers/getVotesString';

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
                const votesString = film.imdbVotes ? getVotesString(film.imdbVotes) : '';
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

const closedIconButton = (chartDataItems: IChartDataItem[], drawerActions: IDrawerActions, props: IInfoAreaCombinedProps) => {
    return (
        <Grid className={props.classes.topClosed}>
            <Grid className={classNames(
                props.classes.buttonContainer,
                drawerActions.drawerOpen
                    ? props.classes.buttonContainerOpen
                    : props.classes.buttonContainerClosed
            )}>
                <Tooltip
                    title={`${drawerActions.drawerOpen ? 'Close' : 'Open'} artist info`}
                    placement='left'
                    enterDelay={500}
                    enterNextDelay={500}
                >
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
                </Tooltip>
                {drawerActions.drawerOpen
                    ? itemSelection(chartDataItems, drawerActions, props)
                    : undefined}
            </Grid>
        </Grid>
    )
}

const itemSelection = (chartDataItems: IChartDataItem[], drawerActions: IDrawerActions, props: IInfoAreaCombinedProps) => {
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
            >
                {chartDataItems.map(item => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                        classes={{ 
                            root: props.classes.selectedItemRoot,
                            selected: props.classes.selectedItem 
                        }}
                    >
                        {item.data.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

const infoAreaComponent = (chartDataItems: IChartDataItem[], drawerActions: IDrawerActions, props: IInfoAreaCombinedProps) => {
const dataIndex = chartDataItems.findIndex(item => item.id === drawerActions.itemSelected);
const dataToShow = chartDataItems[dataIndex];
    return (
        <Grid>
            {closedIconButton(chartDataItems, drawerActions, props)}
            {dataToShow && drawerActions.drawerOpen ?
                <Grid container
                    style={{ height: props.height - 100 }}
                    className={classNames(props.classes.infoArea)}>
                    {infoHeadComponent(dataToShow.data, props)}
                    <Divider variant="inset" className={props.classes.divider} />
                    <Grid id='info_scroll_area' item
                        style={{ height: props.height - 250 }}
                        className={props.classes.infoAreaBottom}
                    >
                        {infoDataComponent(dataToShow.data, props)}
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
    const infoAreaOpen: boolean = useSelector((state: ReduxState) => state.openInfoReducer.isInfoOpen);

    const dispatch = useDispatch();

    const handleDrawerOpen = () => {
        chartDataItems.length && setDrawerOpen(true);
        dispatch(infoAreaOpenAsync(true));
    }

    const handleDrawerClosed = () => {
        dispatch(chartDataInfoHiddenAsync());
        dispatch(infoAreaOpenAsync(false));
        setDrawerOpen(false);
    }

    const handleItemSelected = (event: any) => {
        console.log(event.target.value)
        setItemSelected(event.target.value);
        dispatch(chartDataInfoShown(event.target.value));
    }

    const drawerActions: IDrawerActions = {
        drawerOpen: drawerOpen,
        handleDrawerOpen: handleDrawerOpen,
        handleDrawerClose: handleDrawerClosed,
        itemSelected: itemSelected,
        handleItemSelected: handleItemSelected
    }

    useEffect(() => {
        if (infoAreaOpen !== drawerOpen) {
            setDrawerOpen(infoAreaOpen);
        }
    }, [infoAreaOpen]);

    useEffect(() => {
        if (drawerOpen) {
            const changedIndex = chartDataItems.findIndex(item => item.isInfoOpen);
            if (changedIndex === -1) {
                setItemSelected(chartDataItems[0].id);
                dispatch(chartDataInfoShown(chartDataItems[0].id));
            } else {
                setItemSelected(chartDataItems[changedIndex].id);
            }
        }
    }, [drawerOpen]);

    useEffect(() => {
        if (drawerOpen) {
            const changedIndex = chartDataItems.findIndex(item => item.isInfoOpen);
            const selectedChartItem = chartDataItems[changedIndex].id;
            selectedChartItem !== itemSelected && setItemSelected(selectedChartItem);
        }
    }, [chartDataItems]);

    return (
        <Grid container className={classNames(
            props.classes.root,
            drawerActions.drawerOpen
                ? props.classes.rootOpen
                : props.classes.rootClosed
        )}>
            {infoAreaComponent(chartDataItems, drawerActions, props)}
        </Grid>
    );
}

export default withStyles(styles)(InfoArea);