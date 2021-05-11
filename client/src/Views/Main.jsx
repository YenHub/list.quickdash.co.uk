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
} from '@material-ui/core';

import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { isMobile } from 'react-device-detect';

import NotesList from './Components/NotesList';
import DarkModeToggle from './Components/DarkModeToggle';
import MDToggle, { MDPreviewToggle }from './Components/MDToggle';
import { ExportButton, ImportButton, DeleteNotes } from './Components/ActionButtons';
import CreateNoteModal from './Components/CreateNoteModal'
import ShareButtons from './Components/ShareButtons'

import NoteStore from '../Services/Database/NoteStore';
const noteStore = new NoteStore();

const showGatedFeatures = process.env.NODE_ENV === 'development';
const drawerWidth = 240;

const useStyles = darkMode => makeStyles((theme) => ({
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

export default function Main({ darkMode, setDarkMode, mdMode, setMDMode, previewMode, setPreviewMode }) {

    const classes = useStyles(darkMode)();

    const [open, setOpen] = useState(false);

    const [noteState, setNoteState] = useState(null);
    const noteProps = { darkMode, mdMode, noteState, setNoteState, previewMode };
    const toggleProps = { ...noteProps, setDarkMode };
    const mdToggleProps = { ...noteProps, setMDMode };
    const mdPreviewProps = { ...noteProps, setPreviewMode };

    const [modalOpen, setModalOpen] = useState(false);
    const [editNoteId, setEditNoteId] = useState(false);
    const modalProps = { ...noteProps, modalOpen, setModalOpen, editNoteId, setEditNoteId, darkMode, mdMode };

    const getItems = async () => setNoteState(await noteStore.getNotes());

    const handleDrawerState = () => setOpen(open => !open);

    const attemptImport = () => !noteState && getItems();

    // Were using this emtpy [] purposefully and with intent
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(attemptImport, []);

    useEffect( () => noteStore.setNotes(noteState), [noteState] );

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
                        data-testid="menu-button"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerState}
                        className={clsx(open && classes.hide)}
                    >
                        <SettingsIcon fontSize="large"/>
                    </IconButton>

                    <AppHeaderLogo />

                    <CreateNoteModal {...modalProps}/>
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

        const ImportListItem = () => (
            <ListItem>
                <ImportButton noteState={noteState} setNoteState={setNoteState}/>
            </ListItem>
        );

        const ExportListItem = () => (
            <ListItem>
                <ExportButton noteState={noteState} setNoteState={setNoteState}/>
            </ListItem>
        );

        const MenuItems = () => (
            <List>
                {showGatedFeatures ? <ExportListItem /> : null}
                {showGatedFeatures ? <ImportListItem /> : null}
                <ListItem>
                    <DeleteNotes noteState={noteState} setNoteState={setNoteState}/>
                </ListItem>
                <ListItem>
                    <DarkModeToggle {...toggleProps}/>
                </ListItem>
                <Divider />
                <ListItem>
                    <MDToggle {...mdToggleProps}/>
                </ListItem>
                { (mdMode && !isMobile) && (
                    <div>
                        <Divider />
                        <ListItem>
                            <MDPreviewToggle {...mdPreviewProps}/>
                        </ListItem>
                    </div>
                )}
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
                <ShareButtons />
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