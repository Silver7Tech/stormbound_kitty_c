import React from 'react'
import Banner from '../Banner'
import MemberSection from '../MemberSection'

const MemberGuides = React.memo(function MemberGuides(props) {
  if (props.guides.length === 0) return null

  return (
    <MemberSection title={<>Guides by {props.displayName}</>}>
      {props.guides.map(guide => {
        return (
          <Banner
            faction={guide.faction}
            title={guide.name}
            subline={`By ${guide.author}`}
            copy={guide.excerpt}
            cta={{
              'aria-label': `Read ${guide.name} by ${guide.author}`,
              to: guide.link,
              children: 'Read guide',
            }}
            image={guide.image}
          />
        )
      })}
    </MemberSection>
  )
})

export default MemberGuides
