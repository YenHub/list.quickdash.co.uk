import './RootCSS.css';
import 'typeface-roboto';
import Main from './Views/Main';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

const getDarkMode = () => {
    if(window.localStorage.getItem('darkMode')) {
        return window.localStorage.getItem('darkMode') === 'true';
    }
    return true;
}

const getMDMode = () => {
    if(window.localStorage.getItem('mdMode')) {
        return window.localStorage.getItem('mdMode') === 'true';
    }
    return false;
}

const getTheme = darkMode => createMuiTheme({
    palette: {
        type: darkMode ? 'dark' : 'light',
        primary: {
            main: darkMode ? '#08d2ff' : '#007bff',
        },
        secondary: {
            main: '#66ffde',
        },
        error: {
            main: '#ff0000'
        }
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

    const [darkMode, setDarkMode] = useState(getDarkMode());
    const [mdMode, setMDMode] = useState(getMDMode());

    useEffect( () => {
        window.localStorage.setItem('darkMode', darkMode);
    }, [darkMode])

    useEffect( () => {
        window.localStorage.setItem('mdMode', mdMode);
    }, [mdMode])

    const theme = getTheme(darkMode);

    const mainProps = {
        darkMode,
        setDarkMode,
        mdMode,
        setMDMode,
    }

    return (
        <div
            style={{
                display: 'flex',
                height: 'calc(100vh)',
                overflow: 'hidden',
            }}
        >
            <MuiThemeProvider theme={theme}>
                <Scrollbar style={{ width: '100%', height: 'calc(100vh)' }}>
                    <CssBaseline />
                    <Main {...mainProps} /> <br />
                </Scrollbar>
            </MuiThemeProvider>
        </div>
    );
};

export default App;