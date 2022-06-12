import * as React from 'react'
import { Link } from 'gatsby'

import isoToLocaleString from '../utilities/isoToLocaleString.js'
import slugify from '../utilities/slugify.js'

import * as mainStyle from '../style/main.module.css'
import * as tableStyle from '../style/appearances_table.module.css'

import Guests from '../../content/guests.json'

const latestAppearanceEpisode = (appearances) => {
  const latest = appearances[0]
  return (
    <span>
      <span>
        <Link
          to={`/episode/${latest.episodeNumber}-${slugify(latest.episodeTitle)}`}
        >
          {latest.episodeNumber}: {latest.episodeTitle}
        </Link>
      </span>
      <span>
        {isoToLocaleString(latest.date)}
      </span>
    </span>
  )
}

// sudo-enums
const SortKey = {
  Appearances: 'appearances',
  GuestName: 'guest-name',
  PodcastNumber: 'podcast-number',
}
const SortOrder = {
  Asc: 'ascending',
  Desc: 'descending',
}

const makeSortTitle = (currentSort, currentOrder, buttonsSort) => {
  const sortString = buttonsSort.replace('-', ' ')

  let order = currentOrder
  if (currentSort === buttonsSort) {
    if (currentOrder === SortOrder.Asc) {
      order = SortOrder.Desc
    } else {
      order = SortOrder.Asc
    }
  }

  return `Sort the table by the ${sortString}, ${order}`
}

const AppearanceTable = () => {
  let [sort, setSort] = React.useState(SortKey.PodcastNumber)
  let [order, setOrder] = React.useState(SortOrder.Desc)

  const reorderTable = (newSort) => {
    if (sort === newSort) {
      if (order === SortOrder.Desc) {
        setOrder(SortOrder.Asc)
      } else {
        setOrder(SortOrder.Desc)
      }
    } else {
      setSort(newSort)
    }
  }

  const arrayedGuests = Object.keys(Guests).map((key) => ({
    key: key,
    value: Guests[key],
  }))

  arrayedGuests.sort((a, b) => {
    let sortResult = 0
    switch (sort) {
      default:
      case SortKey.Appearances:
        sortResult = a.value.length - b.value.length
        break
      case SortKey.GuestName:
        sortResult = a.key.localeCompare(b.key)
        break
      case SortKey.PodcastNumber:
        sortResult = a.value[0].episodeNumber - b.value[0].episodeNumber
        break
    }

    // defaults to ascending
    if (order === SortOrder.Desc) {
      sortResult = sortResult * -1
    }

    return sortResult
  })

  const sortedGuests = {}
  for (const item of arrayedGuests) {
    sortedGuests[item.key] = item.value
  }

  return (
    <div className={tableStyle.graph_wrapper}>
      <table className={tableStyle.graph}>
        <thead>
          <tr>
            <td>
              <button
                onClick={() => reorderTable(SortKey.Appearances)}
                className={`${mainStyle.title} ${
                  sort === SortKey.Appearances ? tableStyle.active : ''
                } ${
                  order === SortOrder.Asc
                    ? tableStyle.sort_asc
                    : tableStyle.sort_desc
                }`}
                title={makeSortTitle(sort, order, SortKey.Appearances)}
              >
                Shows
              </button>
            </td>
            <td>
              <button
                onClick={() => reorderTable(SortKey.GuestName)}
                className={`${mainStyle.title} ${
                  sort === SortKey.GuestName ? tableStyle.active : ''
                } ${
                  order === SortOrder.Asc
                    ? tableStyle.sort_asc
                    : tableStyle.sort_desc
                }`}
                title={makeSortTitle(sort, order, SortKey.GuestName)}
              >
                Guest
              </button>
            </td>
            <td>
              <button
                onClick={() => reorderTable(SortKey.PodcastNumber)}
                className={`${mainStyle.title} ${
                  sort === SortKey.PodcastNumber ? tableStyle.active : ''
                } ${
                  order === SortOrder.Asc
                    ? tableStyle.sort_asc
                    : tableStyle.sort_desc
                }`}
                title={makeSortTitle(sort, order, SortKey.PodcastNumber)}
              >
                Last Podcast
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(sortedGuests).map((guest, i) => {
            return (
              <tr
                key={guest}
                className={mainStyle.event}
              >
                <td><strong>{Guests[guest].length}</strong></td>
                <td>
                  <Link to={`/guest/${slugify(guest)}`}>{guest}</Link>
                </td>
                <td>{latestAppearanceEpisode(Guests[guest])}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AppearanceTable
