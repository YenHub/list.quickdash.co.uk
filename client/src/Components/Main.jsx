import 'typeface-dosis';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
import { ExportButton, ImportButton, DeleteNotes } from './Custom/ActionButtons';
import NoteModal from './Custom/NoteModal/Modal'

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
    const toggleProps = { ...noteProps, setDarkMode };

    const [modalOpen, setModalOpen] = useState(false);
    const [editNoteId, setEditNoteId] = useState(false);
    const modalProps = { ...noteProps, modalOpen, setModalOpen, editNoteId, setEditNoteId };

    const getItems = async () => setNoteState(await noteStore.getNotes());

    const handleDrawerState = () => setOpen(open => !open);

    useEffect(() => {
        if (!noteState) {
            getItems();
        }
    }, []);

    useEffect(() => {

        if (noteState) {
            noteStore.setLegacyNotes(noteState);
            noteStore.setNotes(noteState);
        }

    }, [noteState]);

    const AppHeader = () => {

        const AppHeaderLogo = () => (
            <Typography variant="h1" noWrap className={classes.title}>
                QuickList
            </Typography>
        );

        return (
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

                    <NoteModal {...modalProps}/>
                </Toolbar>
            </AppBar>
        );

    };

    const AppMenuDrawer = () => {

        const DrawerHeader = () => (
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerState}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
        );

        const MenuItems = () => (
            <List>
                <ListItem button component="a" href="/legacy">
                    <ListItemIcon>
                        <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Legacy Site" />
                </ListItem>
                <ListItem>
                    <ExportButton noteState={noteState}/>
                </ListItem>
                <ListItem>
                    <ImportButton noteState={noteState} setNoteState={setNoteState}/>
                </ListItem>
                <ListItem>
                    <DeleteNotes noteState={noteState} setNoteState={setNoteState}/>
                </ListItem>
                <ListItem>
                    <DarkModeToggle {...toggleProps}/>
                </ListItem>
            </List>
        );

        return (
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <DrawerHeader />
                <Divider />
                <MenuItems />
            </Drawer>
        );
    };

    const MainContentWindow = () => (
        <main className={clsx(classes.content, { [classes.contentShift]: open, })} >
            <div className={classes.drawerHeader} />
            <NotesList setEditNoteId={setEditNoteId} {...noteProps}/>
        </main>
    );

    return (
        <div className={classes.root}>
            <AppHeader />
            <AppMenuDrawer />
            <MainContentWindow />
        </div>
    );
}