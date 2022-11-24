import { init } from './core'
import { useEffect, useState } from 'react'

function main() {

  const [show, setShow] = useState(true)

  const run = () => {
    const mainEl = document.querySelector('#main') as HTMLElement
    init(mainEl, 728, 410)

    setShow(false)
  }

  const full = () => {
    document.querySelector('#main canvas').requestFullscreen()
  }


  return (
    <div>
      <div onClick={full}>full</div>
      <div className="begin" style={{display: show ? 'block' : 'none'}} onClick={run}>begin</div>
      <div id="main"></div>
      {/* <video src="/assets/video/1.mp4" id="video" playsInline crossOrigin="anonymous"></video> */}
      <video src="https://upos-sz-mirrorali.bilivideo.com/upgcxcode/96/76/208347696/208347696-1-16.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1669261189&gen=playurlv2&os=alibv&oi=2105091777&trid=88819699567d4098aa318329f4606239h&mid=7461882&platform=html5&upsig=35018d9799b2d782ea3830eb0c83d5ae&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&bw=57480&logo=80000000" id="video" playsInline crossOrigin="anonymous" style={{display: 'none',width: "100%", height: "100%"}}></video>
    </div>
  )
}

export default main