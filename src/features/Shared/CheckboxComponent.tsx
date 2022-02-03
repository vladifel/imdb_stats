import React, { FC } from "react";
import { Checkbox, ListItemIcon, Tooltip } from "@material-ui/core";

interface ICheckboxComponentProps {
  isChecked: boolean;
  title: string;

  onChange: () => void;
}

const CheckboxComponent: FC<ICheckboxComponentProps> = ({
  isChecked,
  title,
  onChange,
}: ICheckboxComponentProps) => {
  return (
    <Tooltip title={title}>
      <ListItemIcon style={{ marginRight: "0.5rem" }}>
        <Checkbox edge="start" checked={isChecked} disableRipple onChange={onChange} />
      </ListItemIcon>
    </Tooltip>
  );
};

export default CheckboxComponent;
