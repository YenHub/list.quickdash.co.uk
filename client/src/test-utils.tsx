import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ReactElement } from 'react'

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => render(ui, { ...options })
