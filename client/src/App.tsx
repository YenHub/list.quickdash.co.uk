import { FC } from 'react';
import './RootCSS.css';
import 'typeface-roboto';
import Main from './Views/Main';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { useContext, useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { store } from './Services/State/Store';

import { setBoolSetting } from './Services/ReactUtils';

const getTheme = (darkMode: boolean) => createMuiTheme({
    palette: {
        type: darkMode ? 'dark' : 'light',
        primary: {
            main: darkMode ? '#08d2ff' : '#007bff',
        },
        secondary: {
            main: '#66ffde',
        },
        error: {
            main: '#ff0000',
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

const App: FC = () => {

    const globalState = useContext(store);
    const { state } = globalState;
    const { darkMode, mdMode, previewMode } = state;

    useEffect(() => {
        setBoolSetting('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        setBoolSetting('mdMode', mdMode);
    }, [mdMode]);

    useEffect(() => {
        setBoolSetting('previewMode', previewMode);
    }, [previewMode]);

    const theme = getTheme(darkMode);

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
                    <Main /> <br />
                </Scrollbar>
            </MuiThemeProvider>
        </div>
    );
};

export default App;
