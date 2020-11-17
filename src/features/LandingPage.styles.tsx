import { createStyles } from "@material-ui/core/styles";

export const styles = () =>
    createStyles({
        icon: {
            color: "#f3ce13",
            fontSize: '2rem'
        },
        iconMargins: {
            margin: '0 0.5rem'
        },
        iconTwoMargins: {
            margin: '0 0.7rem'
        },
        inputRoot: {
            color: "black",
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(243, 206, 19, 0.7)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f3ce13"
            }
        },
        mediumIcon: {
            fontSize: '1.25rem'
        },
        nameSelectNew: {
            //width: '20rem'
        },
        options: {
            fontSize: '0.8125rem',
            lineHeight: '1.2',
            color: '#252525',
            '&[aria-selected="true"]': {
                color: '#252525',
                //fontWeight: 1000,
                backgroundColor: '#ffffff'
            },
            '&[data-focus="true"]': {
                color: '#252525',
                backgroundColor: 'rgba(243, 206, 19, 0.7)',
            },
        },
        page: {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
        },
        profSelect: {
            width: '10rem',
            marginRight: '0.5rem'
        },
        rating: {
            display: "flex",
            justifyContent: 'flex-end'
        },
        root: {
            display: "flex",
            backgroundColor: '#ffffff',
            justifyContent: 'space-between',
            flexDirection: "row",
            flexWrap: 'nowrap',
            minHeight: '6.25rem',
            boxShadow: '0 0.125rem 0.3125rem 0 rgba(243, 206, 19, 0.9)',
        },
        rootAutoComplete: {
            '& label.Mui-focused': {
                color: "#f3ce13",
                //fontWeight: 1000
            },
        },
        rootLeft: {
            display: "flex",
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: '5rem'
        },
        rootRight: {
            display: "flex",
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginRight: '4.3rem'
        }
    });