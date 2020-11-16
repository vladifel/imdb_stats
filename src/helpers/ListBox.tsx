import React, { Fragment, useCallback, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Clear from "@material-ui/icons/Clear";
import { useVirtual } from "react-virtual";
import HighlightSearchText from "./HighlightSearchText";
import { useEffect } from 'react';
const styles = () =>
    createStyles({
        cssFocus: {
            '&.Mui-focused': {
                color: "#f3ce13",
                //fontWeight: 1000
            },
        },
        divider: {
            marginTop: '0.5rem',
            marginLeft: 0,
        },
        list: {
            width: '14.5rem',
            margin: '0',
            padding: '0',
            backgroundColor: 'white'
        },
        listGrid: {
            minHeight: '0',
            maxHeight: '18.125rem',
            overflow: 'auto',
            position: 'absolute',
            marginTop: '4rem',
            zIndex: 999
        },
        listNestedItem: {
            padding: '0.2rem 0',
            width: 'auto',
            "&:active, &:focus, &:hover, &.Mui-focusVisible": {
                backgroundColor: 'rgba(243, 206, 19, 0.7)',
            },
        },
        listNestedItemContainer: {
            height: '2.25rem',
            padding: '0 0.625rem',
        },
        listNestedItemDescription: {
            padding: '0 0 0.125rem 0',
        },
        listNestedItemName: {
            color: '#808080',
            padding: 0,
        },
        listNestedItemText: {
            fontSize: '0.8125rem',
        },
        scrollArea: {
            zIndex: 1,
            paddingRight: '0.625rem',
        }
    });

const useOutlinedInputStyles = makeStyles(() => ({
    root: {
        "&:hover $notchedOutline": {
            borderColor: "rgba(243, 206, 19, 0.7)"
        },
        "&$focused $notchedOutline": {
            borderColor: "#f3ce13"
        }
    },
    focused: {},
    notchedOutline: {}
}));

export interface IListBoxProps {
    dataMap: any[];
    value: string;
    handleLineClicked: (module: any) => void;
}

type IListBoxCombinedProps = IListBoxProps & WithStyles<typeof styles>;

const highlightedText = (searchText: string, text: string) => {
    return (
        !searchText || searchText === ''
            ? text
            : <HighlightSearchText
                text={text}
                highlight={searchText}
                highlightBackground={true}
            />)
}

const formLine = (searchText: string, module: any, virtualRow: any, setDropDownOpen: (open: boolean) => void, props: IListBoxCombinedProps) => {
    const { classes } = props;
    return (
        <ListItem id={"meta_" + module.name}
            key={virtualRow.index}
            button={true}
            divider={true}
            draggable={true}
            className={classes.listNestedItem}
            onClick={() => {
                setDropDownOpen(false);
                props.handleLineClicked(module);
            }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `2.25rem`,
                transform: `translateY(${virtualRow.start / 16}rem`,
            }}
        >
            <Grid container direction='column' className={classes.listNestedItemContainer}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Tooltip placement='right'
                        title={
                            <Fragment>
                                <Typography variant='h5'
                                    noWrap
                                    style={{ fontSize: `0.6875rem` }}
                                >
                                    {module}
                                </Typography>
                            </Fragment>
                        }
                    >
                        <ListItemText disableTypography
                            primary={
                                <Typography component="div"
                                    variant='h4'
                                    noWrap
                                    className={classNames(classes.listNestedItemText, classes.listNestedItemDescription)}
                                >
                                    {highlightedText(searchText, module)}
                                </Typography>
                            }
                        />
                    </Tooltip>
                </Grid>
            </Grid>
        </ListItem>
    )
};

const formList = (searchText: string, filteredData: string[], rowVirtualizer: any, parentRef: any, setDropDownOpen: (open: boolean) => void, props: IListBoxCombinedProps) => {
    const { classes } = props;
    return (
        <List
            className={classes.list}
            style={{
                height: `${(rowVirtualizer.totalSize / 16)}rem`,
                position: "relative",
            }}
        >
            {filteredData.length > 0 && rowVirtualizer.virtualItems.map((virtualRow: any) => {
                const row = filteredData[virtualRow.index];
                return formLine(searchText, row, virtualRow, setDropDownOpen, props)
            })}
        </List>
    );
};

const ListBox: React.FunctionComponent<IListBoxCombinedProps> = (props: IListBoxCombinedProps) => {
    const { classes } = props;
    const outlinedInputClasses = useOutlinedInputStyles();
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<string[]>([]);

    const scrollAreaRef = useRef<any>(null);
    const data = useMemo(() => props.dataMap, [props.dataMap]);

    const handleSearchTextChange = (event: any) => {
        const val = event.target.value.toLowerCase();
        setSearchText(val);
        const foundData: string[] = [];
        Object.keys(data).forEach(key => {
            if (key.includes(val)) {
                foundData.push(key);
            }
        });
        if (foundData.length) {
            setFilteredData(foundData);
            setDropDownOpen(true);
        }
        setFilteredData(foundData);
        if (scrollAreaRef !== null && scrollAreaRef.current !== null) {
            (scrollAreaRef.current as any).scrollTop = 0;
        }
    }

    const handleClearSearchText = () => {
        setDropDownOpen(false);
        setSearchText('');
        setFilteredData([]);
    }

    const parentRef = useRef<any>();

    const rowVirtualizer = useVirtual({
        size: filteredData.length,
        parentRef,
        estimateSize: useCallback(() => 36, []),
        overscan: 8,
    });

    useEffect(() => setSearchText(props.value || ''), [props.value]);

    return (
        <Grid container direction={"column"}>
            <Grid item>
                <ClickAwayListener onClickAway={() => setDropDownOpen(false)}>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment"
                            classes={{
                                root: props.classes.cssFocus,
                            }}
                        >
                            Names
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment"
                            value={searchText}
                            onChange={handleSearchTextChange}
                            classes={outlinedInputClasses}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearchText}>
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={45}
                        />
                    </FormControl>
                </ClickAwayListener>
            </Grid>
            <Grid ref={parentRef}
                className={classes.listGrid}
            >
                {dropDownOpen &&
                    <Divider variant="inset" className={classes.divider} /> &&
                    formList(searchText, filteredData, rowVirtualizer, parentRef, setDropDownOpen, props)
                }
            </Grid>
        </Grid>
    )
};

export default withStyles(styles)(ListBox);