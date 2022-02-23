import { FC } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import clsx from 'clsx'

import SettingsIcon from '@mui/icons-material/Settings'

import { isMobile } from 'react-device-detect'
import { useStyles } from '../../Main.Styles'
import { CreateNoteButton } from '../ActionButtons'
import { setModalState } from '../../../Services/Reducers/modalSlice'
import { useAppDispatch, useAppSelector } from '../../../Services/Store'
import { SyncStatus } from './SyncStatus'

export const AppHeader: FC<{
  open: boolean
  handleDrawerState(): void
}> = ({ open, handleDrawerState }) => {
  const { darkMode } = useAppSelector(({ settings }) => settings)
  const dispatch = useAppDispatch()

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
          onClick={() =>
            dispatch(
              setModalState({
                modalState: { open: true, editingNoteId: null },
              }),
            )
          }
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
