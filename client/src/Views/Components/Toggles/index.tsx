import { FC, Fragment } from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'

import { ToggleTypes } from '../../../Services/State/Store'
import { useAppDispatch } from '../../../Services/Store'
import {
  toggleDarkMode,
  toggleMdMode,
  togglePreviewMode,
} from '../../../Services/Reducers/settingSlice'

interface ToggleProps {
  state: boolean
  dispatchType: ToggleTypes
  label: string
  qaId: string
}

export const MenuToggle: FC<ToggleProps> = ({
  state,
  dispatchType,
  label,
  qaId,
}) => {
  const dispatch = useAppDispatch()

  let actionType: ActionCreatorWithoutPayload

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

  const toggleChecked = () => dispatch(actionType())

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
