import { FC, useContext, useEffect } from 'react'

import { Scrollbars } from 'react-custom-scrollbars'
import { isMobile } from 'react-device-detect'
import 'typeface-roboto'

import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import './RootCSS.css'
import { sortTable } from './Services/BrowserUtils'
import { bigLog, setBoolSetting } from './Services/ReactUtils'
import { store } from './Services/State/Store'
import Main from './Views/Main'


const getTheme = (darkMode: boolean) => createMuiTheme({
  overrides: {
    // StyleSheet Name
    MuiInputBase: {
      // Rule Name
      inputMultiline: {
        // Custom CSS Override
        '&::-webkit-scrollbar': {
          width: 7,
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
          visibility: 'hidden',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
        },
      },
    },
  },
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
})

const App: FC = () => {

  bigLog('[Render] <App />')

  const globalState = useContext(store)
  const { state: { darkMode, mdMode, previewMode } } = globalState

  // Auto Table Sorting
  useEffect(() => {
    bigLog('[Add Event Listeners: tableSort.js] <App />')
    window.addEventListener('click', sortTable)

    return () => window.removeEventListener('click', sortTable)
  }, [])

  // Settings: Darkmode
  useEffect(() => {
    setBoolSetting('darkMode', darkMode)
  }, [darkMode])

  // Settings: MarkDown Mode
  useEffect(() => {
    setBoolSetting('mdMode', mdMode)
  }, [mdMode])

  // Settings: MarkDown Preview Mode
  useEffect(() => {
    setBoolSetting('previewMode', previewMode)
  }, [previewMode])

  const theme = getTheme(darkMode)

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh)',
        overflow: 'hidden',
        paddingTop: isMobile ? '56px' : '64px',
      }}
    >
      <MuiThemeProvider theme={theme}>
        <Scrollbars
          autoHeight
          autoHeightMin={`calc(100vh)`}
          hideTracksWhenNotNeeded
        >
          <CssBaseline />
          <Main /> <br />
        </Scrollbars>
      </MuiThemeProvider>
    </div>
  )
}

export default App
