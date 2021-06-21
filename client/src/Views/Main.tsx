import { FC } from 'react';
import 'typeface-dosis';
import clsx from 'clsx';
import { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { store, ToggleTypes } from '../Services/State/Store';

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

import MenuToggle from './Components/Toggles';
import NotesList from './Components/NotesList';
import { ExportButton, ImportButton, DeleteNotes } from './Components/ActionButtons';
import CreateNoteModal from './Components/CreateNoteModal';
import ShareButtons from './Components/ShareButtons';

import NoteStore from '../Services/Database/NoteStore';
export const noteStore = new NoteStore();

const showGatedFeatures = process.env.NODE_ENV === 'development';
const drawerWidth = 240;

const useStyles = (darkMode: boolean) => makeStyles(theme => ({
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

const Main: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { darkMode, mdMode, previewMode } = state;
    const { getNotes } = noteStore;

    const classes = useStyles(darkMode)();

    const [open, setOpen] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editNoteId, setEditNoteId] = useState<string>('');

    const modalProps = { modalOpen, setModalOpen, editNoteId, setEditNoteId };

    const handleDrawerState = (): void => setOpen(open => !open);

    const attemptImport = (): void => {
        getNotes().then(storedNotes => dispatch({ type: 'SetNotes', payload: storedNotes }));
    };

    // Were using this emtpy [] purposefully and with intent
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(attemptImport, []);

    const AppHeader: FC = () => {

        const AppHeaderLogo: FC = () => (
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
                        <SettingsIcon fontSize="large" />
                    </IconButton>

                    <AppHeaderLogo />

                    <CreateNoteModal {...modalProps} />
                </Toolbar>
            </AppBar>
        );

    };

    const AppMenuDrawer: FC = () => {

        const DrawerHeader: FC = () => (
            <div className={classes.drawerHeader}>
                <IconButton data-testid="close-menu-button" onClick={handleDrawerState}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
        );

        const ImportListItem: FC = () => (
            <ListItem>
                <ImportButton />
            </ListItem>
        );

        const ExportListItem: FC = () => (
            <ListItem>
                <ExportButton />
            </ListItem>
        );

        const MenuItems: FC = () => (
            <List>
                {showGatedFeatures ? <ExportListItem /> : null}
                {showGatedFeatures ? <ImportListItem /> : null}
                <ListItem>
                    <DeleteNotes />
                </ListItem>
                <ListItem>
                    <MenuToggle
                        state={darkMode}
                        dispatchType={ToggleTypes.DarkModeToggle}
                        label="Dark Mode"
                        qaId="dm-toggle"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <MenuToggle
                        state={mdMode}
                        dispatchType={ToggleTypes.MarkDownToggle}
                        label="Enable MarkDown"
                        qaId="md-toggle"
                    />
                </ListItem>
                {(mdMode && !isMobile) && (
                    <div>
                        <Divider />
                        <ListItem>
                            <MenuToggle
                                state={previewMode}
                                dispatchType={ToggleTypes.PreviewModeToggle}
                                label="Always Show Preview"
                                qaId="md-preview-toggle"
                            />
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

    const MainContentWindow: FC = () => (
        <main className={clsx(classes.content, { [classes.contentShift]: open })} >
            <div className={classes.drawerHeader} />
            <NotesList setEditNoteId={setEditNoteId} />
        </main>
    );

    return (
        <div className={classes.root}>
            <AppHeader />
            <AppMenuDrawer />
            <MainContentWindow />
        </div>
    );
};

export default Main;
