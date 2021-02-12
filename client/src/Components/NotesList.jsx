import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction
} from "@material-ui/core";

import RootRef from "@material-ui/core/RootRef";
import NotesIcon from '@material-ui/icons/Notes';
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import LegacyNotes from '../Services/Database/LegacyNotes';
import NoteStore from '../Services/Database/NoteStore';

import { isMobile } from 'react-device-detect';

const useStyles = makeStyles((theme) => ({
    root: {
        width: isMobile ? '100%' : '80%',
        maxWidth: '1250px',
        margin: 'auto auto'
    },
    secondaryAction: {
        paddingRight: '0 !important',
    }
}));

const getItems = () => LegacyNotes.get().map((note, ind) => ({
    id: `item-${ind}`,
    primary: note,
    secondary: ind % 2 === 0 ? `Whatever for ${ind}` : undefined,
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
        background: "rgb(235,235,235)"
    })
});

const getListStyle = (isDraggingOver, darkMode) => ({
    background: isDraggingOver ? darkMode ? '#303030' : '#fafafa' : '',
});

const getTextStyle = (isDraggingOver, darkMode) => ({
    color: isDraggingOver ? 'black' : null,
});

const noteStore = new NoteStore();

const NotesList = ({ darkMode, setDarkMode }) => {

    const classes = useStyles();

    const [noteState, setNoteState] = useState(getItems());

    const updateLegacyStore = notes => {
        const myObj = JSON.stringify(Object.assign({}, [...notes.map(it => it.primary)]));

        window.localStorage.setItem('listConfig', myObj);
    }

    useEffect(() => {

        updateLegacyStore(noteState);
        noteStore.setNotes(noteState);

    }, [noteState]);

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

    return (
        <div className={classes.root}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                            <List style={getListStyle(snapshot.isDraggingOver, darkMode)}>
                                {noteState.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <ListItem
                                                className={classes.secondaryAction}
                                                ContainerComponent="li"
                                                ContainerProps={{ ref: provided.innerRef }}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <ListItemIcon>
                                                    <NotesIcon style={getTextStyle(snapshot.isDragging, darkMode)}/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    secondaryTypographyProps={{ style: {...getTextStyle(snapshot.isDragging, darkMode)}}}
                                                    primaryTypographyProps={{ style: {...getTextStyle(snapshot.isDragging, darkMode)}}}
                                                    primary={item.primary}
                                                    secondary={item.secondary}
                                                />
                                                <ListItemIcon>
                                                    <IconButton>
                                                        <EditIcon style={{color: darkMode ? '#08d2ff' : '#007bff'}}/>
                                                    </IconButton>
                                                </ListItemIcon>
                                                <ListItemIcon onClick={ () => deleteNote(item) }>
                                                    <IconButton>
                                                        <DeleteForeverIcon style={{color: 'red'}}/>
                                                    </IconButton>
                                                </ListItemIcon>
                                                <ListItemSecondaryAction />
                                            </ListItem>
                                        )}
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
}

export default NotesList;