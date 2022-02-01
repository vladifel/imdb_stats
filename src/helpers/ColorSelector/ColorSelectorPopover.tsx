import React, { FC } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { Grid, Popover } from "@material-ui/core";

import ColorSelectorButton from "./ColorSelectorButton";

interface IColorSelectorPopoverProps {
  color: string;
  disabled?: boolean;
  name?: string;
  anchorColorSelector?: Element | null;

  onColorSelected: (color: ColorResult) => void;
  handleColorSelectorIconClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleColorSelectorClose: () => void;
}

const ColorSelectorPopover: FC<IColorSelectorPopoverProps> = ({
  anchorColorSelector,
  color,
  disabled,
  name,
  handleColorSelectorIconClick,
  handleColorSelectorClose,
  onColorSelected,
}: IColorSelectorPopoverProps) => {
  return (
    <Grid>
      <ColorSelectorButton
        anchorColorSelector={anchorColorSelector}
        color={color}
        disabled={disabled}
        name={name}
        handleColorSelectorIconClick={handleColorSelectorIconClick}
      />
      <Popover
        id="ColorSelector-popper"
        open={Boolean(anchorColorSelector)}
        anchorEl={anchorColorSelector}
        onClose={handleColorSelectorClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
      >
        <ChromePicker color={color} disableAlpha={true} onChange={onColorSelected} />
      </Popover>
    </Grid>
  );
};

export default ColorSelectorPopover;
