import "./index.scss"
import { useState } from "react"
import GetHeaderAuth from "../getHeaderAuth"

export default function Login(props: { data: any }) {
  const [err, setErr] = useState<null | [string, string]>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const U = props.data?._ ?? []
  return (
    <div className="flex sg-aaa">
      <div className="flex sg-aab" data-loading={Boolean(loading).toString()}>
        <div className="sg-aac">
          <h1>{U[0]}</h1>
          <span>{U[1]}</span>
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          setErr(null)
          try {
            const U = new URL(document.location.href);
            const body = new Uint8Array(2)
            U.pathname = "/_/v3/csq"
            body[1] = 128;
            let o: any[] = []
            const KK = document.querySelectorAll("select, input")
            for (let i = 0; i < KK.length; i++) {
              const U: any = KK[i]
              o.push([U.name, U.value])
            }
            U.searchParams.set("k", btoa(JSON.stringify(o)))
            U.searchParams.set("f", "1")
            U.searchParams.set("l", document.location.pathname)
            const req = await fetch(U.toString(), {
              cache: "no-store",
              method: "POST",
              headers: await GetHeaderAuth(),
              body
            })
            const O = await req.json()
            if (O[0] === -1) {
              setLoading(false)
              setErr([O[1],O[2]])
            } else if (O[0] === 6) {
              document.location.href = new URL(O[1], document.location.href).toString();
            } else if (O[0] === 2) {
              const U = new URL(document.location.href);
              U.searchParams.set("u2", O[1]?.toString(16))
              O[2] && U.searchParams.set("p", O[2])
              document.location.href = U.toString()
            } else {
              setLoading(false)
            }
            
          } catch {
            setLoading(false)
          } 
        }}>
          {U[3].map((q: any, index: number) => {
            if (q[0] === 0) return <div style={{ display: q[3]?.hidden ? "none" : "" }} className="sg-aad">
              <input {...q[3]} required autoFocus={!q[2]} className="inp" name={q[4]} type={q[5]} placeholder={q[1]} defaultValue={q[2] || ""} />
              <label>{q[1]}</label>
              {err && (q[4] === err[0]) && <span>{err[1]}</span>} 
            </div>
            if (q[0] === 1) return <div className="sg-aad">
              <select defaultValue={q[2]} key={index+"s"} name={q[4]} onChange={(a) => {
              const value = q[3][a.target.selectedIndex - 1][0]
             
              if (typeof value === "string") {
              a.target.value = value
              }}}>
                <option disabled>{q[1]}</option>
                {q[3]?.map(([k, v]: any) => (<option key={k} value={k}>{v}</option>))}
              </select>
              <label>{q[1]}</label>
              {err && (q[4] === err[0]) && <span>{err[1]}</span>} 
            </div>
          })}
          <div className="sg-ui9">
            {U[4] && (navigation?.canGoBack ?? true) ? <button onClick={() => navigation.back()} type="button">{U[4][0]}</button> : null}
            <div style={{flex:1}}/>
            {U.slice(5).map((q: any, index: number) => <button key={index} type={q[1] ? "submit" : "button"}>{q[0]}</button>)}
          </div>
        </form>
      </div>
    </div>
  )
}