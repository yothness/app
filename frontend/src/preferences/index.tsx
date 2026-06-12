import "./index.scss";

import {
  useState,
  useEffect
} from "react"






export default function PreferencesScreen({ data }: { data: any }) {
  const [type, setType] = useState<string>(window.location.hash?.slice(1))
  useEffect(() => {
    const FN = () => setType(window.location.hash?.slice(1))
    window.addEventListener("hashchange", FN)
    return () => window.removeEventListener("hashchange", FN)
  }, [])
  
  const page = ((data.page || {})[type == "priv" ? "priv" : (type === "acc" ? "acc" : "MAIN")] || []) as any[]
  return (
    <div className="flex pref-page">
      <div className="flex pref-guide">
        {data.page?.guide?.map((data: any, index: any) => <a className="endpoint flex" aria-selected={data[1] === "#" + type} href={data[1]} key={index}>{data[0]}</a>)}
      </div>
      <div role="main">
        {page.map(([i, x0, x1, x2, x3]: any, index: number) => {
         if (i === 0) return <h3 key={index+"h"}>{x0}</h3>
         if (i === 1) return <p key={index+"p"}>{x0}</p>
         if (i === 3) return <a className="endpoint" href={x1} key={index+"a"}>{x0}</a>
         if (i === 2) return (
           <select defaultValue={x2} key={index+"s"} name={index.toString(16)} onChange={(a) => {
            const value = x1[a.target.selectedIndex - 1][0]
           
            if (typeof x3 === "string") {
              x3 && (x3 !== value) && (document.location.href = x3.replace?.("$", value) )
            }
              
           }}>
              <option disabled>{x0}</option>
              {x1.map(([k, v]: any) => (<option key={k} value={k}>{v}</option>))}
            </select>
          )
        
        })}
      </div>
    </div>
  )
}