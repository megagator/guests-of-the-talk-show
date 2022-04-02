import React from 'react'

const friendlyDuration = (timeInSeconds, returnJsx = true) => {
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.round((timeInSeconds - hours * 3600) / 60)

  if (returnJsx) {
    if (hours > 0) {
      return (
        <>
          {hours}
          <small>h</small> {minutes}
          <small>m</small>
        </>
      )
    } else {
      return (
        <>
          {minutes}
          <small>m</small>
        </>
      )
    }
  } else {
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }
}

export default friendlyDuration
