import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Checkbox, ListItemIcon, Tooltip } from "@material-ui/core";

import { chartDataShown } from "../../store/actions/chartDataItems";
import { styles } from "./EntriesList.styles";

interface ICheckboxComponentProps {
  id: string;
  isShown: boolean;
}

type ICheckboxComponentCombinedProps = ICheckboxComponentProps & WithStyles<typeof styles>;

const CheckboxComponent: FC<ICheckboxComponentCombinedProps> = ({
  id,
  isShown,
  classes,
}: ICheckboxComponentCombinedProps) => {
  const dispatch = useDispatch();
  return (
    <Tooltip title="Hide from chart">
      <ListItemIcon className={classes.iconsRightMargin}>
        <Checkbox
          edge="start"
          checked={isShown}
          disableRipple
          onChange={() => dispatch(chartDataShown(id, !isShown))}
        />
      </ListItemIcon>
    </Tooltip>
  );
};

export default withStyles(styles)(CheckboxComponent);
