import "./index.scss";

import {
  useState,
  useEffect
} from "react"

export default function Header({ page: id }: { page: string }) {
  const [data, setData] = useState<any>({
    
  })
  useEffect(() => {}, [])
  
  return (
    <div role="banner" id="header">
      <div>
        <a className="endpoint logo" href="/">Yothness</a>
      </div>
      <div role="list" className="center">
        <a role="listitem" className="endpoint" aria-selected={id === "home"} href="/"><span className="text">Home</span> <span className="msr-icon">search</span></a>
        <a role="listitem" className="endpoint" aria-selected={id === "apps_services"} href="/apps/services"><span className="text">Apps & Services</span> <span className="msr-icon">apps</span></a>
        <a role="listitem" className="endpoint" aria-selected={id === "news_update"} href="/news_update"><span className="text">News & Updates</span> <span className="msr-icon">news</span></a>
        <a role="listitem" className="endpoint" aria-selected={id === "about"} href="/about"><span className="text">About</span> <span className="msr-icon">info</span></a>
      </div>
      <div className="flex">
        <a role="listitem" className="endpoint" aria-selected={id === "preferences"} href="/preferences"><span className="text">Settings</span> <span className="msr-icon">settings</span></a>
        <a className="endpoint flex signin" href="/serviceLogin?source=self">Login</a>
      </div>
    </div>
  )
}