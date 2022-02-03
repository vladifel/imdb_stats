import React, { FC } from "react";
import { IconButton, Tooltip } from "@material-ui/core";

interface ICloseIconButtonProps {
  title: string;
  children: JSX.Element;

  handleIconClick: () => void;
}

const CloseIconButton: FC<ICloseIconButtonProps> = ({
  title,
  children,
  handleIconClick,
}: ICloseIconButtonProps) => {
  return (
    <Tooltip title={title} placement="left" enterDelay={500} enterNextDelay={500}>
      <IconButton onClick={handleIconClick}>{children} </IconButton>
    </Tooltip>
  );
};

export default CloseIconButton;
