import { FC, useContext } from 'react'

import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import clsx from 'clsx'

import SettingsIcon from '@material-ui/icons/Settings'

import { store } from '../../../Services/State/Store'
import { useStyles } from '../../Main.Styles'
import CreateNoteModal from '../CreateNoteModal'

export const AppHeader: FC<{
  open: boolean
  handleDrawerState(): void
}> = ({ open, handleDrawerState }) => {
  const globalState = useContext(store)
  const {
    state: { darkMode },
  } = globalState

  const classes = useStyles(darkMode)()

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

        <Typography variant="h1" noWrap className={classes.title}>
          QuickList
        </Typography>

        <CreateNoteModal />
      </Toolbar>
    </AppBar>
  )
}
