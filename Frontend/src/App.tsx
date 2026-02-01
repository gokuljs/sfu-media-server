import { useState, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";
const BASE_URL = 'http://localhost:3000'
function App() {
  const [socket] = useState(io(BASE_URL))
  useEffect(() => {
    socket.on('connect', () => {
      console.log("connecting to socket server with id", socket.id)
      console.log(socket)
    })
  }, [socket])
  return (
     <div>
     <h1>Hello World</h1>
     </div>
  )
}

export default App
