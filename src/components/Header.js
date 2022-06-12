import * as React from 'react'
import { Link } from 'gatsby'
import {Helmet} from "react-helmet"

import * as mainStyle from '../style/main.module.css'

const Header = (props) => {
  const guestNoun = props.isSingular ? 'Guest' : 'Guests'
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/ico" href="/favicon.ico" />
      </Helmet>
      <header className={mainStyle.m_top_lg}>
        <Link to="/">
          <h1 className={`${mainStyle.headline} ${mainStyle.text_center}`}>
            {guestNoun} <em>of</em>The Talk Show
          </h1>
        </Link>
      </header>
      <hr />
    </>
  )
}

export default Header
