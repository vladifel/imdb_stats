import React, { FC } from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";

const styles = () =>
  createStyles({
    listNestedItemHighlighted: {
      color: "#f3ce13",
      fontWeight: 500,
    },
    listNestedItemHighlightedBackground: {
      backgroundColor: "rgba(243, 206, 19, 0.7)",
    },
  });

interface IHighlightSearchTextProps {
  text: string | number;
  highlight: string | number;
  highlightBackground?: boolean;
}

type IHighlightSearchTextCombinedProps = IHighlightSearchTextProps & WithStyles<typeof styles>;

const HighlightSearchText: FC<IHighlightSearchTextCombinedProps> = ({
  text,
  highlight,
  highlightBackground,
  classes,
}: IHighlightSearchTextCombinedProps) => {
  const textString = typeof text === "number" ? text.toString() : text;
  const highlightString = typeof highlight === "number" ? highlight.toString() : highlight;

  const parts = textString.split(new RegExp(`(${highlightString})`, "gi"));

  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toUpperCase() === highlightString.toUpperCase()
              ? highlightBackground
                ? classes.listNestedItemHighlightedBackground
                : classes.listNestedItemHighlighted
              : undefined
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

export default withStyles(styles)(HighlightSearchText);
