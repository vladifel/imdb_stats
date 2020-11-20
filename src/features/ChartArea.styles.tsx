import { createStyles } from "@material-ui/core/styles";

export const styles = () =>
    createStyles({
        chartArea: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
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