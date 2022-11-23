import { init } from './core'
import { useEffect, useState } from 'react'

function main() {

  const [show, setShow] = useState(true)

  const run = () => {
    const mainEl = document.querySelector('#main') as HTMLElement
    init(mainEl)

    setShow(false)
  }

  return (
    <div>
      <div className="begin" style={{display: show ? 'block' : 'none'}} onClick={run}>begin</div>
      <div id="main"></div>
      <video src="https://upos-sz-mirrorali.bilivideo.com/upgcxcode/96/76/208347696/208347696-1-16.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1669204435&gen=playurlv2&os=alibv&oi=2105091777&trid=db47ef2808624d2eaea96c452443a07dh&mid=7461882&platform=html5&upsig=ac985a97027423673f7595dbee1104bb&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&bw=57480&logo=80000000" id="video" playsInline></video>
    </div>
  )
}

export default main