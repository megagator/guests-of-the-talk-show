import * as React from 'react'
import useFetchData from '../hooks/useFetchData'

import * as mainStyle from '../style/main.module.css'
import * as transcriptStyle from '../style/transcript.module.css'

const setAudioPlayhead = (time) => {
  const audio = document.querySelector('audio')

  if (!audio) return

  let hours,
    mins,
    secs = 0
  const parts = time.split(':')
  if (parts.length === 3) {
    hours = parts[0]
    mins = parts[1]
    secs = parts[2]
  } else {
    hours = 0
    mins = parts[0]
    secs = parts[1]
  }

  const total = hours * 60 * 60 + mins * 60 + parseFloat(secs)
  audio.currentTime = total

  if (audio.paused || audio.ended) {
    audio.play()
    // audio.currentTime = total
  }
}

const TranscriptLine = (props) => {
  return (
    <p
      data-time={props.time}
      title={props.time}
      className={transcriptStyle.line}
      onClick={() => setAudioPlayhead(props.time)}
    >
      {props.content}
    </p>
  )
}

const parseTranscriptions = (data) => {
  const lines = data.split('\n')
  return lines.map((line) => {
    if (!line) return null

    const [match, time] = line.match(/\[((\d:)?\d\d:\d\d\.\d\d\d).*\]\s*/)
    const filtered = line.substring(match ? match.length : 0)
    return <TranscriptLine key={time} time={time} content={filtered} />
  })
}

const Transcript = (props) => {
  // const [collapsed, setCollapsed] = React.useState(false)
  const url = `/transcriptions/${props.episode}.txt`
  const { data, loading, error } = useFetchData(url)

  return (
    <section>
      <h2 className={mainStyle.title_thin}>Transcript</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p title={error.message}>No transcript just yet :)</p>
      ) : (
        <article>{parseTranscriptions(data)}</article>
      )}
    </section>
  )
}

export default Transcript
