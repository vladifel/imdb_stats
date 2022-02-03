import React, { FC, Fragment } from "react";
import classNames from "classnames";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, ListItem, ListItemText, Tooltip, Typography } from "@material-ui/core";

import HighlightSearchText from "../HighlightSearchText/HighlightSearchText";

const styles = () =>
  createStyles({
    listNestedItem: {
      padding: "0.2rem 0",
      width: "auto",
      "&:active, &:focus, &:hover, &.Mui-focusVisible": {
        backgroundColor: "rgba(243, 206, 19, 0.7)",
      },
    },
    listNestedItemContainer: {
      height: "2.25rem",
      padding: "0 0.625rem",
    },
    listNestedItemDescription: {
      padding: "0 0 0.125rem 0",
    },
    listNestedItemText: {
      fontSize: "0.8125rem",
    },
  });

interface IFormLineProps {
  key: number;
  searchText: string | undefined;
  module: any;
  virtualRow: any;

  setDropDownOpen: (open: boolean) => void;
  handleLineClicked: (module: any) => void;
}

type IFormLineCombinedProps = IFormLineProps & WithStyles<typeof styles>;

const FormLine: FC<IFormLineCombinedProps> = ({
  searchText,
  module,
  virtualRow,
  setDropDownOpen,
  handleLineClicked,
  classes,
}: IFormLineCombinedProps) => {
  return (
    <ListItem
      id={`meta_${module.name}`}
      key={virtualRow.index}
      button={true}
      divider={true}
      draggable={true}
      className={classes.listNestedItem}
      onClick={() => {
        setDropDownOpen(false);
        handleLineClicked(module);
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "12.5rem",
        height: `2.25rem`,
        transform: `translateY(${virtualRow.start / 16}rem`,
      }}
    >
      <Grid container direction="column" className={classes.listNestedItemContainer}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Tooltip
            placement="right"
            title={
              <Fragment>
                <Typography variant="h5" noWrap style={{ fontSize: `0.6875rem` }}>
                  {module}
                </Typography>
              </Fragment>
            }
          >
            <ListItemText
              disableTypography
              primary={
                <Typography
                  component="div"
                  variant="h4"
                  noWrap
                  className={classNames(
                    classes.listNestedItemText,
                    classes.listNestedItemDescription
                  )}
                >
                  {!searchText || searchText === "" ? (
                    module
                  ) : (
                    <HighlightSearchText
                      text={module}
                      highlight={searchText}
                      highlightBackground={true}
                    />
                  )}
                </Typography>
              }
            />
          </Tooltip>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default withStyles(styles)(FormLine);
