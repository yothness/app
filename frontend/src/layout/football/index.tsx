import "./index.scss";

import {
  useState,
  useEffect
} from "react"

export default function FootBall({ data }: { data: any }) {
  
  return (<>
    <a href={"/soccer?id="+ data.id} className="endpoint flex sports-box" aria-hidden="true">
      <div className="aria-counter flex">
        <div className="flex team">
          <img src={data.primary?.image} alt={data.primary?.name} />
          <span className="name">{data.primary?.name}</span>
        </div>
        <span className="counter">{data.primary?.goal}</span>
      </div>
      <div className="timer flex">
          <span className="name">{data.top?.name}</span>
          <img src={data.top?.image} alt={data.top?.name} />
          <div className="timestamp">{data.timestamp}</div>
      </div>
      <div className="aria-counter flex secundary">
        <span className="counter">{data.secundary?.goal}</span>
        <div className="team flex">
          <img src={data.secundary?.image} alt={data.secundary?.name} />
          <span className="name">{data.secundary?.name}</span>
        </div>
      </div>
    </a>
      </>
  )
}