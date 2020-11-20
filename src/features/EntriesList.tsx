import React, { Dispatch } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { styles } from './EntriesList.styles';
import { chartDataColorChangedAsync, chartDataInfoShown, chartDataRemovedAsync, chartDataShownAsync, IChartDataItem } from '../store/actions/chartDataItems';
import { useDispatch, useSelector } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ReduxState } from '../store';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import ColorSelector from '../helpers/ColorSelector';
import { ColorResult } from 'react-color';

interface IEntriesListProps {

}

type IEntriesListCombinedProps = IEntriesListProps & WithStyles<typeof styles>;

const checkboxComponent = (entry: IChartDataItem, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    return (
        <ListItemIcon className={props.classes.iconsRightMargin}>
            <Checkbox
                edge="start"
                checked={entry.isShown}
                disableRipple
                onChange={() => dispatch(chartDataShownAsync(entry.id, !entry.isShown))}
            />
        </ListItemIcon>
    )
}

const lensIconComponent = (entry: IChartDataItem, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    const handleColorChange = (color: ColorResult, id: string | undefined) => {
        id && dispatch(chartDataColorChangedAsync(id, color.hex))
    }
    return (
        <ListItemIcon className={props.classes.colorIcon}>
            <ColorSelector
                //className={props.classes.smallIcon}
                color={entry.color}
                name={entry.id}
                colorChange={handleColorChange}
            />
        </ListItemIcon>
    )
}

const infoIconComponent = (entry: IChartDataItem, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    return (
        <IconButton
            edge="end"
            disableFocusRipple
            onClick={() => dispatch(chartDataInfoShown(entry.id))}
        >
            <InfoOutlinedIcon
                className={props.classes.icon}
            />
        </IconButton>
    )
}

const eraseIconComponent = (entry: IChartDataItem, dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    return (
        <IconButton
            edge="end"
            disableFocusRipple
            onClick={() => dispatch(chartDataRemovedAsync(entry.id))}
        >
            <DeleteOutlineOutlinedIcon
                className={props.classes.icon}
            />
        </IconButton>
    )
}
const entriesListComponent = (entries: IChartDataItem[], dispatch: Dispatch<any>, props: IEntriesListCombinedProps) => {
    console.log(entries)
    return (
        <List>
            {  entries && entries.map(entry => (
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
                                <Typography
                                    className={props.classes.text}
                                >
                                    {entry.data.name}
                                </Typography>
                            </Tooltip>} />
                    <ListItemSecondaryAction>
                        <Grid container className={props.classes.rightContainer}>
                            <Grid item>
                                {infoIconComponent(entry, dispatch, props)}
                            </Grid>
                            <Grid item>
                                {eraseIconComponent(entry, dispatch, props)}
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    )
}

const EntriesList: React.FunctionComponent<IEntriesListCombinedProps> = (props: IEntriesListCombinedProps) => {
    const chartDataItems: IChartDataItem[] = useSelector((state: ReduxState) => state.chartDataItemsReducer.chartDataItems);
    const dispatch = useDispatch();

    return (
        <Grid container className={props.classes.page}>
            {entriesListComponent(chartDataItems, dispatch, props)}
        </Grid>
    );
}

export default withStyles(styles)(EntriesList);