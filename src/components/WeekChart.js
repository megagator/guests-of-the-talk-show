import * as React from 'react'

import * as mainStyle from '../style/main.module.css'

import Episodes from '../../content/episodes.json'



// dynamic
// const upperBound = Episodes.reduce((prev, currEp) => Math.max(prev, currEp.durationSeconds), 0)
// const wholeHourUpperBound = Math.ceil(upperBound / 3600) * 3600
const wholeHourUpperBound = 4 * 3600

const trimFloat = (number, fractionDigits) => {
  return number.toFixed(fractionDigits).replace(/\.0+^/, '')
}

const arcPercentagesToCartesian = (arcStart, arcEnd) => {
  // percentages start at "12 o'clock" or 1/2 radian, 90 degrees
  const midArcPerc = (arcEnd + arcStart) / 200
  const radians = (Math.PI / 2) - (2 * Math.PI * midArcPerc)

  // multiply by .666 to get the centers 2/3 out
  const placement = arcEnd - arcStart >= 10 ? .666 : .8
  const x = Math.cos(radians) * 50 * placement
  const y = Math.sin(radians) * 50 * -placement
  
  return {
    x: trimFloat(x, 3),
    y: trimFloat(y, 3)
  }
}

const WeekChart = (props) => {
  const [daysOfTheWeek, setDaysOfTheWeek] = React.useState(new Array(7).fill(0))

  React.useEffect(() => {
    let filteredEpisodes = Episodes
    if (props.guest) {
      filteredEpisodes = Episodes.filter(epi => epi.guests.includes(props.guest))
    }
    
    // an array where the position indicates the day of the week, Sun = 0
    let dotw = new Array(7).fill(0)
    for (const ep of filteredEpisodes) {
      const date = new Date(ep.pubDate)
      dotw[date.getDay()] += 1
    }

    dotw = dotw.map(showsPerDay => showsPerDay / filteredEpisodes.length * 100)

    setDaysOfTheWeek(dotw)
  }, [props.guest])

  const cummulativeDotwPercent = (() => {
    let a = [0]
    let total = 0
    for (var i = 0; i < daysOfTheWeek.length; i++) {
      total += daysOfTheWeek[i]
      a.push(total)
    }
    return a
  })()

  console.log(daysOfTheWeek, cummulativeDotwPercent)
  const gradient = []
  for (var i = 0; i < 7; i++) {
    // +3 just to shift to the higher range of colors
    gradient.push(`var(--colorful-${i + 3}) ${cummulativeDotwPercent[i]}% ${cummulativeDotwPercent[i + 1]}%`)
  }

  if (daysOfTheWeek.reduce((prev, curr) => prev + curr) === 0) {
    return null
  }

  return (
    <section className={mainStyle.m_v_lg}>
      <h2 className={mainStyle.title}>Publish Day</h2>
      <div style={{
          width: 'min(400px, 90vw)',
          height: 'min(400px, 90vw)',
          margin: 'auto',
          backgroundImage: `conic-gradient(${gradient.join(',')})`,
          borderRadius: '50%'
      }}>
        <ul style={{position: 'relative', height:'100%', listStyle: 'none', padding: 0, margin: 0}}>
          {[
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ].map((day, index) => <li key={day} style={{
            color: `var(--colorful-dark-${index + 3})`,
            // backgroundColor: `var(--colorful-${index + 3})`,
            padding: '2px 4px',
            borderRadius: '3px',
            display: daysOfTheWeek[index] === 0 ? 'none' : 'line-item',
            position: 'absolute',
            textAlign: 'center',
            top: `calc(50% + ${arcPercentagesToCartesian(cummulativeDotwPercent[index], cummulativeDotwPercent[index + 1]).y}%)`,
            left: `calc(50% + ${arcPercentagesToCartesian(cummulativeDotwPercent[index], cummulativeDotwPercent[index + 1]).x}%)`,
            transform: `translate(-50%, -50%)`,
            transformOrigin: 'center'
          }}>{`${day}`}<br/>{`${trimFloat(daysOfTheWeek[index], 1)}%`}</li>)}
        </ul>
      </div>
    </section>
  )
}

export default WeekChart
