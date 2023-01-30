import { Link } from "react-router-dom";
import type { FC } from 'react'


const LinkBox: FC<{link: string}> = (props) => {
  return (
    <div className="LinkBox">
      <Link to={"/" + props.link}>{props.link}</Link>
    </div>
  )
}

function Home() {
  const linkList = [
    'car',
    'video',
    'physics',
    'fps'
  ];

  return (
    <div className="container">
      {
        linkList.map((link) => (
          <LinkBox link={link} key={link}/>
        ))
      }
    </div>
  )
}

export default Home