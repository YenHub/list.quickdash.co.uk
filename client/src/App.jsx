import './RootCSS.css';
import 'typeface-roboto';
import Main from './Views/Main';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

const getSetting = setting => {
    if(window.localStorage.getItem(setting)) {
        return window.localStorage.getItem(setting) === 'true';
    }
    return setting !== 'mdMode';
};

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

    const [darkMode, setDarkMode] = useState(getSetting('darkMode'));
    const [mdMode, setMDMode] = useState(getSetting('mdMode'));
    const [previewMode, setPreviewMode] = useState(getSetting('previewMode'));

    useEffect( () => {
        window.localStorage.setItem('darkMode', darkMode);
    }, [darkMode])

    useEffect( () => {
        window.localStorage.setItem('mdMode', mdMode);
    }, [mdMode])

    useEffect( () => {
        window.localStorage.setItem('previewMode', previewMode);
    }, [previewMode])

    const theme = getTheme(darkMode);

    const mainProps = {
        darkMode,
        setDarkMode,
        mdMode,
        setMDMode,
        previewMode,
        setPreviewMode,
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