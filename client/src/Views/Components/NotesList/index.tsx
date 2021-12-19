import { FC, memo, useState, useContext } from 'react'
import { store } from '../../../Services/State/Store'
import { bigLog, shallowCompareIdentical } from '../../../Services/ReactUtils'

import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  ListItemSecondaryAction,
} from '@material-ui/core'

import RootRef from '@material-ui/core/RootRef'
import NotesIcon from '@material-ui/icons/Notes'
import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { NoteItem } from '../../../Services/Database/NoteClient'
import MDPreview, { MDTitle } from '../MDPreview'
import ActionDialog from '../ActionDialog'
import CreateNoteModal from '../CreateNoteModal'

import { isMobile } from 'react-device-detect'

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
  noteState: NoteItem[], startIndex: number, endIndex: number,
): NoteItem[] => {
  const [removed] = noteState.splice(startIndex, 1)
  noteState.splice(endIndex, 0, removed)

  return noteState
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: 'rgb(134,134,134)',
  }),
})

const getListStyle = (
  isDraggingOver: boolean, darkMode: boolean,
): { background: string } => ({
  background: isDraggingOver ? darkMode ? '#303030' : '#fafafa' : '',
})

const getTextStyle = (isDraggingOver: boolean): { color: string } => ({
  color: isDraggingOver ? 'black' : '',
})

type IListFragItem = string | JSX.Element | undefined

const getListItemFrags = (
  darkMode: boolean, mdMode: boolean, listItem: NoteItem,
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

const DeleteAlert = (handleAccept: () => void, handleClose: () => void) => (
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

const NoteFragment: FC<NoteFragProps> = memo(({ item, index }) => {

  const classes = useStyles()

  const globalState = useContext(store)
  const { state: { darkMode, mdMode, noteState }, dispatch } = globalState

  const [deleteNote, setDeleteNote] = useState<NoteItem | null>(null)

  const showDeleteAlert = (item: NoteItem) => setDeleteNote(item)

  const handleDeleteNote = () => {
    const newNotes = [...noteState]
    newNotes.splice(index, 1)
    dispatch({ type: 'SetNotes', payload: newNotes })
    setDeleteNote(null)
  }

  const handleCloseAlert = () => setDeleteNote(null)


  return (
    <>
      {deleteNote && (
        DeleteAlert(handleDeleteNote, handleCloseAlert)
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
                secondaryTypographyProps={{ style: { ...textStyle, whiteSpace: 'pre-wrap' } }}
              />
              <ListItemIcon>
                <CreateNoteModal editingNoteID={item.id} ActionButton={<EditIcon color="primary" />} />
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

}, (prevProps, nextProps) => (
  prevProps.index === nextProps.index && shallowCompareIdentical(prevProps.item, nextProps.item)
))

const NoteList: FC = () => {

  bigLog('[RENDER] <NotesList />')

  const globalState = useContext(store)
  const { state: { darkMode, mdMode, noteState }, dispatch } = globalState

  const classes = useStyles()

  const onDragEnd = (result: any) => {
    // Drop zone is outside of the list
    if (!result.destination) {
      return
    }

    const items = reorder(
      noteState,
      result.source.index,
      result.destination.index,
    )

    dispatch({ type: 'SetNotes', payload: items })
  }

  const NoteFragments = () => {

    return (noteState.map((item, index) => {

      const props = { item, index, darkMode, mdMode, dispatch }

      return (
        <NoteFragment key={item.id} {...props} />
      )
    }))
  }

  if (noteState === null) {
    return null
  } else {

    return (
      <div className={classes.root}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <RootRef rootRef={provided.innerRef}>
                <List style={getListStyle(snapshot.isDraggingOver, darkMode)}>
                  {NoteFragments()}
                  {provided.placeholder}
                </List>
              </RootRef>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }
}

export default NoteList
