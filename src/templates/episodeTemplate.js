import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import friendlyDuration from '../utilities/friendlyDuration.js'
import Header from '../components/Header.js'
import GuestList from '../components/GuestList.js'
import StylishLongDateTime from '../components/StylishLongDateTime.js'

import * as mainStyle from '../style/main.module.css'
import * as epiStyle from '../style/episode.module.css'

const episodesShowNotesInMarkdown = [223, 305]

const guestTemplate = (props) => {
  const { pageContext } = props
  const { episode } = pageContext

  return (
    <main className={mainStyle.container_narrow}>
      <title>
        {episode.number}: {episode.title} | Guest of The Talk Show
      </title>
      <div className={mainStyle.container}>
        <Header />
        <h2 className={mainStyle.title_thin} title={episode.rawTitle}>
          <>
            <small>Episode {episode.number}</small>
            <br />
            <a href={episode.link}>〝{episode.title}〞</a>
          </>
        </h2>
        <div className={mainStyle.center}>
          <p>
            <em>
              with <GuestList guests={episode.guests} />
            </em>
          </p>
        </div>
        <section>
          <audio controls preload="none">
            <source src={episode.file.url} type={episode.file.type} />
            Your browser does not support the audio element.
          </audio>
          <div className={`${mainStyle.fifty_fifty} ${mainStyle.m_bot_sm}`}>
            <h4 className={epiStyle.pub_date} title={episode.pubDate}>
              <StylishLongDateTime date={episode.pubDate} />
            </h4>
            <p className={epiStyle.audio_details}>
              {Math.ceil(episode.file.fileSizeBytes / 1_000_000)}
              <small>MB</small> | {friendlyDuration(episode.durationSeconds)}
            </p>
          </div>
        </section>
        <hr />
        {episodesShowNotesInMarkdown.includes(episode.number) ? (
          <article>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              children={episode.showNotes.trim()}
            />
          </article>
        ) : (
          <article
            dangerouslySetInnerHTML={{ __html: episode.showNotes }}
          ></article>
        )}
      </div>
    </main>
  )
}

export default guestTemplate
