import React, { FC } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

interface IEraseIconComponentProps {
  title: string;

  onClick: () => void;
}

const EraseIconComponent: FC<IEraseIconComponentProps> = ({
  title,
  onClick,
}: IEraseIconComponentProps) => {
  return (
    <Tooltip title={title} enterDelay={500} enterNextDelay={500}>
      <IconButton edge="end" disableFocusRipple onClick={onClick}>
        <DeleteOutlineOutlinedIcon style={{ fontSize: "1.7rem" }} />
      </IconButton>
    </Tooltip>
  );
};

export default EraseIconComponent;
