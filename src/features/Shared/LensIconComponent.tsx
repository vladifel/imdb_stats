import React, { FC } from "react";
import { ColorResult } from "react-color";
import { ListItemIcon } from "@material-ui/core";

import ColorSelector from "../../utils/ColorSelector/ColorSelector";

interface ILensIconComponentProps {
  name: string;
  color: string;

  onColorChange: (color: string) => void;
}

const LensIconComponent: FC<ILensIconComponentProps> = ({
  name,
  color,
  onColorChange,
}: ILensIconComponentProps) => {
  const handleColorChange = (color: ColorResult) => {
    onColorChange(color.hex);
  };
  return (
    <ListItemIcon style={{ marginRight: "1rem" }}>
      <ColorSelector color={color} name={name} colorChange={handleColorChange} />
    </ListItemIcon>
  );
};

export default LensIconComponent;
