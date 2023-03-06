import * as React from 'react'
import isoToLocalString from '../utilities/isoToLocaleString.js'

import * as dateStyle from '../style/stylish_long_date_time.module.css'

const longDateFmt = {
  weekday: 'long',
  month: 'long',
  day: '2-digit',
  year: 'numeric',
}

const timeFmt = {
  hour: 'numeric',
  minute: 'numeric',
}

const StylishLongDateTime = (props) => {
  const fullDate = isoToLocalString(props.date, longDateFmt)
  const [day, date, year] = fullDate.split(',')

  const time = isoToLocalString(props.date, timeFmt)

  return (
    <>
      <span className={dateStyle.day}>{day}</span>,
      <span className={dateStyle.date}>{date}</span>,
      <span className={dateStyle.year}>{year}</span>
      <br />
      <span className={dateStyle.time}>{time}</span>
    </>
  )
}

export default StylishLongDateTime
