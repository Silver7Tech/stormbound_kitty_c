import React from 'react'
import './index.css'

const Mana = React.memo(function Mana(props) {
  return (
    <div
      className={['Mana', props.disabled && 'Mana--disabled', props.className]
        .filter(Boolean)
        .join(' ')}
      data-testid={props['data-testid'] || 'mana'}
    >
      <img
        className='Mana__image'
        src='data:image/png;base64,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'
        alt=''
      />
      <span className='Mana__value'>{props.mana}</span>
    </div>
  )
})

export default Mana
