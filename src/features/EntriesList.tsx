import React, { Dispatch, Fragment } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { styles } from './EntriesList.styles';
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import {
    chartDataColorChangedAsync,
    chartDataInfoShown,
    chartDataRemovedAsync,
    chartDataShownAsync,
    IChartDataItem
} from '../store/actions/chartDataItems';
import { ReduxState } from '../store';
import ColorSelector from '../helpers/ColorSelector';
import { ColorResult } from 'react-color';
import { infoAreaOpenAsync } from '../store/actions/openInfo';
import LinearProgress from '@material-ui/core/LinearProgress';

interface IEntriesListProps {

}

type IEntriesListCombinedProps = IEntriesListProps & WithStyles<typeof styles>;

const checkboxComponent = (entry: IChartDataItem, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    return (
        <Tooltip
            title='Hide from chart'
        >
            <ListItemIcon className={props.classes.iconsRightMargin}>
                <Checkbox
                    edge="start"
                    checked={entry.isShown}
                    disableRipple
                    onChange={() => dispatch(chartDataShownAsync(entry.id, !entry.isShown))}
                />
            </ListItemIcon>
        </Tooltip>
    )
}

const lensIconComponent = (entry: IChartDataItem, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    const handleColorChange = (color: ColorResult, id: string | undefined) => {
        id && dispatch(chartDataColorChangedAsync(id, color.hex))
    }
    return (
        <Tooltip
            title='Change color'
            enterDelay={500}
            enterNextDelay={500}
        >
            <ListItemIcon className={props.classes.colorIcon}>
                <ColorSelector
                    color={entry.color}
                    name={entry.id}
                    colorChange={handleColorChange}
                />
            </ListItemIcon>
        </Tooltip>
    )
}

const infoIconComponent = (entry: IChartDataItem, infoAreaOpen: boolean, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    return (
        <Tooltip
            title='Open artist info'
            placement='top'
            enterDelay={500}
            enterNextDelay={500}
        >
            <IconButton
                edge="end"
                disableFocusRipple
                onClick={() => {
                    dispatch(chartDataInfoShown(entry.id))
                    !infoAreaOpen && dispatch(infoAreaOpenAsync(true))
                }}
            >
                <InfoOutlinedIcon
                    className={props.classes.icon}
                />
            </IconButton>
        </Tooltip>
    )
}

const eraseIconComponent = (entry: IChartDataItem, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    return (
        <Tooltip
            title='Remove from chart'
            enterDelay={500}
            enterNextDelay={500}
        >
            <IconButton
                edge="end"
                disableFocusRipple
                onClick={() => dispatch(chartDataRemovedAsync(entry.id))}
            >
                <DeleteOutlineOutlinedIcon
                    className={props.classes.icon}
                />
            </IconButton>
        </Tooltip>
    )
}
const entriesListComponent = (entries: IChartDataItem[], infoAreaOpen: boolean, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    return (
        <List>
            {  entries && entries.map((entry, i) => {

                return (
                    <ListItem
                        key={entry.id}
                        className={props.classes.itemContainer}
                    >
                        {checkboxComponent(entry, dispatch, props)}
                        {lensIconComponent(entry, dispatch, props)}
                        <ListItemText
                            primary={
                                <Tooltip
                                    title={entry.data.name}
                                    enterDelay={500}
                                    enterNextDelay={500}
                                >
                                    <Fragment>
                                        {entry.isLoading ?
                                            <LinearProgress
                                                color={'secondary'}
                                                style={{ width: '7rem' }}
                                            /> : undefined}
                                        <Typography
                                            className={props.classes.text}
                                        >
                                            {entry.data.name}
                                        </Typography>
                                    </Fragment>
                                </Tooltip>} />
                        <ListItemSecondaryAction>
                            <Grid container className={props.classes.rightContainer}>
                                <Grid item>
                                    {infoIconComponent(entry, infoAreaOpen, dispatch, props)}
                                </Grid>
                                <Grid item>
                                    {eraseIconComponent(entry, dispatch, props)}
                                </Grid>
                            </Grid>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}

const EntriesList: React.FunctionComponent<IEntriesListCombinedProps> = (props: IEntriesListCombinedProps) => {
    const chartDataItems: IChartDataItem[] = useSelector((state: ReduxState) => state.chartDataItemsReducer.chartDataItems);
    const infoAreaOpen: boolean = useSelector((state: ReduxState) => state.openInfoReducer.isInfoOpen);
    const dispatch = useDispatch();

    return (
        <Grid container className={props.classes.page}>
            {entriesListComponent(chartDataItems, infoAreaOpen, dispatch, props)}
        </Grid>
    );
}

export default withStyles(styles)(EntriesList);