import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Divider, Drawer, IconButton, List, ListItem } from '@mui/material'
import { type FC } from 'react'
import { isMobile } from 'react-device-detect'

import { useAppStore } from '../../../Services/Store'
import { showGatedFeatures } from '../../../Services/Utils/ReactUtils'
import { useStyles } from '../../Main.Styles'
import { DeleteNotes, ExportButton, ImportButton } from '../ActionButtons'
import { ShareButton } from '../ActionButtons/ShareButton'
import ShareButtons from '../ShareButtons'
import MenuToggle from '../Toggles'
import { ColourPicker } from './ColorPicker'

const DrawerHeader: FC<{ className: string; onClick(): void }> = ({
  className,
  onClick,
}) => (
  <div className={className}>
    <IconButton data-testid="close-menu-button" onClick={onClick}>
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

const ShareList: FC = () => (
  <ListItem>
    <ShareButton />
  </ListItem>
)

const MenuItems: FC = () => {
  const { previewMode, darkMode, mdMode } = useAppStore(state => ({
    previewMode: state.settings.previewMode,
    darkMode: state.settings.darkMode,
    mdMode: state.settings.mdMode,
  }))

  return (
    <List>
      {showGatedFeatures && <ShareList />}
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
          dispatchType={'DarkModeToggle'}
          label="Dark Mode"
          qaId="dm-toggle"
        />
      </ListItem>
      <Divider />
      <ListItem>
        <MenuToggle
          state={mdMode}
          dispatchType={'MarkDownToggle'}
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
              dispatchType={'PreviewModeToggle'}
              label="Always Show Preview"
              qaId="md-preview-toggle"
            />
          </ListItem>
        </div>
      )}
      <Divider />
    </List>
  )
}

export const AppMenuDrawer: FC<{
  open: boolean
  handleDrawerState(): void
}> = ({ open, handleDrawerState }) => {
  const { darkMode } = useAppStore(state => ({
    darkMode: state.settings.darkMode,
  }))

  const classes = useStyles(darkMode)({})

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
      <DrawerHeader
        className={classes.drawerHeader}
        onClick={handleDrawerState}
      />
      <Divider />
      <MenuItems />
      <ShareButtons />
    </Drawer>
  )
}
