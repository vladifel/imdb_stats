import React, { FC } from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core";

import FormLine from "./FormLine";

const styles = () =>
  createStyles({
    list: {
      width: "12.5rem",
      margin: "0",
      padding: "0",
      backgroundColor: "white",
    },
  });

interface IFormListProps {
  searchText: string | undefined;
  filteredData: string[];
  rowVirtualizer: any;

  setDropDownOpen: (open: boolean) => void;
  handleLineClicked: (module: any) => void;
}

type IFormListCombinedProps = IFormListProps & WithStyles<typeof styles>;

const FormList: FC<IFormListCombinedProps> = ({
  searchText,
  filteredData,
  rowVirtualizer,
  setDropDownOpen,
  handleLineClicked,
  classes,
}: IFormListCombinedProps) => {
  return (
    <List
      className={classes.list}
      style={{
        height: `${rowVirtualizer.totalSize / 16}rem`,
        position: "relative",
      }}
    >
      {filteredData.length > 0 &&
        rowVirtualizer.virtualItems.map((virtualRow: any) => (
          <FormLine
            key={virtualRow.index}
            searchText={searchText}
            module={filteredData[virtualRow.index]}
            virtualRow={virtualRow}
            setDropDownOpen={setDropDownOpen}
            handleLineClicked={handleLineClicked}
          />
        ))}
    </List>
  );
};

export default withStyles(styles)(FormList);
