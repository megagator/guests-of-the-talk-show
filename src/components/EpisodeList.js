import * as React from 'react'
import { DateTime } from 'luxon'
import { Link } from 'gatsby'

import friendlyDuration from '../utilities/friendlyDuration.js'
import isoToLocalString from '../utilities/isoToLocaleString.js'

import * as mainStyle from '../style/main.module.css'
import * as tableStyle from '../style/appearances_table.module.css'

import Episodes from '../../content/episodes.json'

// sudo-enums
const SortKey = {
  Episode: 'Episode',
  Date: 'Date',
  Duration: 'Duration',
}
const SortOrder = {
  Asc: 'ascending',
  Desc: 'descending',
}

const makeSortTitle = (currentSort, currentOrder, buttonsSort) => {
  let order = currentOrder
  if (currentSort === buttonsSort) {
    if (currentOrder === SortOrder.Asc) {
      order = SortOrder.Desc
    } else {
      order = SortOrder.Asc
    }
  }

  return `Sort the table by the ${buttonsSort}, ${order}`
}

const EpsisodeList = (props) => {
  let [sort, setSort] = React.useState(SortKey.Episode)
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

  const filteredEpisodes = Episodes.filter((epi) => {
    for (const guest of epi.guests) {
      if (guest === props.guest) {
        return true
      }
    }

    return false
  })

  filteredEpisodes.sort((a, b) => {
    let sortResult = 0
    switch (sort) {
      default:
      case SortKey.Episode:
        sortResult = a.number - b.number
        break
      case SortKey.Duration:
        sortResult = a.durationSeconds - b.durationSeconds
    }

    // defaults to ascending
    if (order === SortOrder.Desc) {
      sortResult = sortResult * -1
    }

    return sortResult
  })

  return (
    <div className={tableStyle.graph_wrapper}>
      <table className={tableStyle.graph}>
        <thead>
          <tr>
            <td>
              <button
                onClick={() => reorderTable(SortKey.Episode)}
                className={`${mainStyle.title} ${
                  sort === SortKey.Episode ? tableStyle.active : ''
                } ${
                  order === SortOrder.Asc
                    ? tableStyle.sort_asc
                    : tableStyle.sort_desc
                }`}
                title={makeSortTitle(sort, order, SortKey.Episode)}
              >
                {SortKey.Episode}
              </button>
            </td>
            <td>
              <button
                onClick={() => reorderTable(SortKey.Duration)}
                className={`${mainStyle.title} ${
                  sort === SortKey.Duration ? tableStyle.active : ''
                } ${
                  order === SortOrder.Asc
                    ? tableStyle.sort_asc
                    : tableStyle.sort_desc
                }`}
                title={makeSortTitle(sort, order, SortKey.Duration)}
              >
                {SortKey.Duration}
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredEpisodes.map((epi, i) => {
            return (
              <tr key={`episode_${epi.number}`} className={mainStyle.event}>
                <td>
                  <span>
                    <span>
                      <Link to={`/episode/${epi.slug}`}>
                        {`${epi.number}: ${epi.title}`}
                      </Link>
                    </span>
                    <span>{isoToLocalString(epi.pubDate)}</span>
                  </span>
                </td>
                <td>{friendlyDuration(epi.durationSeconds)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EpsisodeList
