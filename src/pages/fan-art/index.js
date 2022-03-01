import React from 'react'
import FanArt from '~/components/FanArt'
import Layout from '~/components/Layout'
import shuffle from '~/helpers/shuffle'
import getArtworks from '~/api/artworks/getArtworks'
import getNavigation from '~/helpers/getNavigation'

export async function getStaticProps({ preview: isPreview = false }) {
  const artworks = shuffle(await getArtworks({ isPreview }))
  const navigation = await getNavigation({ isPreview })

  return {
    props: { artworks, navigation },
    revalidate: 60 * 60 * 24 * 7,
  }
}

const FanArtPage = ({ navigation, cards, ...props }) => (
  <Layout active={['COMMUNITY', 'DISCOVER', 'FAN_ART']} navigation={navigation}>
    <FanArt {...props} />
  </Layout>
)

export default FanArtPage
