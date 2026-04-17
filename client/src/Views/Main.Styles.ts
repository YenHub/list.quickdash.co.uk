import { Theme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { isMobile } from 'react-device-detect'

import { DRAWER_WIDTH } from '../Services/Utils/constants'

export const useStyles = (darkMode: boolean) =>
  makeStyles(
    (theme: Theme) => ({
      viewsRoot: {
        display: 'flex',
      },
      appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: DRAWER_WIDTH,
      },
      title: {
        margin: 'auto',
        fontSize: '2.5rem',
        color: theme.palette.primary.main,
        fontFamily: ['Dosis', 'serif'].join(','),
      },
      toolBar: {
        backgroundColor: darkMode ? '#303030' : 'white',
      },
      hide: {
        display: 'none',
      },
      drawer: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
      },
      drawerPaper: {
        width: isMobile ? '100%' : DRAWER_WIDTH,
        backgroundColor: darkMode ? '#424242' : '#fff',
      },
      drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
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
        marginLeft: -DRAWER_WIDTH,
        paddingTop: 0,
        paddingBottom: isMobile ? '56px' : '64px',
      },
      contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    }),
    { index: 1 },
  )
