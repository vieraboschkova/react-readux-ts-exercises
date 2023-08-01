import { useEffect, useState } from "react"

interface DTO {
    "by": string
    "id": number
    "score": number
    "time": number
    "title": string
    "type": string
    "url": string
}

interface Data {
    last: number
    ids: number[],
    details: DTO[]
}

export default function App() {
  const initialDO: Data = {last: 0, ids: [], details: []};
  const [idsData, setIdsData] = useState({...initialDO})
  const [isLoading, setIsLoading] = useState(false)
  const [wasError, setWasError] = useState(false)

  const handleLoad6More = () => {
    // TODO: check if length of array ok, otherwise get only max
    const idsToFetch = idsData.ids.slice(idsData.last, idsData.last + 6 > idsData.ids.length - 1? idsData.ids.length - 1 : idsData.last + 6)
    const idsPromises = idsToFetch.map((id) => {
      return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then((res) => res.json())
        .catch((err) => setWasError(err.message))
    }) 
    Promise.all(idsPromises)
      .then((values) => {
        setIdsData((prev) => {
          return {...prev, last: prev.last + 6, details: [...prev.details, ...values]}
        })
      })
      .catch((err) => setWasError(err.message))
  }
  useEffect(()=> { 
    setIsLoading(true);
    fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
    .then((value) => value.json())
    .then((valueIds) => {
        setIdsData((prev) => {return {...prev, ids: [...valueIds]}})
        const idsToFetch: number[] = valueIds.slice(0,6)
        const idsPromises = idsToFetch.map((id) => {
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        }) 
        Promise.all(idsPromises)
        .then((values) => Promise.all(values.map((val) => val.json())))
        .then((values) => {
            setIdsData((prev) => {return {...prev, last: 6, details: [...values]}})
        })
        .catch((err) => setWasError(err.message))
    })
    .catch((err) => setWasError(err.message))
    .finally(()=> setIsLoading(false))

    return () => {
      setIsLoading(false);
      setWasError(false);
      setIdsData({...initialDO})
    }
  }, [])

  return (<div>
    <div>
      <h1>Job boards</h1>
      {isLoading && <h2>Loading!</h2>}
      {wasError && <h2>Something went wrong</h2>}
      {!wasError && !isLoading && idsData.details.length > 0 && idsData.details.map((item) => {
        return <div key={item?.id} style={{border: '2px black solid', marginBottom: '1rem'}}>
          <h2>{item?.title}</h2>
          <p>By {item?.by} * {item?.time}</p>
        </div>
      })}
      {idsData.details.length > 0 && <button type="button" disabled={isLoading || wasError} onClick={handleLoad6More}>
        Load next 6 items
      </button>}
      {idsData.details.length === 0 && <h2>Nothing to show</h2>}
    </div>
  </div>);
}
