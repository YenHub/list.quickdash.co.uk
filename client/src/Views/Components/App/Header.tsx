import { FC, useContext } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import clsx from 'clsx'

import SettingsIcon from '@mui/icons-material/Settings'

import { store } from '../../../Services/State/Store'
import { useStyles } from '../../Main.Styles'
import { CreateNoteButton } from '../ActionButtons'
import CreateNoteModal from '../CreateNoteModal'

export const AppHeader: FC<{
  open: boolean
  handleDrawerState(): void
}> = ({ open, handleDrawerState }) => {
  const globalState = useContext(store)
  const {
    state: { darkMode },
    dispatch,
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
        <CreateNoteButton
          testId="create"
          label="Create New Note"
          onClick={() =>
            dispatch({ type: 'SetModalState', payload: { open: true } })
          }
          ActionButton={
            <AddCircleOutlineIcon color="primary" fontSize="large" />
          }
        />
        <CreateNoteModal />
      </Toolbar>
    </AppBar>
  )
}
