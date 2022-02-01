import React, { FC } from "react";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

import { IChartDataItem } from "../../store/actions/chartDataItems";
import { styles } from "./InfoArea.styles";

interface IItemSelectionProps {
  chartDataItems: IChartDataItem[];
  itemSelected: string;
  handleItemSelected: (e: any) => void;
}

type IItemSelectionCombinedProps = IItemSelectionProps & WithStyles<typeof styles>;

const ItemSelection: FC<IItemSelectionCombinedProps> = ({
  chartDataItems,
  itemSelected,
  handleItemSelected,
  classes,
}: IItemSelectionCombinedProps) => {
  return (
    <FormControl variant="outlined">
      <InputLabel
        id="info_select_label"
        classes={{
          root: classes.cssFocus,
        }}
      >
        Info
      </InputLabel>
      <Select
        labelId="info_select_label"
        id="info_select"
        className={classes.select}
        value={itemSelected}
        onChange={handleItemSelected}
      >
        {chartDataItems.map(({ id, data }) => (
          <MenuItem
            key={id}
            value={id}
            classes={{
              root: classes.selectedItemRoot,
              selected: classes.selectedItem,
            }}
          >
            {data.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default withStyles(styles)(ItemSelection);
