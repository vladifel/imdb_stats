import {
    createMuiTheme
} from '@material-ui/core/styles';

export default createMuiTheme({
    root: {
        height: '100%',
        width: '100%',
    },
    typography: {
        //useNextVariants: true,
        fontFamily: 'Roboto',
        //textAlign: 'left',
        //fontSize: '20px'
    },
    palette: {
        primary: {
            main: '#004b8d'
        },
        secondary: {
            main: 'rgba(255, 255, 255, 0.01)'
        },
    },
    globalStyles: {
        LoadingProgress: {
            Root: {
                height: '100%',
                width: '100%',
            }
        },

        GatherDisplayProperties: {
            SettingsItem: {
                height: '2rem',
            },
            InputDataItem: {
                paddingLeft: '1rem'
            }
        }
    }
});