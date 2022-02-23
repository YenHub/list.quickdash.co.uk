import { FC, memo, useCallback, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { isMobile } from 'react-device-detect'

import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import NotesIcon from '@mui/icons-material/Notes'
import { useAppSelector, useAppDispatch } from '../../../Services/Store'

import { NoteItem } from '../../../Services/Database/NoteClient'
import { bigLog } from '../../../Services/Utils/ReactUtils'
import ActionDialog from '../ActionDialog'
import MDPreview, { MDTitle } from '../MDPreview'
import { CreateNoteButton } from '../ActionButtons'
import { setModalState } from '../../../Services/Reducers/modalSlice'
import { deleteNote, setNotes } from '../../../Services/Reducers/noteSlice'
import { diffWithNewIndex } from '../../../Services/Utils'

const useStyles = makeStyles(
  () => ({
    listRoot: {
      width: isMobile ? '100%' : '85%',
      maxWidth: '1250px',
      margin: 'auto auto',
    },
    secondaryAction: {
      paddingRight: '0 !important',
    },
  }),
  { index: 1 },
)

const reorder = (
  noteState: NoteItem[],
  startIndex: number,
  endIndex: number,
): NoteItem[] => {
  const notes = [...noteState]
  const [removed] = notes.splice(startIndex, 1)
  notes.splice(endIndex, 0, removed)
  // IGDev: Here we want to UPDATE everything >= startIndex

  return notes
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: 'rgb(134,134,134)',
  }),
})

const getTextStyle = (isDraggingOver: boolean): { color: string } => ({
  color: isDraggingOver ? 'black' : '',
})

type IListFragItem = string | JSX.Element | undefined

const getListItemFrags = (
  darkMode: boolean,
  mdMode: boolean,
  listItem: NoteItem,
): IListFragItem[] => {
  const { primary, secondary } = listItem

  const customProps = (textItem?: string) => ({
    children: textItem,
    darkMode,
  })

  return [
    mdMode ? <MDTitle {...customProps(primary)} /> : primary,
    mdMode ? <MDPreview {...customProps(secondary)} /> : secondary,
  ]
}

const DeleteAlert: FC<{
  handleAccept(): void
  handleClose(): void
}> = ({ handleAccept, handleClose }) => (
  <ActionDialog
    open={true}
    title="Delete Note"
    message="Are you sure you want to delete this note?"
    onAccept={handleAccept}
    onCancel={handleClose}
  />
)

interface NoteFragProps {
  index: number
  note: NoteItem
}

const NoteFragment: FC<NoteFragProps> = memo(({ note, index }: NoteFragProps) => {
  bigLog('[RENDER] <NoteFragment />')

  const classes = useStyles()

  const { darkMode, mdMode } = useAppSelector(({ settings }) => settings)
  const dispatch = useAppDispatch()

  const [noteDeleted, setNoteDeleted] = useState<NoteItem | null>(null)

  const showDeleteAlert = (item: NoteItem) => setNoteDeleted(item)

  const handleDeleteNote = () => {
    dispatch(deleteNote(index))
    setNoteDeleted(null)
  }

  const handleCloseAlert = () => setNoteDeleted(null)

  const buttonStyle = isMobile ? { minWidth: '2.5em' } : {}

  return (
    <>
      {noteDeleted && (
        <DeleteAlert handleAccept={handleDeleteNote} handleClose={handleCloseAlert} />
      )}
      <Draggable draggableId={note.id} index={index}>
        {(provided, snapshot) => {
          const textStyle = getTextStyle(snapshot.isDragging)
          const itemStyle = getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
          )
          const listItemFrags = getListItemFrags(darkMode, mdMode, note)

          return (
            <ListItem
              className={classes.secondaryAction}
              ContainerComponent={(<li />).type}
              // ContainerProps={{ ref: provided.innerRef }}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={itemStyle}
            >
              <ListItemIcon style={buttonStyle}>
                <NotesIcon style={textStyle} />
              </ListItemIcon>
              <ListItemText
                disableTypography={mdMode ? true : false}
                primary={listItemFrags[0]}
                primaryTypographyProps={{ style: { ...textStyle } }}
                secondary={listItemFrags[1]}
                secondaryTypographyProps={{
                  style: { ...textStyle, whiteSpace: 'pre-wrap' },
                }}
              />
              <ListItemIcon style={buttonStyle}>
                <CreateNoteButton
                  testId="edit"
                  label="Edit Note"
                  onClick={() =>
                    dispatch(
                      setModalState({
                        modalState: { open: true, editingNoteId: note.id },
                      }),
                    )
                  }
                  ActionButton={<EditIcon color="primary" />}
                />
              </ListItemIcon>
              <ListItemIcon
                style={{ ...buttonStyle, paddingRight: '0.5em' }}
                role="deleteNote"
                onClick={() => showDeleteAlert(note)}
              >
                <IconButton>
                  <DeleteForeverIcon color="secondary" />
                </IconButton>
              </ListItemIcon>
              <ListItemSecondaryAction />
            </ListItem>
          )
        }}
      </Draggable>
    </>
  )
})

const NoteList: FC = () => {
  bigLog('[RENDER] <NotesList />')
  const classes = useStyles()
  const { noteState } = useAppSelector(({ notes }) => notes)

  const dispatch = useAppDispatch()

  const onDragEnd = useCallback(
    (result: any) => {
      // Drop zone is outside of the list
      if (!result.destination) return

      const newNoteState = reorder(
        noteState,
        result.source.index,
        result.destination.index,
      )

      const itemsToSync = diffWithNewIndex(noteState, newNoteState)

      // IGDev: Here we would send a fire & forget sync request
      if (itemsToSync.length === 0) return
      // syncDiff(itemsToSync)
      //    await diff.forEach(syncItem, newIndex)
      // Items get a new index, and syncSequence, new clients see the changes

      // [LOAD] fetch syncSequence
      //    IF syncSequence > currentSyncSequence [syncItems(currentSyncSequence)]
      //    setNotes()

      // When creating a new note, all indexes must bump by one on the server for fresh connections
      // The syncSequence must also be updated

      // [ITEMS]
      // [ON:DELETE]
      //    const {deletedNoteId} = socket.message.deletedNoteId
      //    const currentNotes = [...noteState].filter( note => note.id !== deletedNoteId )
      //    const newNotes = syncList(syncSequence)
      //    newNotes.forEach( note => currentNotes[note.index] = note)
      //    setNotes(currentNotes)
      // [ON:CREATE]
      // [ON:UPDATEITEM]
      // [ON:UPDATEMANY]
      //    const currentNotes = [...noteState]
      //    const newNotes = syncList(syncSequence)
      //    newNotes.forEach( note => currentNotes[note.index] = note)
      //    setNotes(currentNotes)
      dispatch(setNotes(newNoteState))
    },
    [dispatch, noteState],
  )

  return (
    <div className={classes.listRoot}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <List ref={provided.innerRef}>
              {noteState.map((note, index) => (
                <NoteFragment key={note.id} note={note} index={index} />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default memo(NoteList)
