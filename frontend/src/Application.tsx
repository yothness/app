import Header from "./layout/header";
import Football from "./layout/football";
import PreferencesScreen from "./preferences";
import "./Search.scss"
import "./Application.scss"
import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  useCallback
} from "react";



import Search from "./Search"
import SG from "./sign-in/index"


export default function App({
  application_, root_
}: {
  application_: any, root_: HTMLElement
}) {

  const [data,
    setData] = useState < [string,
    any] > ((window as any).appData || ["home", {}])
  useEffect(() => {
    root_.setAttribute("page-id", data[0])
  }, [data])

  return (
    <>
      {data[0] !== "sg" && <Header page={data[0]}>{data[0] === "search" && <Input />}</Header>}
      <Get page={data[0]} data={data[1]} />
    </>
  )
}


  function Get({
    data, page
  }: {
    data: any, page: string
  }) {

    if (page === "preferences" || data.preferences) return <PreferencesScreen data={data.preferences? ({ page: data.preferences }): data} />;
    if (page === "sg") {


      return <Suspense fallback={<span />}>
        <SG data={data} />
      </Suspense>
    }
    const {
      about,
      sports,
      actions,
      form
    } = data
    if (about) {
      return <>
        <h1>{about.title}<span className="msr-icon">{about.icon}</span></h1>
        <div className="service">
          <h2 className="service-title">{about.services?.[0]}</h2>
          <div className="services">
            {about.services?.[1]?.map((a: any, index: number) => (
              <a key={index} className="service-endpoint endpoint" style={ {
                //   borderColor: a[3] || "red",
                // @ts-ignore
                "--c": a[3] || "red",
              }} href={a[2]}>
                { !a[1] ? <img className="ic" src={(new URL(a[2], "http://0.0.0.0").origin)+"/favicon.ico"} />: <span className="msr-icon">{a[1]}</span>}
              <h3 className="_0x1">{a[0]}</h3>
            </a>
            ))}
          {about.buttons?.map((a: any, index: number) => (
            <button className={"action-button " + (a.href ? "endpoint": "handle")} key={index} onClick={() => { document.location.href = a.href }} data-href={a.href} role={a.href ? "link": "button"}>{a.title}</button>
          ))}



          {about.updateArticle?.map((a: any, index: number) => ((a.___0 = a.color?.toString(16)),
            <article key={index} className="update-card" style={ {
              color: "#"+ a.___0
            }}>
              <div className="bg" style={ {
                backgroundColor: "#"+ a.___0
              }} />

              <h3>{a.title}</h3>

              <p>
                {a.description}
              </p>
              <div className="update-card__header">
                <span className={`badge badge--${a.type}`}>
                  {a.details}
                </span>
              </div>

            </article>
          ))}
        </div>
      </div>
    </>
  }
  if (page == "home") {
    return <div className="d73">
      <h1>Yothness</h1>
      <Input />
      {sports && (<div className="sports-rows">
        {sports.list?.map((data: any, index: number) => (<Football key={data.id + index} data={data} />))}
      </div>
      )}
    </div>
  }
  if (page == "search") {
    return (
<Search />
    )
}
return <>
{actions?.map((a: any, index: number, arr: any[]) => (a === null ? <div style={ { height: 12 }} />: (
<a href={a[4] || "#"} style={ {
// @ts-ignore
"--c": "#" + a[3].toString(16)
}} data-is-last={!arr[index - 1]} data-is-first={!arr[index + 1]} className="action-link flex endpoint">
<span className="msr-icon">{a[0]}</span>
<div>
<div className="title">
{a[1]}
</div>
<span>{a[2]}</span>
</div>
</a>
)))}

{ form && (
<div>
<h2>{form[0]}</h2>
<form
onSubmit={async e => {

e.preventDefault();
}}
action="?form=1"
>
{form[1]?.map((q: any, index: number) => (
<div key={index + "/" + q[3]} className="sg-aad">
<input required autoFocus className="inp" name={q[4]} type={q[3]} placeholder={q[1]} defaultValue={q[2] || ""} />
<label>{q[1]}</label>
</div>
))}
{form[3]?.map((q: any, index: number) => (
<button className={"action-button"} key={index} role={"submit"}>{q[1]}</button>
))}
</form>
</div>
)}
</>
}
let hl = window?.navigator?.language || ""
function Input() {
const [data,
setData] = useState < any > (null);
const [isFocused,
setIsFocused] = useState(false);

(window as any).u12 = (a: any) => setData(a)


const input = useRef < HTMLInputElement > (null!);
const form = useRef < HTMLFormElement > (null!);
const fsi = useCallback(() => {
setIsFocused(true)
const h = document.createElement("script");
h.src = `/api/complete?callback=u12&q=${encodeURIComponent(input.current!.value)}&hl=${hl}`
h.onload = () => {
h.remove()
}
document.body.appendChild(h)
},
[input])
const SubmitFunction = useCallback((e: any) => {
e.preventDefault()
input.current.blur();
const value = input.current.value.trim();
if (value) {
let query = `q=${encodeURIComponent(value).replace(/\%20/, "+")}`;
const encode = document.characterSet || document.inputEncoding;
if (encode) {
query += "&ie=" + encodeURIComponent(encode)
}
window.location.href = `/search?` + query;
}
},
[input])

return (
<form
action="/search"
ref={form}
onSubmit={SubmitFunction}
className="f73">
<div className="d74">
  <input
    name="q"
    defaultValue={(window as any).I || ""}
    onKeyUp={() => {}}
    ref={input}
    onBlur={() => setTimeout(() => setIsFocused(false), 400)}
    required
    placeholder="Search"
    onFocus={fsi}
    onInput={fsi}
  />
  <button type="submit" className="msr-icon">search</button>
</div>
{(data?.[1]?.length && isFocused && <div className="box">
{data[1].map((a: string) => (
<span className="d70" onClick={() => {
input.current!.value = a;
form.current!.submit()
input.current!.blur()
}}>{a}</span>
))}
</div>
) || ""}
</form>
)
}