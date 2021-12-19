import { FC } from 'react'
import 'typeface-dosis'
import clsx from 'clsx'
import { useContext, useState, useEffect } from 'react'

import { useStyles } from './Main.Styles'
import { store, ToggleTypes } from '../Services/State/Store'

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
} from '@material-ui/core'

import SettingsIcon from '@material-ui/icons/Settings'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import { isMobile } from 'react-device-detect'

import MenuToggle from './Components/Toggles'
import NotesList from './Components/NotesList'
import { ExportButton, ImportButton, DeleteNotes } from './Components/ActionButtons'
import CreateNoteModal from './Components/CreateNoteModal'
import ShareButtons from './Components/ShareButtons'

import NoteClient from '../Services/Database/NoteClient'
import { bigLog, groupLog, showGatedFeatures } from '../Services/ReactUtils'
export const noteClient = new NoteClient()

const Main: FC = () => {

  bigLog('[RENDER] <Main />')

  const globalState = useContext(store)
  const { state: { darkMode, mdMode, previewMode }, dispatch } = globalState

  const { getNotes } = noteClient

  const classes = useStyles(darkMode)()

  const [open, setOpen] = useState<boolean>(false)

  const handleDrawerState = (): void => setOpen(open => !open)

  const attemptImport = (): void => {
    bigLog('<Main /> attemptImport()')
    getNotes().then(storedNotes => {
      groupLog('[Stored Notes]', storedNotes)
      dispatch({ type: 'SetNotes', payload: storedNotes })
    })
  }

  // Were using this emtpy [] purposefully and with intent
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(attemptImport, [])

  const AppHeader: FC = () => {

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

  const AppMenuDrawer: FC = () => {

    const DrawerHeader: FC = () => (
      <div className={classes.drawerHeader}>
        <IconButton data-testid="close-menu-button" onClick={handleDrawerState}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
    )

    const ImportListItem: FC = () => (
      <ListItem>
        <ImportButton />
      </ListItem>
    )

    const ExportListItem: FC = () => (
      <ListItem>
        <ExportButton />
      </ListItem>
    )

    const MenuItems: FC = () => (
      <List>
        {showGatedFeatures ? <ExportListItem /> : null}
        {showGatedFeatures ? <ImportListItem /> : null}
        <ListItem>
          <DeleteNotes />
        </ListItem>
        <ListItem>
          <MenuToggle
            state={darkMode}
            dispatchType={ToggleTypes.DarkModeToggle}
            label="Dark Mode"
            qaId="dm-toggle"
          />
        </ListItem>
        <Divider />
        <ListItem>
          <MenuToggle
            state={mdMode}
            dispatchType={ToggleTypes.MarkDownToggle}
            label="Enable MarkDown"
            qaId="md-toggle"
          />
        </ListItem>
        {(mdMode && !isMobile) && (
          <div>
            <Divider />
            <ListItem>
              <MenuToggle
                state={previewMode}
                dispatchType={ToggleTypes.PreviewModeToggle}
                label="Always Show Preview"
                qaId="md-preview-toggle"
              />
            </ListItem>
          </div>
        )}
      </List>
    )

    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <DrawerHeader />
        <Divider />
        <MenuItems />
        <ShareButtons />
      </Drawer>
    )
  }

  return (
    <div className={classes.root}>
      <AppHeader />
      <AppMenuDrawer />
      <main className={clsx(classes.content, { [classes.contentShift]: open })} >
        <NotesList />
      </main>
    </div>
  )
}

export default Main
