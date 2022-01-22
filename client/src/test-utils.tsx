import { FC, ReactElement, ReactNode } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { Provider } from 'react-redux'

import Store from './Services/Store'
interface ProviderProps {
  children?: NonNullable<ReactNode>
}

const Providers: FC<ProviderProps> = ({ children }) => (
  <Provider store={Store}>{children}</Provider>
)

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => render(ui, { wrapper: Providers, ...options })

export { customRender as render }
