import * as React from 'react'
import { Link } from 'gatsby'

import * as mainStyle from '../style/main.module.css'

const Header = (props) => {
  const guestNoun = props.isSingular ? 'Guest' : 'Guests'
  return (
    <>
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
