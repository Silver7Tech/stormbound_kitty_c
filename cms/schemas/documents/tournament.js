import { MdAutoAwesome } from 'react-icons/md'
import user from '../types/user'
import date from '../types/date'
import deckId from '../types/deckId'
import { formatDate } from '~/helpers/formatDate'

const tournament = {
  title: 'Tournament',
  name: 'tournament',
  type: 'document',
  icon: MdAutoAwesome,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      title: 'Type',
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'Tournament', value: 'TOURNAMENT' },
          { title: 'Joust', value: 'JOUST' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    date,
    {
      title: 'Description',
      name: 'description',
      type: 'string',
    },
    {
      title: 'Users',
      name: 'users',
      type: 'array',
      of: [user],
      validation: Rule => Rule.required(),
    },
    {
      title: 'Podium',
      name: 'podium',
      description:
        'The gold, silver and bronze places respectively (either individuals or teams).',
      type: 'array',
      of: [
        {
          title: 'Team',
          name: 'team',
          type: 'object',
          fields: [
            {
              title: 'Players',
              name: 'team',
              type: 'array',
              of: [user],
            },
          ],
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.required().min(1).max(3),
    },
    {
      title: 'Decks',
      name: 'decks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { ...deckId, name: 'id' },
            {
              title: 'Name',
              name: 'name',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Date, New',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      date: 'date',
    },
    prepare({ name, date }) {
      return {
        title: name || 'Missing name',
        subtitle: formatDate(date) || 'Missing date',
      }
    },
  },
}

export default tournament
