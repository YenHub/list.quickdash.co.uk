import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import 'typeface-dosis'

import NoteClient from '../Services/Database/NoteClient'
import { bigLog, groupLog } from '../Services/Utils/ReactUtils'
import { useAppDispatch, useAppSelector } from '../Services/Store'
import { setNotes } from '../Services/Reducers/noteSlice'
import { useStyles } from './Main.Styles'
import { AppHeader } from './Components/App/Header'
import { AppMenuDrawer } from './Components/App/MenuDrawer'
import NotesList from './Components/NotesList'

export const noteClient = new NoteClient()

const Main: FC = () => {
  bigLog('[RENDER] <Main />')

  const { darkMode } = useAppSelector(({ settings }) => settings)
  const dispatch = useAppDispatch()

  const { getNotes } = noteClient

  const classes = useStyles(darkMode)()

  const [open, setOpen] = useState<boolean>(false)

  const handleDrawerState = (): void => setOpen(open => !open)

  const attemptImport = (): void => {
    bigLog('<Main /> attemptImport()')
    getNotes().then(storedNotes => {
      groupLog('[Stored Notes]', storedNotes)
      dispatch(setNotes(storedNotes))
    })
  }

  useEffect(attemptImport, [getNotes, dispatch])

  return (
    <div className={classes.viewsRoot}>
      <AppHeader open={open} handleDrawerState={handleDrawerState} />
      <AppMenuDrawer open={open} handleDrawerState={handleDrawerState} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <NotesList />
      </main>
    </div>
  )
}

export default Main
