import { FC, memo, useState } from 'react'
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
import { bigLog } from '../../../Services/ReactUtils'
import ActionDialog from '../ActionDialog'
import MDPreview, { MDTitle } from '../MDPreview'
import { CreateNoteButton } from '../ActionButtons'
import { setModalState } from '../../../Services/Reducers/modalSlice'
import { setNotes } from '../../../Services/Reducers/noteSlice'

const useStyles = makeStyles(() => ({
  root: {
    width: isMobile ? '100%' : '85%',
    maxWidth: '1250px',
    margin: 'auto auto',
  },
  secondaryAction: {
    paddingRight: '0 !important',
  },
}))

const reorder = (
  noteState: NoteItem[],
  startIndex: number,
  endIndex: number,
): NoteItem[] => {
  const notes = [...noteState]
  const [removed] = notes.splice(startIndex, 1)
  notes.splice(endIndex, 0, removed)

  return notes
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: 'rgb(134,134,134)',
  }),
})

const getListStyle = (
  isDraggingOver: boolean,
  darkMode: boolean,
): { background: string } => ({
  background: isDraggingOver ? (darkMode ? '#303030' : '#fafafa') : '',
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
  item: NoteItem
  index: number
}

const NoteFragment: FC<NoteFragProps> = memo(
  ({ item, index }: NoteFragProps) => {
    bigLog('[RENDER] <NoteFragment />')

    const classes = useStyles()

    const { darkMode, mdMode } = useAppSelector(({ settings }) => settings)
    const { noteState } = useAppSelector(({ notes }) => notes)
    const dispatch = useAppDispatch()

    const [deleteNote, setDeleteNote] = useState<NoteItem | null>(null)

    const showDeleteAlert = (item: NoteItem) => setDeleteNote(item)

    const handleDeleteNote = () => {
      const newNotes = [...noteState]
      newNotes.splice(index, 1)
      dispatch(setNotes(newNotes))
      setDeleteNote(null)
    }

    const handleCloseAlert = () => setDeleteNote(null)

    return (
      <>
        {deleteNote && (
          <DeleteAlert
            handleAccept={handleDeleteNote}
            handleClose={handleCloseAlert}
          />
        )}
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {(provided, snapshot) => {
            const textStyle = getTextStyle(snapshot.isDragging)
            const itemStyle = getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )
            const listItemFrags = getListItemFrags(darkMode, mdMode, item)

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
                <ListItemIcon>
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
                <ListItemIcon>
                  <CreateNoteButton
                    testId="edit"
                    label="Edit Note"
                    onClick={() =>
                      dispatch(
                        setModalState({
                          modalState: { open: true, editingNoteId: item.id },
                        }),
                      )
                    }
                    ActionButton={<EditIcon color="primary" />}
                  />
                </ListItemIcon>
                <ListItemIcon
                  role="deleteNote"
                  onClick={() => showDeleteAlert(item)}
                >
                  <IconButton>
                    <DeleteForeverIcon color="error" />
                  </IconButton>
                </ListItemIcon>
                <ListItemSecondaryAction />
              </ListItem>
            )
          }}
        </Draggable>
      </>
    )
  },
)

const NoteList: FC = () => {
  bigLog('[RENDER] <NotesList />')
  const classes = useStyles()

  const { darkMode } = useAppSelector(({ settings }) => settings)
  const { noteState } = useAppSelector(({ notes }) => notes)

  const dispatch = useAppDispatch()

  const onDragEnd = (result: any) => {
    // Drop zone is outside of the list
    if (!result.destination) return

    const items = reorder(
      noteState,
      result.source.index,
      result.destination.index,
    )

    dispatch(setNotes(items))
  }

  if (noteState === null) return null

  return (
    <div className={classes.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, darkMode)}
            >
              {noteState.map((item, index) => (
                <NoteFragment key={item.id} item={item} index={index} />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default NoteList
