import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LegacyNotes from '../Services/LegacyNotes';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InboxIcon from "@material-ui/icons/Inbox";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%'
    }
}));

// fake data generator
const getItems = () => LegacyNotes.get().map( (note, ind) => ({
    id: `item-${ind}`,
    primary: note,
    secondary: ind % 2 === 0 ? `Whatever for ${ind}` : undefined
}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});

const getListStyle = isDraggingOver => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const NotesList = (props) => {
    const classes = useStyles();
    const [itemsState, setItemsState] = useState(getItems(10));

    useEffect(() => {

        const myObj = JSON.stringify(Object.assign({}, [...itemsState.map( it => it.primary )]));

        window.localStorage.setItem('listConfig', myObj);

        // console.log(myObj);
    }, [itemsState]);

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            itemsState,
            result.source.index,
            result.destination.index
        );

        setItemsState([...items]);
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    return (
        <div className={classes.root}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                            <List style={getListStyle(snapshot.isDraggingOver)}>
                                {itemsState.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <ListItem
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
                                                    <InboxIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.primary}
                                                    secondary={item.secondary}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton>
                                                        <EditIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
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