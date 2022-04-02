import * as React from 'react'

import * as mainStyle from '../style/main.module.css'

import Header from '../components/Header.js'
import AppearanceTable from '../components/AppearancesTable.js'
import DurationChart from '../components/DurationChart.js'

const IndexPage = () => {
  return (
    <main className={mainStyle.container}>
      <title>Guests of The Talk Show</title>
      <div className={mainStyle.container}>
        <Header />
        <AppearanceTable />
        <DurationChart />
      </div>
    </main>
  )
}
// Step 3: Export your component
export default IndexPage
