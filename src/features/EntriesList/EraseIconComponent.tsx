import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

import { chartDataRemoved } from "../../store/actions/chartDataItems";
import { styles } from "./EntriesList.styles";

interface IEraseIconComponentProps {
  id: string;
}

type IEraseIconComponentCombinedProps = IEraseIconComponentProps & WithStyles<typeof styles>;

const EraseIconComponent: FC<IEraseIconComponentCombinedProps> = ({
  id,
  classes,
}: IEraseIconComponentCombinedProps) => {
  const dispatch = useDispatch();

  return (
    <Tooltip title="Remove from chart" enterDelay={500} enterNextDelay={500}>
      <IconButton edge="end" disableFocusRipple onClick={() => dispatch(chartDataRemoved(id))}>
        <DeleteOutlineOutlinedIcon className={classes.icon} />
      </IconButton>
    </Tooltip>
  );
};

export default withStyles(styles)(EraseIconComponent);
