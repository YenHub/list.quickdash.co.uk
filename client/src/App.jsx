import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { useState } from 'react';
import './RootCSS.css';
import Main from './Components/Main'

const App = () => {

    const [ darkMode, setDarkMode ] = useState(true);

    // const useStyles = makeStyles((theme) => ({
    //     root: {
    //         // display: 'flex'
    //     }
    // }));

    const theme = createMuiTheme({
        palette: {
            type: darkMode ? 'dark' : 'light',
            // primary: {
            //     main: '#ffffff',
            // },
        },
        typography: {
            fontSize: 13,
            fontFamily: [
                'Roboto',
                'serif',
            ].join(','),
        },
    });

    // const classes = useStyles();

    const mainProps = {
        darkMode,
        setDarkMode,
    }

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Main {...mainProps} /> <br />
            </MuiThemeProvider>
        </div>
    );
};

export default App;