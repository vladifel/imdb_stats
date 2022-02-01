import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { ColorResult } from "react-color";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { ListItemIcon } from "@material-ui/core";

import { chartDataColorChanged } from "../../store/actions/chartDataItems";
import ColorSelector from "../../helpers/ColorSelector/ColorSelector";
import { styles } from "./EntriesList.styles";

interface ILensIconComponentProps {
  id: string;
  color: string;
}

type ILensIconComponentCombinedProps = ILensIconComponentProps & WithStyles<typeof styles>;

const LensIconComponent: FC<ILensIconComponentCombinedProps> = ({
  id,
  color,
  classes,
}: ILensIconComponentCombinedProps) => {
  const dispatch = useDispatch();

  const handleColorChange = (color: ColorResult, id: string | undefined) => {
    id && dispatch(chartDataColorChanged(id, color.hex));
  };
  return (
    <ListItemIcon className={classes.colorIcon}>
      <ColorSelector color={color} name={id} colorChange={handleColorChange} />
    </ListItemIcon>
  );
};

export default withStyles(styles)(LensIconComponent);
