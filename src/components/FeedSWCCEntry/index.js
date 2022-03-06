import React from 'react'
import { useFela } from 'react-fela'
import { CardsContext } from '~/components/CardsProvider'
import Link from '~/components/Link'
import FeedEntry from '~/components/FeedEntry'
import Teaser from '~/components/Teaser'
import Spacing from '~/components/Spacing'
import { getCardData } from '~/components/CardBuilderHallOfFame'
import serialization from '~/helpers/serialization'
import styles from './styles'

export default React.memo(function FeedSWCCEntry(props) {
  const { css } = useFela()
  const { cardsIndex } = React.useContext(CardsContext)
  const card = serialization.card.deserialize(cardsIndex, props.winner.id)
  const cardData = getCardData(cardsIndex, props.winner.id)

  return (
    <FeedEntry icon='hammer' date={props.date}>
      {props.user.name} has won the 🥇{' '}
      <Link to='/card/contest'>Stormbound Weekly Card Contest</Link> (season{' '}
      {props.season} week #{props.week}, themed{' '}
      <span className='Highlight'>{props.name}</span>) with a card called{' '}
      <Link to={'/card/' + props.winner.id}>{card.name}</Link>.
      <Spacing top='BASE'>
        <div className={css(styles.container)}>
          <Teaser
            card={cardData}
            title={cardData.name}
            meta={`Week #${props.id} – ${props.name}`}
            to={`/card/${props.winner.id}/display`}
            excerpt={
              <>
                <strong className='Highlight'>Ability:</strong>{' '}
                {cardData.ability}
              </>
            }
          />
        </div>
      </Spacing>
    </FeedEntry>
  )
})
