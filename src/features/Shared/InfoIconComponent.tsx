import React, { FC } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

interface IInfoIconComponentProps {
  title: string;

  onClick: () => void;
}

const InfoIconComponent: FC<IInfoIconComponentProps> = ({
  title,
  onClick,
}: IInfoIconComponentProps) => {
  return (
    <Tooltip title={title} placement="top" enterDelay={500} enterNextDelay={500}>
      <IconButton edge="end" disableFocusRipple onClick={onClick}>
        <InfoOutlinedIcon style={{ fontSize: "1.7rem" }} />
      </IconButton>
    </Tooltip>
  );
};

export default InfoIconComponent;
