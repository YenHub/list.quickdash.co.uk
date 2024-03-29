import { screen } from '@testing-library/react'
import { initApp, openMainMenu, openNoteModal } from '../../test-helpers'

describe('UI Rendering', () => {
  test('Header & Welcome List Renders', async () => {
    await initApp()
    const pageTitle = screen.getByTestId('header-title')
    expect(pageTitle).toBeInTheDocument()
    const welcomeItems = await screen.findAllByText(
      /(Welcome To QuickList|Use the icons)/i,
    )
    expect(welcomeItems).toHaveLength(2)
  })

  test('Menu Renders', async () => {
    await initApp()
    openMainMenu()
    // Test for
    expect(screen.getByTestId('delete-all-notes')).toBeInTheDocument()
  })

  test('Note Modal Renders', async () => {
    await initApp()
    openNoteModal()
    const descriptionInput = screen.getByTestId('description-input')
    expect(descriptionInput).toBeInTheDocument()
  })
})
