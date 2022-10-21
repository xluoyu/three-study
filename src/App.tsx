import React, { useEffect } from 'react'
import {init} from './core'

function App () {

  useEffect(() => {
    init(800, 500, document.querySelector('#container')!)
    console.log('render')
  }, [])

  return (
    <div id="container" className="mx-auto w-[800px] h-[500px]"></div>
  )
}

export default App