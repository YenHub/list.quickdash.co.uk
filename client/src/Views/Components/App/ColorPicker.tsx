import { FC, useState } from 'react'
import { ColorPicker } from 'mui-color'
import { ListItem, useTheme } from '@mui/material'
import { ResetColours, SaveColours } from '../ActionButtons'

interface IPicker {
  value: string
  setValue(val: string): void
}

const Picker: FC<IPicker> = ({ value, setValue }) => (
  <ColorPicker
    value={value}
    hideTextfield
    onChange={color => setValue(`#${(color as { hex: string }).hex}`)}
  />
)

export const ColourPicker: FC = () => {
  const theme = useTheme()
  const [primary, setPrimary] = useState(theme.palette.primary.main)
  const [secondary, setSecondary] = useState(theme.palette.secondary.main)

  return (
    <>
      <ListItem>
        <Picker value={primary} setValue={setPrimary} />
        Primary Colour
      </ListItem>
      <ListItem>
        <Picker value={secondary} setValue={setSecondary} />
        Secondary Colour
      </ListItem>
      <ListItem>
        <SaveColours primary={primary} secondary={secondary} />
      </ListItem>
      <ListItem>
        <ResetColours />
      </ListItem>
    </>
  )
}
