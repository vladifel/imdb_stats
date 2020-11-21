import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import LensIcon from "@material-ui/icons/Lens";
import React from "react";
import { ChromePicker, ColorResult } from "react-color";

const styles = () =>
    createStyles({
        root: {
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            justifyContent: "space-around",
            overflowY: "hidden"
        }
    });

export interface IColorSelectorProps {
    color: string;
    className?: string;
    disabled?: boolean;
    name?: string;

    colorChange: (color: ColorResult, elementName: string | undefined) => void;
}

export type IStyledColorSelectorProps = IColorSelectorProps & WithStyles<typeof styles>;

const colorSelectorButton = (
    anchorColorSelector: Element | null | undefined,
    handleColorSelectorIconClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    props: IStyledColorSelectorProps
) => {
    return (
        <Tooltip 
        key={`${props.name}_color_selector`} 
        title="Select Color"
        enterDelay={500}
        enterNextDelay={500}
        >
            <div style={{border:'0.02rem solid black', borderRadius: '1rem', width: '1.2rem', height: '1.2rem'}}>
                <IconButton
                    aria-owns={anchorColorSelector ? "ColorSelector-popper" : undefined}
                    aria-haspopup="true"
                    color="primary"
                    style={{ color: props.color, width: '1.2rem', height: '1.2rem', marginBottom: '0.5rem'}}
                    onClick={handleColorSelectorIconClick}
                    disabled={props.disabled ? props.disabled : false}
                    id={`${props.name}_color_button`}
                >
                    <LensIcon />
                </IconButton>
            </div>
        </Tooltip>
    );
};

const colorSelectorPopover = (
    onColorSelected: (color: ColorResult) => void,
    handleColorSelectorIconClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    handleColorSelectorClose: () => void,
    props: IStyledColorSelectorProps,
    anchorColorSelector?: Element | null
) => {
    return (
        <Grid>
            {colorSelectorButton(anchorColorSelector, handleColorSelectorIconClick, props)}
            <Popover
                id="ColorSelector-popper"
                open={Boolean(anchorColorSelector)}
                anchorEl={anchorColorSelector}
                onClose={handleColorSelectorClose}
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom"
                }}
                transformOrigin={{
                    horizontal: "center",
                    vertical: "top"
                }}
            >
                <ChromePicker color={props.color} disableAlpha={true} onChange={onColorSelected} />
            </Popover>
        </Grid>
    );
};

const ColorSelector: React.FunctionComponent<IStyledColorSelectorProps> = (props: IStyledColorSelectorProps) => {
    const [anchorColorSelector, setAnchorColorSelector] = React.useState<Element | null>(null);

    const handleColorSelectorIconClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorColorSelector(event.currentTarget);
    };

    const handleColorSelectorClose = () => {
        setAnchorColorSelector(null);
    };

    const onColorSelected = (newColor: ColorResult) => {
        props.colorChange(newColor, props.name);
    };

    return (
        <div>
            {colorSelectorPopover(
                onColorSelected,
                handleColorSelectorIconClick,
                handleColorSelectorClose,
                props,
                anchorColorSelector
            )}
        </div>
    );
};

export default withStyles(styles)(ColorSelector);
