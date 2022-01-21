import { FC, Fragment, useContext } from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'

import { store, ToggleTypes } from '../../../Services/State/Store'

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
  const globalState = useContext(store)
  const { dispatch } = globalState

  const toggleChecked = (): void => dispatch({ type: dispatchType })

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
