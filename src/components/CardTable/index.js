import React from 'react'
import microMarkdown from '../../helpers/microMarkdown'
import capitalise from '../../helpers/capitalise'
import { getRarityImage } from '../../helpers/getRarity'
import './index.css'

const CardTable = props => (
  <table className='CardTable'>
    <thead>
      <tr>
        <th>Property</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Name</th>
        <td>{props.name}</td>
      </tr>
      <tr>
        <th>Faction</th>
        <td>{capitalise(props.faction)}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>{props.type}</td>
      </tr>
      <tr>
        <th>Rarity</th>
        <td>
          <img src={getRarityImage(props.rarity)} alt={props.rarity} />
          {props.rarity}
        </td>
      </tr>
      <tr>
        <th>Mana</th>
        <td>
          <img
            src='data:image/png;base64,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'
            alt='Mana'
          />
          {props.mana.display}
        </td>
      </tr>
      {props.type !== 'spell' && (
        <tr>
          <th>Strength</th>
          <td>
            <img
              src='data:image/png;base64,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'
              alt='Strength'
            />
            {props.strength.display}
          </td>
        </tr>
      )}
      {props.type === 'unit' && (
        <tr>
          <th>Movement</th>
          <td>
            <img
              src='data:image/png;base64,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'
              alt='Movement'
            />
            {props.movement}
          </td>
        </tr>
      )}
      {!!props.ability.display && (
        <tr>
          <th>Ability</th>
          <td>{microMarkdown(props.ability.display)}</td>
        </tr>
      )}
    </tbody>
  </table>
)

export default CardTable
