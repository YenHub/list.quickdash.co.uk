import './RootCSS.css';
import 'typeface-roboto';
import Main from './Views/Main';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { AutoSizer } from 'react-virtualized';

const getDarkMode = () => {
    if(window.localStorage.getItem('darkMode')) {
        return window.localStorage.getItem('darkMode') === 'true';
    }
    return true;
}

const App = () => {

    const [darkMode, setDarkMode] = useState(getDarkMode());

    useEffect( () => {
        window.localStorage.setItem('darkMode', darkMode);
    }, [darkMode])

    const theme = createMuiTheme({
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

    const mainProps = {
        darkMode,
        setDarkMode,
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
                <AutoSizer>
                    {( { width, height }) => {
                        return (
                            <Scrollbar style={{ width, height }}>
                            <CssBaseline />
                            <Main {...mainProps} /> <br />
                            </Scrollbar>
                        );
                    }}
                </AutoSizer>
            </MuiThemeProvider>
        </div>
    );
};

export default App;