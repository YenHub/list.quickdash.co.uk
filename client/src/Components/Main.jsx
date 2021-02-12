import 'typeface-dosis';
import React from 'react';
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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { isMobile } from 'react-device-detect';

import NotesList from './NotesList';
import DarkModeToggle from './Custom/DarkModeToggle';

export default function Main({ darkMode, setDarkMode }) {

    const darkModeProps = { darkMode, setDarkMode };

    const [open, setOpen] = React.useState(false);

    const drawerWidth = 240;

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
            width: drawerWidth,
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

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
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
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h1" noWrap className={classes.title}>
                        QuickList
                    </Typography>
                    {/* <span className={classes.title}>QuickList</span> */}
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
                    <IconButton onClick={handleDrawerClose}>
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
                        <DarkModeToggle {...darkModeProps}/>
                    </ListItem>
                </List>
            </Drawer>

            <main className={clsx(classes.content, { [classes.contentShift]: open, })} >

                <div className={classes.drawerHeader} />

                <NotesList {...darkModeProps}/>

            </main>
        </div>
    );
}