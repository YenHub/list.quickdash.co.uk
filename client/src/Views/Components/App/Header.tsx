import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import clsx from 'clsx'
import { FC } from 'react'
import { isMobile } from 'react-device-detect'

import { useAppStore } from '../../../Services/Store'
import { useStyles } from '../../Main.Styles'
import { CreateNoteButton } from '../ActionButtons'
import { SyncStatus } from './SyncStatus'

interface IAppHeader {
  open: boolean
  handleDrawerState(): void
}

export const AppHeader: FC<IAppHeader> = ({ open, handleDrawerState }) => {
  const { darkMode, setModalState } = useAppStore(state => ({
    setModalState: state.setModalState,
    darkMode: state.settings.darkMode,
  }))

  const classes = useStyles(darkMode)({})

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar className={classes.toolBar}>
        <IconButton
          data-testid="menu-button"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerState}
          className={clsx(open && classes.hide)}
        >
          <SettingsIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h1"
          noWrap
          className={classes.title}
          data-testid="header-title"
        >
          QuickList
          <SyncStatus />
        </Typography>
        <CreateNoteButton
          testId="create"
          label="Create New Note"
          onClick={() => setModalState({ open: true, editingNoteId: null })}
          ActionButton={
            <AddCircleOutlineIcon
              style={isMobile ? {} : { fontSize: '2.5rem' }}
              color="primary"
              fontSize="large"
            />
          }
        />
      </Toolbar>
    </AppBar>
  )
}
