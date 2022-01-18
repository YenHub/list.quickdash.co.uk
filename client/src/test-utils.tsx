import { FC, ReactElement, ReactNode } from 'react'

import { render, RenderOptions, RenderResult } from '@testing-library/react'

import { StateProvider } from './Services/State/Store'

interface ProviderProps {
  children?: NonNullable<ReactNode>
}

const Providers: FC<ProviderProps> = ({ children }) => (
  <StateProvider>{children}</StateProvider>
)

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => render(ui, { wrapper: Providers, ...options })

export { customRender as render }
