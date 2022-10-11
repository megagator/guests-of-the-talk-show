import * as React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import * as mainStyle from '../style/main.module.css'

import Header from '../components/Header.js'
import Footer from '../components/Footer.js'

const NotFoundPage = () => {
  return (
    <main className={mainStyle.container}>
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <Header />
      <div className={mainStyle.container}>
        <h1>Page not found</h1>
        <p>
          Sorry{' '}
          <span role="img" aria-label="Pensive emoji">
            😔
          </span>{' '}
          we couldn’t find what you were looking for.
          <br />
          <Link to="/">Go home</Link>.
        </p>
      </div>
      <Footer />
    </main>
  )
}

export default NotFoundPage
