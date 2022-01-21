import { FC, useContext, useEffect } from 'react'

import { Scrollbars } from 'react-custom-scrollbars'
import { isMobile } from 'react-device-detect'
import 'typeface-roboto'

import { CssBaseline } from '@mui/material'
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material'
import './RootCSS.css'
import { sortTable } from './Services/BrowserUtils'
import { bigLog, setBoolSetting } from './Services/ReactUtils'
import { store } from './Services/State/Store'
import Main from './Views/Main'

const getTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#08d2ff' : '#007bff',
      },
      secondary: {
        main: '#66ffde',
      },
      error: {
        main: '#ff0000',
      },
      neutral: {
        main: '#c7c7c7',
      },
    },
    typography: {
      fontSize: 13,
      fontFamily: ['Roboto', 'serif'].join(','),
    },
  })

const App: FC = () => {
  bigLog('[Render] <App />')

  const globalState = useContext(store)
  const {
    state: { darkMode, mdMode, previewMode },
  } = globalState

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
        backgroundColor: darkMode ? '#303030' : '#fafafa',
        height: 'calc(100vh)',
        overflow: 'hidden',
        paddingTop: isMobile ? '56px' : '64px',
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Scrollbars
            autoHeight
            autoHeightMin={'calc(100vh)'}
            hideTracksWhenNotNeeded
          >
            <CssBaseline />
            <Main /> <br />
          </Scrollbars>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}

export default App
