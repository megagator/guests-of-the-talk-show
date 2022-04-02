import * as React from 'react'
import { Link } from 'gatsby'

import friendlyDuration from '../utilities/friendlyDuration.js'
import slugify from '../utilities/slugify.js'

import GuestList from './GuestList.js'

import * as graphStyle from '../style/duration_chart.module.css'

import Episodes from '../../content/episodes.json'

const setPositionLocation = (e, setFunc) => {
  // console.log({ w: window.innerWidth, e: e.pageX, h: (window.innerWidth / 2) })
  let location = graphStyle.right
  if (window.innerWidth / 2 < e.pageX) {
    location = graphStyle.left
  }

  setFunc(location)
}

// dynamic
// const upperBound = Episodes.reduce((prev, currEp) => Math.max(prev, currEp.durationSeconds), 0)
// const wholeHourUpperBound = Math.ceil(upperBound / 3600) * 3600
const wholeHourUpperBound = 4 * 3600

const DurationChart = (props) => {
  let [selectedEpisodeIndex, selectEpisodeIndex] = React.useState(null)
  let [episodeInfoPosition, setEpisodeInfoPosition] = React.useState(
    graphStyle.right
  )

  let filteredEpisodes = Episodes
  if (props.guest) {
    filteredEpisodes = Episodes.filter((e) => e.guests.includes(props.guest))
  }

  return (
    <section
      className={graphStyle.duration_chart_wrapper}
      onMouseLeave={() => selectEpisodeIndex(null)}
    >
      <div className={graphStyle.chart_labels}>
        <ul>
          {/* <li>5hr</li> */}
          <li>4hr</li>
          <li>3hr</li>
          <li>2hr</li>
          <li>1hr</li>
          <li>0hr</li>
        </ul>
      </div>
      <div className={graphStyle.duration_chart}>
        {filteredEpisodes.map((ep, i) => {
          // reversed in CSS with flex direction
          return (
            <Link
              to={`/episode/${ep.slug}`}
              key={`episode_${ep.number}`}
              className={graphStyle.episode}
              title={friendlyDuration(ep.durationSeconds, false)}
              style={{
                height: (ep.durationSeconds / wholeHourUpperBound) * 100 + '%',
              }}
              onMouseEnter={(e) => {
                selectEpisodeIndex(i)
                setPositionLocation(e, setEpisodeInfoPosition)
              }}
            ></Link>
          )
        })}
      </div>
      {selectedEpisodeIndex !== null && (
        <div className={`${graphStyle.episode_details} ${episodeInfoPosition}`}>
          <strong>
            <Link
              to={`/episode/${
                filteredEpisodes[selectedEpisodeIndex].number
              }-${slugify(filteredEpisodes[selectedEpisodeIndex].title)}`}
            >
              {filteredEpisodes[selectedEpisodeIndex].number}:{' '}
              {filteredEpisodes[selectedEpisodeIndex].title}
            </Link>
          </strong>
          {filteredEpisodes[selectedEpisodeIndex].guests && (
            <em>
              with{' '}
              <GuestList
                guests={filteredEpisodes[selectedEpisodeIndex].guests}
              />{' '}
            </em>
          )}
        </div>
      )}
    </section>
  )
}

export default DurationChart
