import { v4 as uuid } from 'uuid'

import { showGatedFeatures } from '../Utils/ReactUtils'
import { type NoteItem } from './NoteClient'

const DefaultNotes: NoteItem[] = [
  {
    id: uuid(),
    primary: 'Welcome to QuickList 🚀',
    // prettier-ignore
    secondary:
      '\n  • QuickList is a simple clutter free tool designed to help organise chaos using a good old fashioned list 😎\n' +
      '  • Your list is stored locally on your device, so it\'s secure and available to you anytime, even while you\'re offline\n',
  },
  {
    id: uuid(),
    primary: 'Use the icons to edit or delete this note 👀',
    secondary:
      'You can create new notes using the ➕ icon at the top of this page\n' +
      'There is also an option to delete all items in the main menu',
  },
  {
    id: uuid(),
    primary: 'Drag & drop items to rearrange them in the list 🔃',
    secondary: 'New items you create are added to the top of your list',
  },
  {
    id: uuid(),
    primary: 'Installing the app 💾',
    secondary:
      'Visit using your mobile to add QuickList to your homescreen now\n' +
      'If you are visiting using a desktop, you can also install using the link in the address bar\n\n' +
      'Not so old fashioned anymore, hey? 😉',
  },
  {
    id: uuid(),
    primary: 'UPDATE: You can now use markdown in your descriptions! 🎉',
    secondary: 'Head on over to settings to enable the feature 😎',
  },
]

if (showGatedFeatures) {
  const betaWarning: NoteItem = {
    id: uuid(),
    primary: 'QUICKLIST BETA',
    secondary:
      '## WARNING\n\n' +
      'You are currently in the beta environment\n\n' +
      'Visit the [live site here](https://list.quickdash.co.uk)',
  }
  DefaultNotes.splice(0, DefaultNotes.length, betaWarning).reverse()
}

export { DefaultNotes }
