import axios from "axios"
import { useEffect, useState } from "react"

const getPong = async (): Promise<string> => {
  const response = await axios.get('/api/ping')
  const data = response.data
  if (typeof data === 'string'){
    return data
  } else {
    return 'foo'
  }
}

const App = () => {
  const [pong, setPong] = useState('')
  useEffect(() => {
    const perfAsync = async () => {
      const response = await getPong()
      setPong(response)
    }
    perfAsync()
  }, [])
  return (<>
  {pong}!!</>)
}
export default App
