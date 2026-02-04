import { FC, Fragment } from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'

import { useAppStore } from '../../../Services/Store'
import { ToggleTypes } from '../../../Services/Types'

interface ToggleProps {
  state: boolean
  dispatchType: ToggleTypes
  label: string
  qaId: string
}

export const MenuToggle: FC<ToggleProps> = ({ state, dispatchType, label, qaId }) => {
  let actionType: () => void

  const { togglePreviewMode, toggleDarkMode, toggleMdMode } = useAppStore(state => ({
    togglePreviewMode: state.togglePreviewMode,
    toggleDarkMode: state.toggleDarkMode,
    toggleMdMode: state.toggleMdMode,
  }))

  switch (dispatchType) {
    case ToggleTypes.DarkModeToggle:
      actionType = toggleDarkMode
      break
    case ToggleTypes.MarkDownToggle:
      actionType = toggleMdMode
      break
    case ToggleTypes.PreviewModeToggle:
      actionType = togglePreviewMode
      break
    default:
      return null
  }

  const toggleChecked = () => actionType()

  return (
    <Fragment>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              data-testid={qaId}
              checked={state}
              onChange={toggleChecked}
              color="primary"
            />
          }
          label={label}
        />
      </FormGroup>
    </Fragment>
  )
}

export default MenuToggle
