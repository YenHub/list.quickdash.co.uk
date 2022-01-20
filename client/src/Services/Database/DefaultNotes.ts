import { showGatedFeatures } from '../ReactUtils'
import { NoteItem } from './NoteClient'

const DefaultNotes: NoteItem[] = [
  {
    id: '4a11b44b-3f04-4f56-b468-ea36c091b03d',
    primary: 'Welcome to QuickList 🚀',
    // prettier-ignore
    secondary:
      '\n  • QuickList is a simple clutter free tool designed to help organise chaos using a good old fashioned list 😎\n' +
      '  • Your list is stored locally on your device, so it\'s secure and available to you anytime, even while you\'re offline\n',
  },
  {
    id: 'bca2f4a9-d510-4d6e-9b47-28c9fcc8ca07',
    primary: 'Use the icons to edit or delete this note 👀',
    secondary:
      'You can create new notes using the ➕ icon at the top of this page\n' +
      'There is also an option to delete all items in the main menu',
  },
  {
    id: 'dca2f4a9-d510-4d6e-9b47-28c9fcc8ca08',
    primary: 'Drag & drop items to rearrange them in the list 🔃',
    secondary: 'New items you create are added to the top of your list',
  },
  {
    id: '13a83e99-ea71-4505-81d0-92de5638a5dg',
    primary: 'Installing the app 💾',
    secondary:
      'Visit using your mobile to add QuickList to your homescreen now\n' +
      'If you are visiting using a desktop, you can also install using the link in the address bar\n\n' +
      'Not so old fashioned anymore, hey? 😉',
  },
  {
    id: '03a83e99-ea71-4505-81d0-92de5638a5df',
    primary: 'UPDATE: You can now use markdown in your descriptions! 🎉',
    secondary: 'Head on over to settings to enable the feature 😎',
  },
]

if (showGatedFeatures) {
  const betaWarning: NoteItem = {
    id: '4a11b44b-3f04-4f56-b468-ea36c091b04g',
    primary: 'QUICKLIST BETA',
    secondary:
      '## WARNING\n\n' +
      'You are currently in the beta environment\n\n' +
      'Visit the [live site here](https://list.quickdash.co.uk)',
  }
  DefaultNotes.splice(0, DefaultNotes.length, betaWarning).reverse()
}

export { DefaultNotes }
