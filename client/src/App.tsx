import './RootCSS.css'

import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material'
import { FC, useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { isMobile } from 'react-device-detect'
import 'typeface-roboto'

import { socketInit } from './Services/Clients/WebSockets'
import { useAppStore } from './Services/Store'
import { sortTable } from './Services/Utils/BrowserUtils'
import { bigLog, getStringSetting, setBoolSetting } from './Services/Utils/ReactUtils'

import CreateNoteModal from './Views/Components/CreateNoteModal'
import Main from './Views/Main'

const getTheme = (darkMode: boolean) => {
  const custTheme = getStringSetting('colours') ?? ''
  let primaryMain = darkMode ? '#08d2ff' : '#007bff'
  let secondaryMain = '#ff0000'
  if (custTheme.length) {
    const { primary, secondary } = JSON.parse(custTheme)
    primaryMain = primary
    secondaryMain = secondary
  }

  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primaryMain,
      },
      secondary: {
        main: secondaryMain,
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
}

const App: FC = () => {
  bigLog('[Render] <App />')

  const { previewMode, darkMode, mdMode } = useAppStore(state => ({
    previewMode: state.settings.previewMode,
    darkMode: state.settings.darkMode,
    mdMode: state.settings.mdMode,
  }))

  // Auto Table Sorting
  useEffect(() => {
    bigLog('[Add Event Listeners: tableSort.js] <App />')
    window.addEventListener('click', sortTable)

    return () => window.removeEventListener('click', sortTable)
  }, [])

  // Initialise WebSockets
  useEffect(socketInit, [])

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
        // IGDev: (TODO) We could add another customisation for the background colour
        backgroundColor: darkMode ? '#303030' : '#fafafa',
        height: 'calc(100vh)',
        overflow: 'hidden',
        paddingTop: isMobile ? '56px' : '64px',
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Scrollbars autoHeight autoHeightMin={'calc(100vh)'} hideTracksWhenNotNeeded>
            <CssBaseline />
            <Main /> <br />
            <CreateNoteModal />
          </Scrollbars>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}

export default App
