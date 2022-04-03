import React from 'react'
import About from '~/components/About'
import Layout from '~/components/Layout'
import getContributions from '~/api/contributions/getContributions'
import getDonations from '~/api/donations/getDonations'
import getSiteSettings from '~/api/misc/getSiteSettings'
import uniqueBy from '~/helpers/uniqueBy'

export async function getStaticProps({ preview: isPreview = false }) {
  const donations = await getDonations({ order: 'user.name asc', isPreview })
  const contributions = await getContributions({
    order: 'user.name asc',
    isPreview,
  })
  const donators = uniqueBy(
    donations.map(({ user }) => user),
    'name'
  )
  const contributors = uniqueBy(
    contributions.map(({ user }) => user),
    'name'
  )
  const settings = await getSiteSettings({ isPreview })

  return { props: { settings, contributors, donators } }
}

const AboutPage = ({ settings, ...props }) => (
  <Layout active={['HOME', 'HOME', 'ABOUT']} settings={settings}>
    <About {...props} />
  </Layout>
)

export default AboutPage
