import React, { FC } from "react";
import { ColorResult } from "react-color";

import ColorSelectorPopover from "./ColorSelectorPopover";

interface IColorSelectorProps {
  color: string;
  disabled?: boolean;
  name?: string;

  colorChange: (color: ColorResult, elementName: string | undefined) => void;
}

const ColorSelector: FC<IColorSelectorProps> = ({
  color,
  disabled,
  name,
  colorChange,
}: IColorSelectorProps) => {
  const [anchorColorSelector, setAnchorColorSelector] = React.useState<Element | null>(null);

  const handleColorSelectorIconClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorColorSelector(event.currentTarget);
  };

  const handleColorSelectorClose = () => {
    setAnchorColorSelector(null);
  };

  const onColorSelected = (newColor: ColorResult) => {
    colorChange(newColor, name);
  };

  return (
    <ColorSelectorPopover
      anchorColorSelector={anchorColorSelector}
      color={color}
      disabled={disabled}
      name={name}
      handleColorSelectorIconClick={handleColorSelectorIconClick}
      handleColorSelectorClose={handleColorSelectorClose}
      onColorSelected={onColorSelected}
    />
  );
};

export default ColorSelector;
