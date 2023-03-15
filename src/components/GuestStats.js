import * as React from 'react'
import { DateTime } from 'luxon'

import pluralize from '../utilities/pluralize'

import * as statStyle from '../style/guest_stats.module.css'

import Episodes from '../../content/episodes.json'
import {
  AverageFit,
  L2NormalFit,
  LinearFitError,
} from '../utilities/algorithms'

const algorithmOptions = {
  Average: AverageFit,
  L2: L2NormalFit,
}

const GuestStats = (props) => {
  const [episodes, setEpisodes] = React.useState([])
  const [cadence, setCadence] = React.useState(0)
  const [next, setNext] = React.useState(null)
  const [nextDiff, setNextDiff] = React.useState(null)
  const [fitAlgorithmChoice, setAlgorithmChoice] = React.useState('L2')
  const [disabledAlgorithms, setDisabledAlgorithms] = React.useState(new Set())

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

    // L2 doesn't work with fewer than 3 data points
    if (fitAlgorithmChoice === 'L2' && filteredEpisodes.length < 3) {
      console.log('disabling L2')
      setAlgorithmChoice('Average')
      setDisabledAlgorithms(new Set([...disabledAlgorithms, 'L2']))
    }
  }, [props.guest])
  
  React.useEffect(() => {
    const daysInBetween = []
    let previousApp = null
    for (const appearance of episodes) {
      if (previousApp !== null) {
        const newApp = DateTime.fromISO(appearance.pubDate)
        const diff = newApp.diff(previousApp, 'days').toObject()
        daysInBetween.push(Math.abs(diff.days))
      }

      previousApp = DateTime.fromISO(appearance.pubDate)
    }

    let averageDays = 0
    try {
      averageDays = new algorithmOptions[fitAlgorithmChoice](
        daysInBetween
      ).predict()
    } catch (error) {
      if (error instanceof LinearFitError) {
        averageDays = 0
      } else {
        throw error
      }
    }

    setCadence(averageDays)

    if (averageDays > 0) {
      const lastApp = previousApp
      const projectedNextApp = lastApp.plus({ days: averageDays })
      setNext(projectedNextApp)

      const diffNow = projectedNextApp.diffNow('days').toObject().days
      setNextDiff(Math.round(diffNow))
    } else {
      setNext(null)
      setNextDiff(null)
    }
  }, [fitAlgorithmChoice, episodes])

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
                {cadence.toFixed(2)} {pluralize('day', cadence)}
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
                <em>
                  {nextDiff === 0 ? (
                    <>Today</>
                  ) : nextDiff > 0 ? (
                    <>
                      in {nextDiff} {pluralize('day', nextDiff)}
                    </>
                  ) : (
                    <>
                      {Math.abs(nextDiff).toLocaleString()}{' '}
                      {pluralize('day', nextDiff)} ago
                    </>
                  )}
                </em>
              </td>
            )}
          </tr>
          <tr>
            <td>Algorithm</td>
            <td>
              <select
                name="algorithm"
                value={fitAlgorithmChoice}
                onChange={(event) => setAlgorithmChoice(event.target.value)}
              >
                {Object.keys(algorithmOptions).map((option) => {
                  const disabled = disabledAlgorithms.has(option)
                  return (
                    <option key={option} value={option} disabled={disabled}>
                      {option}
                    </option>
                  )
                })}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default GuestStats
