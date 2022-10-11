import React from 'react'

import Header from '../components/Header.js'
import DurationChart from '../components/DurationChart.js'
import EpisodeList from '../components/EpisodeList.js'
import GuestStats from '../components/GuestStats.js'

import * as mainStyle from '../style/main.module.css'
import * as guestStyle from '../style/guest.module.css'
import { Helmet } from 'react-helmet'
import WeekChart from '../components/WeekChart.js'

const guestTemplate = (props) => {
  const { pageContext } = props
  const { guest } = pageContext

  return (
    <main className={mainStyle.container}>
      <Helmet>
        <title>{guest} | Guest of The Talk Show</title>
      </Helmet>
      <div className={mainStyle.container}>
        <Header isSingular={true} />
        <h1
          className={`${mainStyle.title} ${mainStyle.text_center} ${mainStyle.m_bot_lg} ${mainStyle.m_top_lg}`}
        >
          {guest}
        </h1>
        <EpisodeList guest={guest} />
        <DurationChart guest={guest} />
        <div className={mainStyle.stats_wrapper}>
          <WeekChart guest={guest} />
          <GuestStats guest={guest} thing="Appearances" />
        </div>
      </div>
    </main>
  )
}

export default guestTemplate
