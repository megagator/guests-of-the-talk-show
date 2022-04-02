import { DateTime } from 'luxon'

const isoToLocalString = (isoDateString, format = DateTime.DATE_MED) => {
  const date = DateTime.fromISO(isoDateString)
  return date.toLocaleString(format)
}

export default isoToLocalString
