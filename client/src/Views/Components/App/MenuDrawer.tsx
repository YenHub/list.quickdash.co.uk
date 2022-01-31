import { FC } from 'react'

import { Divider, Drawer, IconButton, List, ListItem } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { isMobile } from 'react-device-detect'

import { showGatedFeatures } from '../../../Services/ReactUtils'
import { ToggleTypes } from '../../../Services/State/Store'
import { useStyles } from '../../Main.Styles'
import { DeleteNotes, ExportButton, ImportButton } from '../ActionButtons'
import ShareButtons from '../ShareButtons'
import MenuToggle from '../Toggles'
import { useAppSelector } from '../../../Services/Store'
import { ColourPicker } from './ColorPicker'

export const AppMenuDrawer: FC<{
  open: boolean
  handleDrawerState(): void
}> = ({ open, handleDrawerState }) => {
  const { darkMode, mdMode, previewMode } = useAppSelector(
    ({ settings }) => settings,
  )
  const classes = useStyles(darkMode)()

  const DrawerHeader: FC = () => (
    <div className={classes.drawerHeader}>
      <IconButton data-testid="close-menu-button" onClick={handleDrawerState}>
        <ChevronLeftIcon />
      </IconButton>
    </div>
  )

  const ImportListItem: FC = () => (
    <ListItem>
      <ImportButton />
    </ListItem>
  )

  const ExportListItem: FC = () => (
    <ListItem>
      <ExportButton />
    </ListItem>
  )

  const MenuItems: FC = () => (
    <List>
      {showGatedFeatures && <ExportListItem />}
      {showGatedFeatures && <ImportListItem />}
      <ListItem>
        <DeleteNotes />
      </ListItem>
      <Divider style={{ marginTop: '0.75em' }} />
      <ColourPicker />
      <Divider style={{ marginTop: '0.75em' }} />
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
      {mdMode && !isMobile && (
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
      <Divider />
    </List>
  )

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
  )
}
