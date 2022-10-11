import * as React from 'react'
import { DateTime } from 'luxon'

import pluralize from '../utilities/pluralize'

import * as statStyle from '../style/guest_stats.module.css'

import Episodes from '../../content/episodes.json'

const GuestStats = (props) => {
  const [episodes, setEpisodes] = React.useState([])
  const [cadence, setCadence] = React.useState(0)
  const [next, setNext] = React.useState(null)
  const [nextDiff, setNextDiff] = React.useState(null)

  const deps = props.guest ? [props.guest] : []
  React.useEffect(() => {
    const filteredEpisodes = Episodes.filter((epi) => {
      if (!props.guest) return true

      for (const guest of epi.guests) {
        if (guest === props.guest) {
          return true
        }
      }

      return false
    })

    filteredEpisodes.reverse()
    setEpisodes(filteredEpisodes)

    const daysInBetween = []
    let previousApp = null
    for (const appearance of filteredEpisodes) {
      if (previousApp !== null) {
        const newApp = DateTime.fromISO(appearance.pubDate)
        const diff = newApp.diff(previousApp, 'days').toObject()
        daysInBetween.push(Math.abs(diff.days))
      }

      previousApp = DateTime.fromISO(appearance.pubDate)
    }

    const sum = daysInBetween.reduce((prev, curr) => prev + curr, 0)
    let averageDays = 0
    if (sum > 0 && daysInBetween.length > 0) {
      averageDays = Math.round(sum / daysInBetween.length)
    }
    setCadence(averageDays)

    if (averageDays > 0) {
      const lastApp = previousApp
      const projectedNextApp = lastApp.plus({ days: averageDays })
      setNext(projectedNextApp)

      const diffNow = projectedNextApp.diffNow('days').toObject().days
      setNextDiff(Math.round(diffNow))
    }
  }, deps)

  return (
    <div className={statStyle.stat_table}>
      <table>
        <tbody>
          <tr>
            <td>{props.thing}</td>
            <td>{episodes.length}</td>
          </tr>
          <tr>
            <td>Cadence</td>
            {cadence === 0 ? (
              <td>None</td>
            ) : (
              <td>
                {cadence} {pluralize('day', cadence)}
              </td>
            )}
          </tr>
          <tr>
            <td>Next</td>
            {next === null ? (
              <td>Never</td>
            ) : (
              <td>
                {next.toLocaleString(DateTime.DATE_MED)}
                <br />
                {nextDiff > 0 ? (
                  <em>
                    (in {nextDiff} {pluralize('day', nextDiff)})
                  </em>
                ) : (
                  <em>
                    ({Math.abs(nextDiff).toLocaleString()}{' '}
                    {pluralize('day', nextDiff)} ago)
                  </em>
                )}
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default GuestStats
