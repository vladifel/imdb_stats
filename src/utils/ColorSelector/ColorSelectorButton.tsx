import React, { FC } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import LensIcon from "@material-ui/icons/Lens";

interface IColorSelectorButtonProps {
  anchorColorSelector: Element | null | undefined;
  color: string;
  disabled?: boolean;
  name?: string;

  handleColorSelectorIconClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ColorSelectorButton: FC<IColorSelectorButtonProps> = ({
  anchorColorSelector,
  color,
  disabled,
  name,
  handleColorSelectorIconClick,
}: IColorSelectorButtonProps) => {
  return (
    <Tooltip
      key={`${name}_color_selector`}
      title="Select Color"
      enterDelay={500}
      enterNextDelay={500}
    >
      <div
        style={{
          border: "0.02rem solid black",
          borderRadius: "1rem",
          width: "1.2rem",
          height: "1.2rem",
        }}
      >
        <IconButton
          aria-owns={anchorColorSelector ? "ColorSelector-popper" : undefined}
          aria-haspopup="true"
          color="primary"
          style={{ color: color, width: "1.2rem", height: "1.2rem", marginBottom: "0.5rem" }}
          onClick={handleColorSelectorIconClick}
          disabled={disabled}
          id={`${name}_color_button`}
        >
          <LensIcon />
        </IconButton>
      </div>
    </Tooltip>
  );
};

export default ColorSelectorButton;
