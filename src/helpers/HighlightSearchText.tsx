import React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';

const styles = () =>
    createStyles({
        listNestedItemHighlighted: {
            color: "#f3ce13",
            fontWeight: 500
        },
        listNestedItemHighlightedBackground: {
            backgroundColor: "rgba(243, 206, 19, 0.7)"
        },
    });

interface IHighlightSearchTextProps {
    text: string | number;
    highlight: string | number;
    highlightBackground?: boolean;
}

type IHighlightSearchTextCombinedProps = IHighlightSearchTextProps & WithStyles<typeof styles>;

const HighlightSearchText: React.FunctionComponent<IHighlightSearchTextCombinedProps> = (props: IHighlightSearchTextCombinedProps) => {
    let text = props.text;
    let highlight = props.highlight;
    typeof text === "number" && (text = props.text.toString());
    typeof highlight === "number" && (highlight = props.highlight.toString());
    const parts = (text as string).split(new RegExp(`(${highlight as string})`, 'gi'));
    return (
        <span> {parts.map((part, i) =>
            <span key={i}
                className={part.toUpperCase() === (highlight as string).toUpperCase()
                    ? props.highlightBackground ? props.classes.listNestedItemHighlightedBackground : props.classes.listNestedItemHighlighted
                    : undefined}
            >
                {part}
            </span>)
        } </span>
    )
};

export default withStyles(styles)(HighlightSearchText);