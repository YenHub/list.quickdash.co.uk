import 'typeface-dosis'

import clsx from 'clsx'
import { type FC, useCallback, useEffect, useState } from 'react'

import { noteClient } from '../Services/Database/NoteClient'
import { useAppStore } from '../Services/Store'
import { bigLog, groupLog } from '../Services/Utils/ReactUtils'
import { AppHeader } from './Components/App/Header'
import { AppMenuDrawer } from './Components/App/MenuDrawer'
import NotesList from './Components/NotesList'
import { useStyles } from './Main.Styles'

const Main: FC = () => {
  bigLog('[RENDER] <Main />')

  const { darkMode, setNotes } = useAppStore(state => ({
    darkMode: state.settings.darkMode,
    setNotes: state.setNotes,
  }))

  const { getNotes } = noteClient

  const classes = useStyles(darkMode)({})

  const [open, setOpen] = useState<boolean>(false)

  const handleDrawerState = (): void => setOpen(open => !open)

  const attemptImport = useCallback(async (): Promise<void> => {
    bigLog('<Main /> attemptImport()')

    const storedNotes = await getNotes()
    groupLog('[Stored Notes]', storedNotes)

    await setNotes(storedNotes)
  }, [getNotes, setNotes])

  useEffect(() => {
    void attemptImport()
  }, [attemptImport])

  return (
    <div className={classes.viewsRoot}>
      <AppHeader open={open} handleDrawerState={handleDrawerState} />
      <AppMenuDrawer open={open} handleDrawerState={handleDrawerState} />
      <main className={clsx(classes.content, { [classes.contentShift]: open })}>
        <NotesList />
      </main>
    </div>
  )
}

export default Main
