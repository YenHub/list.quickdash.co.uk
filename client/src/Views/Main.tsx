import clsx from 'clsx'
import { FC, useContext, useEffect, useState } from 'react'
import 'typeface-dosis'

import { store } from '../Services/State/Store'
import { useStyles } from './Main.Styles'

import NoteClient from '../Services/Database/NoteClient'
import { bigLog, groupLog } from '../Services/ReactUtils'
import { AppHeader } from './Components/App/Header'
import { AppMenuDrawer } from './Components/App/MenuDrawer'
import NotesList from './Components/NotesList'
export const noteClient = new NoteClient()

const Main: FC = () => {

  bigLog('[RENDER] <Main />')

  const globalState = useContext(store)
  const { state: { darkMode }, dispatch } = globalState

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

  useEffect(attemptImport, [getNotes, dispatch])

  return (
    <div className={classes.root}>
      <AppHeader open={open} handleDrawerState={handleDrawerState} />
      <AppMenuDrawer open={open} handleDrawerState={handleDrawerState} />
      <main className={clsx(classes.content, { [classes.contentShift]: open })} >
        <NotesList />
      </main>
    </div>
  )
}

export default Main
