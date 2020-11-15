import React from 'react'
import { CATEGORIES } from '../../constants/deck'
import { BRAWLS } from '../../constants/brawl'
import decks from '../../data/decks'
import { CollectionContext } from '../CollectionProvider'
import CardSelect from '../CardSelect'
import CTA from '../CTA'
import FactionSelect from '../FactionSelect'
import MobileTogglableContent from '../MobileTogglableContent'
import Row from '../Row'
import './index.css'

const getAuthors = () => {
  const authors = []

  decks.forEach(deck => {
    if (!authors.includes(deck.author)) authors.push(deck.author)
  })

  return authors.sort((a, b) =>
    a.toLowerCase() < b.toLowerCase()
      ? -1
      : a.toLowerCase() > b.toLowerCase()
      ? +1
      : 0
  )
}

export default React.memo(function DeckSuggestionsFilters(props) {
  const { hasDefaultCollection } = React.useContext(CollectionContext)
  const [name, updateName] = React.useState(props.name)
  const authors = React.useMemo(getAuthors, [])

  return (
    <MobileTogglableContent
      id='deck-suggestions'
      withSymbols
      labelCollapsed='Expand deck filters'
      labelExpanded='Collapse deck filters'
      className='DeckSuggestionsFilters__toggle'
    >
      <form
        onSubmit={event => event.preventDefault()}
        className='DeckSuggestionsFilters'
      >
        <Row>
          <Row.Column>
            <FactionSelect
              value={props.faction}
              onChange={event => props.updateFaction(event.target.value)}
              withAny
            />
          </Row.Column>
          <Row.Column>
            <label htmlFor='category'>Category</label>
            <select
              id='category'
              name='category'
              value={props.category}
              onChange={event => props.updateCategory(event.target.value)}
            >
              <option value='*'>Any</option>
              {Object.keys(CATEGORIES).map(category => (
                <option value={category} key={category}>
                  {CATEGORIES[category]}
                </option>
              ))}
            </select>
          </Row.Column>
        </Row>

        <Row>
          <Row.Column>
            <label htmlFor='name'>Name</label>
            <input
              type='search'
              name='name'
              id='name'
              value={name}
              onChange={event => {
                updateName(event.target.value)
                props.updateName(event.target.value)
              }}
              placeholder='e.g. Reckless Rush'
            />
          </Row.Column>
          <Row.Column>
            <label htmlFor='including'>Including card</label>
            <CardSelect
              name='including'
              id='including'
              current={props.including}
              onChange={option => {
                props.updateIncluding(option ? option.value : null)
              }}
              withSpells
              withClear
            />
          </Row.Column>
        </Row>

        <Row>
          <Row.Column>
            <label htmlFor='author'>Author</label>
            <select
              id='author'
              name='author'
              value={props.author}
              onChange={event => props.updateAuthor(event.target.value)}
            >
              <option value='*'>Any</option>
              {authors.map(author => (
                <option value={author} key={author}>
                  {author}
                </option>
              ))}
            </select>
          </Row.Column>
          <Row.Column>
            <label htmlFor='brawl-modifier'>Brawl</label>
            <select
              id='brawl-modifier'
              name='brawl-modifier'
              value={props.brawl}
              onChange={event => props.updateBrawl(event.target.value)}
              disabled={props.category !== 'BRAWL'}
            >
              <option value='*'>Any</option>
              {BRAWLS.map(brawl => (
                <option value={brawl.id} key={brawl.id}>
                  {brawl.label}
                </option>
              ))}
            </select>
          </Row.Column>
        </Row>
        <Row>
          <Row.Column>
            <label htmlFor='order'>Order</label>
            <select
              id='order'
              name='order'
              value={props.order}
              onChange={event => props.updateOrder(event.target.value)}
            >
              <option value='DATE'>Most recent</option>
              <option value='FACTION'>Faction</option>
              <option value='FEASIBILITY' disabled={hasDefaultCollection}>
                Feasibility
              </option>
            </select>
          </Row.Column>
          <Row.Column style={{ alignSelf: 'flex-end' }}>
            <CTA
              disabled={
                props.author === '*' &&
                props.category === '*' &&
                props.faction === '*' &&
                props.brawl === '*' &&
                !props.including &&
                !props.name
              }
              onClick={props.resetFilters}
            >
              Reset
            </CTA>
          </Row.Column>
        </Row>
      </form>
    </MobileTogglableContent>
  )
})
