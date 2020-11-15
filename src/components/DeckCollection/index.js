import React from 'react'
import serialize from 'form-serialize'
import { PersonalDecksContext } from '../PersonalDecksProvider'
import { NotificationContext } from '../NotificationProvider'
import { CATEGORIES } from '../../constants/deck'
import ExportDecks from '../ExportDecks'
import HeaderBanner from '../HeaderBanner'
import ImportDecks from '../ImportDecks'
import PageMeta from '../PageMeta'
import Row from '../Row'
import Title from '../Title'
import YourDecks from '../YourDecks'
import YourDecksFilters from '../YourDecksFilters'
import getDeckIDFromURL from '../../helpers/getDeckIDFromURL'
import getFactionFromDeckID from '../../helpers/getFactionFromDeckID'
import './index.css'

const getDeckFromForm = form => {
  const formData = serialize(form, { hash: true })
  formData.id = getDeckIDFromURL(formData.id)
  formData.faction = getFactionFromDeckID(formData.id)
  return formData
}

export default React.memo(function DeckCollection(props) {
  const context = React.useContext(PersonalDecksContext)
  const { toggleUnseen } = context
  const [mode, setMode] = React.useState('INITIAL')
  const [editedDeckUUID, setEditedDeckUUID] = React.useState(null)
  const [filters, setFilters] = React.useState({
    name: '',
    faction: '*',
    category: '*',
    order: 'DATE',
  })
  const { notify: sendNotification } = React.useContext(NotificationContext)
  const displayedDecks = context.decks
    .filter(deck => {
      if (
        filters.name &&
        !deck.name.toLowerCase().includes(filters.name.toLowerCase())
      )
        return false
      if (
        filters.faction !== '*' &&
        getFactionFromDeckID(deck.id) !== filters.faction
      )
        return false
      if (
        filters.category !== '*' &&
        deck.category !== filters.category &&
        // Look up for existing categories as well, as the label is used to
        // avoid rendering all uppercase categories.
        CATEGORIES[deck.category] !== filters.category
      )
        return false
      return true
    })
    .slice(0)
    .sort((a, b) => {
      if (filters.order === 'FACTION') {
        if (getFactionFromDeckID(a.id) > getFactionFromDeckID(b.id)) return +1
        if (getFactionFromDeckID(a.id) < getFactionFromDeckID(b.id)) return -1
      } else if (filters.order === 'CATEGORY') {
        if (a.category > b.category) return +1
        if (a.category < b.category) return -1
      } else if (filters.order === 'NAME') {
        if (a.name < b.name) return -1
        if (a.name > b.name) return +1
      }

      return 0
    })

  const notify = React.useCallback(
    message => sendNotification({ icon: 'stack', children: message }),
    [sendNotification]
  )

  const disabledEditor = React.useCallback(() => {
    setMode('INITIAL')
    setEditedDeckUUID(null)
  }, [])

  const enableEditor = React.useCallback(uuid => {
    setMode('EDITOR')
    setEditedDeckUUID(uuid)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = event => event.which === 27 && disabledEditor()

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [disabledEditor])

  React.useEffect(() => toggleUnseen(false), [toggleUnseen])

  // If the collection of decks is updated, it is as the result of an addition,
  // a removal or an edition, which means the editing mode can be cancelled.
  React.useEffect(disabledEditor, [context.decks, disabledEditor])

  const addDeck = React.useCallback(
    event => {
      event.preventDefault()
      const formData = getDeckFromForm(event.target)
      // This check is effectively performed on the deck ID and not the UUID
      // because this is about telling the user they have already recorded that
      // deck and therefore it is not going to be added again.
      const existingDeck = context.decks.find(deck => deck.id === formData.id)

      if (existingDeck) {
        notify(
          `This deck already exists in your collection as ‘${existingDeck.name}’.`
        )
      } else {
        context.addDeck(formData)
      }
    },
    [context, notify]
  )

  const editDeck = React.useCallback(
    event => {
      event.preventDefault()
      context.updateDeck(editedDeckUUID, getDeckFromForm(event.target))
    },
    [context, editedDeckUUID]
  )

  return (
    <>
      <HeaderBanner title='Personal Decks' />

      <Row desktopOnly wideGutter>
        <Row.Column width='1/3'>
          <Title>What is this</Title>
          <p>
            This is your own personal deck collection. You can add, update and
            remove decks at will to go beyond the 9-decks in-game limitation.
          </p>
          <p>
            Decks are locally saved in your browser, and you can also export
            (and import) them as CSV for syncing between devices or more
            permanent backup.
          </p>

          <YourDecksFilters {...filters} setFilters={setFilters} />

          <div className='DeckCollection__actions'>
            <Row>
              <Row.Column>
                <ImportDecks />
              </Row.Column>
              <Row.Column>
                <ExportDecks />
              </Row.Column>
            </Row>
          </div>
        </Row.Column>

        <Row.Column width='2/3'>
          <Title>Your decks</Title>
          <YourDecks
            decks={displayedDecks}
            onEdit={uuid => enableEditor(uuid)}
            disabledEditor={disabledEditor}
            editedDeckUUID={editedDeckUUID}
            editDeck={editDeck}
            mode={mode}
            setMode={setMode}
            addDeck={addDeck}
          />
        </Row.Column>
      </Row>
      <PageMeta
        title='Your decks'
        description='Bookmark and manage your own deck, with a local backup and CSV import/export'
      />
    </>
  )
})
