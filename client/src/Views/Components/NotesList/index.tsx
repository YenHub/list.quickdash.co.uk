import { FC, useState, useContext, Dispatch, SetStateAction } from 'react';
import { store } from '../../../Services/State/Store';
import { bigLog } from '../../../Services/ReactUtils';

import { makeStyles } from '@material-ui/core/styles';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction,
} from '@material-ui/core';

import RootRef from '@material-ui/core/RootRef';
import NotesIcon from '@material-ui/icons/Notes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { NoteItem } from '../../../Services/Database/NoteStore';
import MDPreview, { MDTitle } from '../MDPreview';
import ActionDialog from '../ActionDialog';

import { isMobile } from 'react-device-detect';

const useStyles = makeStyles(() => ({
    root: {
        width: isMobile ? '100%' : '85%',
        maxWidth: '1250px',
        margin: 'auto auto',
    },
    secondaryAction: {
        paddingRight: '0 !important',
    },
}));

const reorder = (
    noteState: NoteItem[], startIndex: number, endIndex: number,
): NoteItem[] => {
    const [removed] = noteState.splice(startIndex, 1);
    noteState.splice(endIndex, 0, removed);

    return noteState;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: 'rgb(134,134,134)',
    }),
});

const getListStyle = (
    isDraggingOver: boolean, darkMode: boolean,
): { background: string } => ({
    background: isDraggingOver ? darkMode ? '#303030' : '#fafafa' : '',
});

const getTextStyle = (isDraggingOver: boolean): { color: string } => ({
    color: isDraggingOver ? 'black' : '',
});

type IListFragItem = string | JSX.Element | undefined;

const getListItemFrags = (
    darkMode: boolean, mdMode: boolean, listItem: NoteItem,
): IListFragItem[] => {

    const { primary, secondary } = listItem;

    const customProps = (textItem?: string) => ({
        children: textItem,
        darkMode,
    });

    return [
        mdMode ? <MDTitle {...customProps(primary)} /> : primary,
        mdMode ? <MDPreview {...customProps(secondary)} /> : secondary,
    ];
};

interface INoteList {
    setEditNoteId: Dispatch<SetStateAction<string>>;
}

const DeleteAlert = (handleAccept: () => void, handleClose: () => void) => (
    <ActionDialog
        open={true}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        onAccept={handleAccept}
        onCancel={handleClose}
    />
);

const NotesList: FC<INoteList> = ({ setEditNoteId }) => {

    bigLog('[Render] <NotesList />');

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { darkMode, mdMode, noteState } = state;

    const [deleteNote, setDeleteNote] = useState<NoteItem | null>(null);

    const classes = useStyles();

    const onDragEnd = (result: any) => {
        // Drop zone is outside of the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            noteState,
            result.source.index,
            result.destination.index,
        );

        dispatch({ type: 'SetNotes', payload: items });
    };

    const handleDeleteNote = () => {
        dispatch({ type: 'SetNotes', payload: [...noteState.filter(note => note.id !== deleteNote!.id)] });
        setDeleteNote(null);
    };

    const handleCloseAlert = () => setDeleteNote(null);
    const showDeleteAlert = (item: NoteItem) => setDeleteNote(item);

    if (noteState === null) {
        return null;
    } else {

        return (
            <div className={classes.root}>
                {deleteNote && (
                    DeleteAlert(handleDeleteNote, handleCloseAlert)
                )}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <RootRef rootRef={provided.innerRef}>
                                <List style={getListStyle(snapshot.isDraggingOver, darkMode)}>
                                    {noteState.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => {
                                                const textStyle = getTextStyle(snapshot.isDragging);
                                                const itemStyle = getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style,
                                                );
                                                const listItemFrags = getListItemFrags(darkMode, mdMode, item);

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
                                                        <ListItemIcon onClick={() => setEditNoteId(item.id)}>
                                                            <IconButton>
                                                                <EditIcon color="primary" />
                                                            </IconButton>
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
                                                );
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
    }
};

export default NotesList;
