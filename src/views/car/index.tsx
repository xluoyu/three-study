import { useEffect } from 'react'
import { init } from './core'
function App () {

  useEffect(() => {
    const mainEl = document.querySelector('#main') as HTMLElement

    init(window.innerWidth, window.innerHeight, mainEl)

    return () => {
      if (mainEl) {
        mainEl.innerHTML = ''
      }
    }
  }, [])

  return (
    <div id="main"></div>
  )
}

export default App