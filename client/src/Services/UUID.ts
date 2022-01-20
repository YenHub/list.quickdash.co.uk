import { v4 as uuid } from 'uuid'
import { NoteItem } from './Database/NoteClient'

export const getUniqueId = (noteState?: NoteItem[]): NoteItem['id'] => {
  let id: string = uuid()

  if (!noteState) return id

  const hasDupes = () => noteState.some(note => note.id === id)
  let sanityCounter = 5
  while (sanityCounter && hasDupes()) {
    id = uuid()
    sanityCounter--
    if (sanityCounter === 1) throw new Error('[UUID]: Unable to getUniqueId')
  }

  return id
}
