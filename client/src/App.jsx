import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import './RootCSS.css';
import Notes from './Components/Notes'

const useStyles = makeStyles((theme) => ({
    root: {
        // display: 'flex'
    }
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
    },
    typography: {
        fontSize: 13,
        fontFamily: [
            'Roboto',
            'serif',
        ].join(','),
    },
});


const App = () => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Notes /> <br />
                <a href='/legacy'>Back To Legacy Site</a>
            </MuiThemeProvider>
        </div>
    );
};

export default App;