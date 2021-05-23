import { Dispatch, SetStateAction } from 'react';

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

import { NoteItem } from '../../../Services/Database/NoteStore'
import MDPreview, { MDTitle } from '../MDPreview';

import { isMobile } from 'react-device-detect';

const useStyles = makeStyles(() => ({
    root: {
        width: isMobile ? '100%' : '85%',
        maxWidth: '1250px',
        margin: 'auto auto'
    },
    secondaryAction: {
        paddingRight: '0 !important',
    }
}));

const reorder = (
    noteState: NoteItem[], startIndex: number, endIndex: number
): NoteItem[] => {
    const [removed] = noteState.splice(startIndex, 1);
    noteState.splice(endIndex, 0, removed);
    return noteState;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(134,134,134)"
    })
});

const getListStyle = (
    isDraggingOver: boolean, darkMode: boolean
): { background: string } => ({
    background: isDraggingOver ? darkMode ? '#303030' : '#fafafa' : '',
});

const getTextStyle = (isDraggingOver: boolean): { color: string } => ({
    color: isDraggingOver ? 'black' : '',
});

type IListFragItem = string | JSX.Element | undefined;

const getListItemFrags = (
    darkMode: boolean, mdMode: boolean, listItem: NoteItem
): IListFragItem[] => {

    let { primary, secondary } = listItem;

    const customProps = (textItem?: string) => ({
        children: textItem,
        darkMode,
    });
    return [
        mdMode ? <MDTitle {...customProps(primary)} /> : primary,
        mdMode ? <MDPreview {...customProps(secondary)} /> : secondary
    ];
}

interface INoteList {
    darkMode: boolean,
    noteState: NoteItem[],
    setNoteState: Dispatch<SetStateAction<NoteItem[]>>,
    setEditNoteId: Dispatch<SetStateAction<string>>,
    mdMode: boolean,
}

const NotesList = ({
    darkMode,
    noteState,
    setNoteState,
    setEditNoteId,
    mdMode
}: INoteList): JSX.Element | null => {

    const classes = useStyles();

    const onDragEnd = (result: any) => {
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

    const deleteNote = (item: NoteItem) => {
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
                                                const textStyle = getTextStyle(snapshot.isDragging);
                                                const itemStyle = getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
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
                                                            onClick={() => deleteNote(item)}
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