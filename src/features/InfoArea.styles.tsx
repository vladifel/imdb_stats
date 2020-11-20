import { createStyles, Theme } from "@material-ui/core/styles";

export const styles = (theme: Theme) =>
    createStyles({
        buttonContainer: {
            height: '4.5rem',
            width: 'inherit',
            display: "flex",
            alignItems: 'center',
            zIndex: 10,
            backgroundColor: '#4CAF50',
            border: '0.05rem solid rgba(0, 0, 0, 0.3)',
            borderRadius: '3rem 0 0 3rem',
        },
        buttonContainerClosed: {
            width: '3.5rem',
            display: "flex",
            justifyContent: 'center',
        },
        buttonContainerOpen: {
            width: '14rem',
            display: "flex",
            justifyContent: 'space-around'
        },
        cssFocus: {
            '&.Mui-focused': {
                color: "#FFC107",
                //fontWeight: 1000
            },
        },
        divider: {
            marginTop: '0.5rem',
            marginLeft: 0,
            backgroundColor: 'black',
            boxShadow: '0 0.125rem 0.3125rem 0 rgba(0, 0, 0, 1)',
        },
        highlightedText: {
            //fontWeight: 700,
            marginRight: '0.3rem'
        },
        icon: {
            fontSize: '3rem',
        },
        iconOpen: {
            marginLeft: '0.7rem'
        },
        infoArea: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            backgroundColor: '#4CAF50',
            opacity: '0.9',
            boxShadow: '-0.0625rem -0.0625rem 0.6875rem -0.0625rem rgba(255,193,7,0.5)'
            //width: '13.8rem',
        },
        infoAreaBottom: {
            overflow: 'auto',
            backgroundColor: '#66BB6A'
        },
        infoAreaNameRow: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '0 1rem 0.5rem'
        },
        infoAreaNameRowText: {
            fontSize: '1.6rem',
            fontWeight: 800,
        },
        infoAreaTop: {
            marginTop: '1rem'
        },
        infoAreaTopRows: {
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '1rem'
        },
        linkColor: {
            color: '#252525',
            cursor: 'pointer',
        },
        listText: {
            fontSize: '1.2rem'
        },
        root: {
            height: '100%',
            display: "flex",
            justifyContent: 'flex-end',
            overflowX: 'hidden',
            boxShadow: '-0.625rem -0.0625rem 0.6875rem -0.0625rem rgba(255,193,7,0.5)'
            //marginRight: '-0.5rem'
            //position: 'absolute',
            //right: 0
        },
        rootClosed: {
            width: '3.6rem',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.easeInOut,
                duration: 1000,
            }),
        },
        rootOpen: {
            width: '14.1rem',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: 300,
            }),
        },
        select: {
            width: '10rem',
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: '#FFC107',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: "rgba(255,193,7, 0.7)",
            }
        },
        selectedItem: {
            padding: '0.2rem 0.5rem',
            width: 'auto',
            "&:active, &:focus, &:hover, &.Mui-focusVisible": {
                backgroundColor: 'rgba(243, 206, 19, 0.7)',
            },
        },
        topClosed: {
            width: 'inherit',
            minHeight: '6.25rem',
            display: "flex",
            alignItems: 'center',
        },
    })