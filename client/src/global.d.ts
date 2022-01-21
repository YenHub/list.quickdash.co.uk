/* eslint-disable @typescript-eslint/no-unused-vars */
import { Theme } from '@mui/material/styles'
import { ButtonPropsColorOverrides } from '@material-ui/core/Button/Button'
/* eslint-enable @typescript-eslint/no-unused-vars */

declare module '@mui/material' {
  interface ButtonPropsColorOverrides {
    neutral: true
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary']
  }
}
