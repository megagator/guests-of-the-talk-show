import { useEffect, useState } from 'react'

const useFetchData = (url) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    console.log(`fetching ${url}`)
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`)
        }

        return response.text()
      })
      .then((text) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          data: text,
        }))
      })
      .catch((error) => {
        console.error(error)
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error,
        }))
      })
  }, [url])

  return state
}

export default useFetchData
