import { init, isPC } from './core'
import { useState } from 'react'

function main() {
  let width = 1920
  let height = 1080
  const [show, setShow] = useState(true)

  if (!isPC) {
    [width, height] = [height, width]
  }

  const pix = Math.min(window.innerWidth / width, window.innerHeight / height)

  width = width * pix
  height = height * pix

  console.log({width, height})


  const run = () => {
    const mainEl = document.querySelector('#main') as HTMLElement


    init(mainEl, width, height )

    setShow(false)
  }

  return (
    <div>
      {/* <div onClick={full} className="fullBtn">full</div> */}
      <div className="begin" style={{display: show ? 'block' : 'none'}} onClick={run}>begin</div>
      <div id="main"></div>
      <video src="/assets/video/1.mp4" id="video" playsInline crossOrigin="anonymous" style={{display: 'none'}}></video>
    </div>
  )
}

export default main