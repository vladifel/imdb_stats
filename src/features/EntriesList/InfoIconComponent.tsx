import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { IconButton, Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import { ReduxState } from "../../store";
import { infoAreaOpen } from "../../store/actions/openInfo";
import { chartDataInfoShown } from "../../store/actions/chartDataItems";
import { styles } from "./EntriesList.styles";

interface IInfoIconComponentProps {
  id: string;
}

type IInfoIconComponentCombinedProps = IInfoIconComponentProps & WithStyles<typeof styles>;

const InfoIconComponent: FC<IInfoIconComponentCombinedProps> = ({
  id,
  classes,
}: IInfoIconComponentCombinedProps) => {
  const dispatch = useDispatch();

  const isInfoAreaOpen: boolean = useSelector(
    (state: ReduxState) => state.openInfoReducer.isInfoOpen
  );
  return (
    <Tooltip title="Open artist info" placement="top" enterDelay={500} enterNextDelay={500}>
      <IconButton
        edge="end"
        disableFocusRipple
        onClick={() => {
          dispatch(chartDataInfoShown(id));
          !isInfoAreaOpen && dispatch(infoAreaOpen(true));
        }}
      >
        <InfoOutlinedIcon className={classes.icon} />
      </IconButton>
    </Tooltip>
  );
};

export default withStyles(styles)(InfoIconComponent);
