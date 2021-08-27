import React from 'react'
import isEqual from 'lodash.isequal'
import serialisation from '~/helpers/serialisation'
import areAllValuesEqual from '~/helpers/areAllValuesEqual'
import resolveAbility from '~/helpers/resolveAbility'
import useNavigator from '~/hooks/useNavigator'

const formatLevelProp = value => ({
  values: [null, null, null, null, null].fill(value),
  display: value,
})

const resolveLevels = (value = '') => {
  const chunks = value.split('/')
  const values = Array.from(
    { length: 5 },
    (_, index) => chunks[index] || chunks[0] || null
  )
  // If all values are the same, visually shorten it for simplicity
  // Consider all values to be the same if there are 5 identical of them
  const allSame = chunks.length === 5 && areAllValuesEqual(chunks)
  const display = allSame ? chunks[0] : value

  return { values, display }
}

const INITIAL_STATE = {
  name: '',
  imageURL: '',
  imageCardId: null,
  rarity: 'common',
  faction: 'neutral',
  race: null,
  elder: false,
  hero: false,
  type: 'unit',
  movement: null,
  mana: formatLevelProp(null),
  strength: formatLevelProp(null),
  ability: formatLevelProp(null),
}

const useCardBuilderEditor = props => {
  const navigator = useNavigator()
  const imageErrorDialog = React.useRef(null)
  const [cardData, setCardData] = React.useState({
    ...INITIAL_STATE,
    ...props.card,
  })

  const reset = React.useCallback(() => setCardData(INITIAL_STATE), [])

  React.useEffect(() => {
    // Safari has a limit of 100 `history.pushState()` per 30 seconds window, so
    // we should fail silently if it’s not possible to update the URL anymore.
    try {
      const isDefaultState = isEqual(cardData, INITIAL_STATE)
      const data = {
        ...cardData,
        strength: cardData.strength.display,
        mana: cardData.mana.display,
        ability: cardData.ability.display,
      }

      navigator.replace(
        ['/card', isDefaultState ? '' : serialisation.card.serialise(data)]
          .filter(Boolean)
          .join('/')
      )
    } catch {}
    // eslint-disable-next-line
  }, [cardData])

  const setProperty =
    (key, transform = v => v) =>
    value =>
      setCardData(cardData => ({ ...cardData, [key]: transform(value) }))

  const setName = setProperty('name')
  const setRarity = setProperty('rarity')
  const setMovement = setProperty('movement')
  const setFaction = setProperty('faction')
  const setMana = setProperty('mana', resolveLevels)
  const setStrength = setProperty('strength', resolveLevels)
  const setRace = setProperty('race')
  const setElder = setProperty('elder')
  const setHero = setProperty('hero')
  const setAbility = setProperty('ability', resolveAbility)

  const setType = React.useCallback(type => {
    // If the new type is a spell, disable movement, strength, race and unit
    // modifiers
    if (type === 'spell') {
      setCardData(cardData => ({
        ...cardData,
        type,
        race: null,
        elder: false,
        hero: false,
        movement: null,
        strength: formatLevelProp(null),
      }))
    }

    // If the new type is a structure, disable movement, race and unit modifiers
    // and if the current type is a spell, enable strength
    else if (type === 'structure') {
      setCardData(cardData => ({
        ...cardData,
        type,
        race: null,
        elder: false,
        hero: false,
        movement: null,
        strength:
          cardData.type === 'spell' ? formatLevelProp(null) : cardData.strength,
      }))
    }

    // If the new type is a unit, enable movement and strength
    else {
      setCardData(cardData => ({
        ...cardData,
        type,
        movement: cardData.type !== 'unit' ? null : cardData.movement,
        strength:
          cardData.type === 'spell' ? formatLevelProp(null) : cardData.strength,
      }))
    }
  }, [])

  const setImageCardId = React.useCallback(
    id =>
      setCardData(cardData => ({
        ...cardData,
        imageCardId: id,
        imageURL: id ? '' : cardData.imageURL,
      })),
    []
  )

  const setImageURL = React.useCallback(
    imageURL =>
      setCardData(cardData => ({ ...cardData, imageURL, imageCardId: null })),
    []
  )

  const onImagePaste = React.useCallback(event => {
    const image = new Image()
    const data = event.clipboardData.getData('text')
    image.src = data
    image.onerror = () => imageErrorDialog.current.show(data)
  }, [])

  const setters = {
    setName,
    setImageCardId,
    setImageURL,
    setRarity,
    setMana,
    setFaction,
    setType,
    setRace,
    setElder,
    setHero,
    setMovement,
    setStrength,
    setAbility,
    onImagePaste,
    reset,
    imageErrorDialogRef: dialog => (imageErrorDialog.current = dialog),
  }

  return { card: cardData, setters }
}

export default useCardBuilderEditor