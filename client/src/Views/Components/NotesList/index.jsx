import { makeStyles } from '@material-ui/core/styles';

import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction
} from '@material-ui/core';

import RootRef from '@material-ui/core/RootRef';
import NotesIcon from '@material-ui/icons/Notes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import MDPreview, { MDTitle } from '../MDPreview';

import { isMobile } from 'react-device-detect';

const useStyles = makeStyles((theme) => ({
    root: {
        width: isMobile ? '100%' : '85%',
        maxWidth: '1250px',
        margin: 'auto auto'
    },
    secondaryAction: {
        paddingRight: '0 !important',
    }
}));

const reorder = (noteState, startIndex, endIndex) => {
    const [removed] = noteState.splice(startIndex, 1);
    noteState.splice(endIndex, 0, removed);

    return noteState;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(134,134,134)"
    })
});

const getListStyle = (isDraggingOver, darkMode) => ({
    background: isDraggingOver ? darkMode ? '#303030' : '#fafafa' : '',
});

const getTextStyle = (isDraggingOver, darkMode) => ({
    color: isDraggingOver ? 'black' : null,
});

const getListItemFrags = (darkMode, mdMode, listItem) => {

    let { primary, secondary } = listItem;

    const customProps = textItem => ({
        children: textItem,
        darkMode,
        mdMode,
    })

    if (mdMode) {
        primary = <MDTitle {...customProps(primary)} />
        secondary = <MDPreview {...customProps(secondary)} />
    }

    return {
        primary,
        secondary,
    }
}

const NotesList = ({ darkMode, noteState, setNoteState, setEditNoteId, mdMode }) => {

    const classes = useStyles();

    const onDragEnd = (result) => {
        // Drop zone is outside of the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            noteState,
            result.source.index,
            result.destination.index
        );

        setNoteState([...items]);
    }

    const deleteNote = (item) => {
        setNoteState([...noteState.filter(note => note.id !== item.id)]);
    }

    if (noteState === null) {
        return null;
    } else {

        return (
            <div className={classes.root}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <RootRef rootRef={provided.innerRef}>
                                <List style={getListStyle(snapshot.isDraggingOver, darkMode)}>
                                    {noteState.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => {
                                                const textStyle = getTextStyle(snapshot.isDragging, darkMode);
                                                const itemStyle = getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                );
                                                const listItemFrags = getListItemFrags(darkMode, mdMode,item, textStyle);
                                                return (
                                                    <ListItem
                                                        className={classes.secondaryAction}
                                                        ContainerComponent="li"
                                                        ContainerProps={{ ref: provided.innerRef }}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={itemStyle}
                                                    >
                                                        <ListItemIcon>
                                                            <NotesIcon style={textStyle}/>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            disableTypography={mdMode ? true : false}
                                                            primary={listItemFrags.primary}
                                                            primaryTypographyProps={{ style: {...textStyle}}}
                                                            secondary={listItemFrags.secondary}
                                                            secondaryTypographyProps={{ style: {...textStyle, whiteSpace: 'pre-wrap'}}}
                                                        />
                                                        <ListItemIcon onClick={() => setEditNoteId(item.id)}>
                                                            <IconButton>
                                                                <EditIcon color="primary"/>
                                                            </IconButton>
                                                        </ListItemIcon>
                                                        <ListItemIcon
                                                            role="deleteNote"
                                                            onClick={ () => deleteNote(item) }
                                                        >
                                                            <IconButton>
                                                                <DeleteForeverIcon color="error"/>
                                                            </IconButton>
                                                        </ListItemIcon>
                                                        <ListItemSecondaryAction />
                                                    </ListItem>
                                                )
                                            }}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            </RootRef>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    };
}

export default NotesList;