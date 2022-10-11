import * as React from 'react'

import * as mainStyle from '../style/main.module.css'

import Header from '../components/Header.js'
import GuestStats from '../components/GuestStats.js'
import Footer from '../components/Footer.js'
import AppearanceTable from '../components/AppearancesTable.js'
import DurationChart from '../components/DurationChart.js'
import { Helmet } from 'react-helmet'
import WeekChart from '../components/WeekChart'

const IndexPage = () => {
  return (
    <main className={mainStyle.container}>
      <Helmet>
        <title>Guests of The Talk Show</title>
      </Helmet>
      <div className={mainStyle.container}>
        <Header />
        <AppearanceTable />
        <DurationChart />
        <div className={mainStyle.stats_wrapper}>
          <WeekChart />
          <GuestStats thing="Episodes" />
        </div>
        <Footer />
      </div>
    </main>
  )
}
// Step 3: Export your component
export default IndexPage
