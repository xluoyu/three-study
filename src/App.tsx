import React, { useEffect } from 'react'
import './App.css'
import { init } from './core'
function App () {

  useEffect(() => {
    init(window.innerWidth, window.innerHeight, document.querySelector('#main')!)
  }, [])

  return (
    <div id="main"></div>
  )
}

export default App