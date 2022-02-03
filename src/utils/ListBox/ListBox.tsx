import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { useVirtual } from "react-virtual";
import {
  ClickAwayListener,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";

import { IPersonData } from "../../features/types";
import FormList from "./FormList";

const styles = () =>
  createStyles({
    cssFocus: {
      "&.Mui-focused": {
        color: "#f3ce13",
      },
    },
    divider: {
      marginTop: "0.5rem",
      marginLeft: 0,
    },
    listGrid: {
      minHeight: "0",
      maxHeight: "18.125rem",
      overflow: "auto",
      position: "absolute",
      marginTop: "4rem",
      zIndex: 999,
    },
  });

const useOutlinedInputStyles = makeStyles(() => ({
  root: {
    "&:hover $notchedOutline": {
      borderColor: "rgba(243, 206, 19, 0.7)",
    },
    "&$focused $notchedOutline": {
      borderColor: "#f3ce13",
    },
  },
  focused: {},
  notchedOutline: {},
}));

export interface IListBoxProps {
  dataMap: Map<string, IPersonData> | undefined;
  value: string | undefined;

  handleLineClicked: (module: any) => void;
}

type IListBoxCombinedProps = IListBoxProps & WithStyles<typeof styles>;

const ListBox: FC<IListBoxCombinedProps> = ({
  dataMap,
  value,
  handleLineClicked,
  classes,
}: IListBoxCombinedProps) => {
  const outlinedInputClasses = useOutlinedInputStyles();
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<string[]>([]);

  const scrollAreaRef = useRef<any>(null);

  const data = useMemo(() => dataMap, [dataMap]);

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (!event) {
      setDropDownOpen(false);
      return;
    }
    const val = event.target.value.toLowerCase();
    setSearchText(val);
    const foundData: string[] = [];
    if (data) {
      for (const key of data.keys()) {
        key.includes(val) && foundData.push(data.get(key)!.Name);
      }
    }

    if (foundData.length) {
      setFilteredData(foundData);
      setDropDownOpen(true);
    }

    setFilteredData(foundData);
    if (scrollAreaRef !== null && scrollAreaRef.current !== null) {
      (scrollAreaRef.current as any).scrollTop = 0;
    }
  };

  const handleClearSearchText = () => {
    setDropDownOpen(false);
    setSearchText(undefined);
    setFilteredData([]);
  };

  const parentRef = useRef<any>();

  const rowVirtualizer = useVirtual({
    size: filteredData.length,
    parentRef,
    estimateSize: useCallback(() => 36, []),
    overscan: 8,
  });

  useEffect(() => setSearchText(value), [value]);

  return (
    <Grid container direction={"column"}>
      <Grid item>
        <ClickAwayListener onClickAway={() => setDropDownOpen(false)}>
          <FormControl variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment"
              classes={{
                root: classes.cssFocus,
              }}
            >
              Director's Name
            </InputLabel>
            <OutlinedInput
              autoComplete="off"
              id="outlined-adornment"
              value={searchText ?? ""}
              onChange={handleSearchTextChange}
              classes={outlinedInputClasses}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearchText}>
                    <Clear />
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={105}
            />
          </FormControl>
        </ClickAwayListener>
      </Grid>
      <Grid ref={parentRef} className={classes.listGrid}>
        {dropDownOpen && <Divider variant="inset" className={classes.divider} /> && (
          <FormList
            searchText={searchText}
            filteredData={filteredData}
            rowVirtualizer={rowVirtualizer}
            setDropDownOpen={setDropDownOpen}
            handleLineClicked={handleLineClicked}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListBox);
