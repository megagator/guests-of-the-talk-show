import * as React from 'react'
import { Link } from 'gatsby'

import slugify from '../utilities/slugify.js'

const GuestList = (props) => {
  const guestSize = props.guests.length
  const guestLinks = []
  for (var i = 0; i < guestSize; i++) {
    const guest = props.guests[i]
    const link = (
      <Link key={guest} to={`/guest/${slugify(guest)}`}>
        {guest}
      </Link>
    )
    guestLinks.push(link)

    if (i < guestSize - 1) {
      if (guestSize === 2) {
        guestLinks.push(' and ')
      } else if (i === guestSize - 2) {
        guestLinks.push(', and ')
      } else {
        guestLinks.push(', ')
      }
    }
  }

  return guestLinks
}

export default GuestList
