import 'typeface-dosis';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';

import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { isMobile } from 'react-device-detect';

import NotesList from './NotesList';
import DarkModeToggle from './Custom/DarkModeToggle';
import NoteModalButton from './Custom/NoteModal/Modal'

import NoteStore from '../Services/Database/NoteStore';
const noteStore = new NoteStore();

const drawerWidth = 240;

export default function Main({ darkMode, setDarkMode }) {

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        },
        title: {
            margin: 'auto', // Center Logo
            // paddingRight: '24px', // Offset for Menu Icon
            fontSize: '3em',
            color: darkMode ? '#08d2ff' : '#007bff',
            fontFamily: [
                'Dosis',
                'serif',
            ].join(','),
        },
        toolBar: {
            backgroundColor: darkMode ? '#303030' : 'white',
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: isMobile ? '100%' : drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: isMobile ? 0 : theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }));


    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [noteState, setNoteState] = useState(null);
    const noteProps = { darkMode, noteState, setNoteState };
    const toggleProps = {...noteProps, setDarkMode};
    const [modalOpen, setModalOpen] = useState(false);
    const modalProps = { ...noteProps, modalOpen, setModalOpen, setDarkMode };

    const getItems = async () => setNoteState(await noteStore.getNotes());

    useEffect( () => {
        if(!noteState) {
            getItems();
        }
    }, []);

    // TODO: Move this into NoteStore
    const updateLegacyStore = notes => {
        const myObj = JSON.stringify(Object.assign({}, [...notes.map(it => it.primary)]));
        window.localStorage.setItem('listConfig', myObj);
    }

    useEffect(() => {

        if(noteState) {
            updateLegacyStore(noteState);
            noteStore.setNotes(noteState);
        }

    }, [noteState]);

    const AppHeaderLogo = () => (
        <Typography variant="h1" noWrap className={classes.title}>
            QuickList
        </Typography>
    );

    const handleDrawerState = () => {
        setOpen( open => !open);
    }

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar className={classes.toolBar}>
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerState}
                        className={clsx(open && classes.hide)}
                    >
                        <SettingsIcon fontSize="large"/>
                    </IconButton>

                    <AppHeaderLogo />

                    <NoteModalButton {...modalProps}/>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerState}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button component="a" href="/legacy">
                        <ListItemIcon>
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Legacy Site" />
                    </ListItem>
                    <ListItem>
                        <DarkModeToggle {...toggleProps}/>
                    </ListItem>
                </List>
            </Drawer>

            <main className={clsx(classes.content, { [classes.contentShift]: open, })} >

                <div className={classes.drawerHeader} />

                <NotesList {...noteProps}/>

            </main>
        </div>
    );
}