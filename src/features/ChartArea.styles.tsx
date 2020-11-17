import { createStyles } from "@material-ui/core/styles";

export const styles = () =>
    createStyles({
        chartArea: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
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
        infoArea: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            width: '13.8rem',
        },
        infoAreaFirstColor: {
            backgroundColor: "#f3ce13",
            boxShadow: '0 0.125rem 0.3125rem 0 rgba(243,206,19,1)'
        },
        infoAreaSecondColor: {
            backgroundColor: "#fc8403",
            boxShadow: '0 0.125rem 0.3125rem 0 rgba(252,132,3,1)'
        },
        infoAreaBottom: {
            overflow: 'auto'
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
        loading: {
            height: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'

        },
        loadingIcon: {
            fontSize: '6rem',
            color: "#f3ce13",
            backgroundColor: '#252525',
            borderRadius: '0.55rem',
            marginBottom: '0.7rem'
        },
        loadingText: {
            fontSize: '1.5rem'
        },
        noDataText: {
            marginLeft: '1rem',
            fontSize: '2rem'
        }
    });