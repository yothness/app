import Switch from "react-switch";
import { useState } from "react";
export function SwitchComp(P: { name: string, defaultValue?: boolean }) {
  const [is, si] = useState(!!P.defaultValue);
  
  return <>
    {/*@ts-ignore*/}
    <Switch activeBoxShadow="inset 0px 0px 0px 0px rgba(0, 0, 0, 1), 0 0 8px #000" boxShadow="inset 0px 0px 0px 2px #66f" handleDiameter={0} uncheckedIcon={false} checkedIcon={false} offColor="#444" onColor="#66f" onChange={si} checked={is} />
    <input name={P.name} value={String(+is)} style={{ display: "none"}} />
  </>
}
export default function Form({
  form
}: {
  form: any
}) {
  const [isLoading, sl] = useState(false);
  const [err, se] = useState("");
  return (
    <div>
      <h2>{form[0]}</h2>
      <div style={{ color: "red"}}>{err}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          se("")
          sl(true)
          try {
            const [i, _] = await (await fetch(form[2])).json()
            if (i == 1) return void history.back();
            if (i == 0 && _) return void (document.location.href = _)
            se(_)
          } 
          finally {
            sl(false);
          } 
          
        }}
        action="?form=1"
        >
        {form[1]?.map((q: any, index: number) => (
          <div key={index + "/" + q[3]} className={q[0] !== 0 ? "flex sg-uaa":"sg-aad"}>
            {q[0] === 0 ? (
              <>
                <input required autoFocus className="inp" name={q[4]} type={q[3]} placeholder={q[1]} defaultValue={q[2] || ""} />
                <label>{q[1]}</label>
              </>
            ): 
              <label>
                <div>{q[1]}</div>
                <SwitchComp name={q[4]} defaultValue={!!q[2]}  /> 
              </label>
             }
        </div>
        ))}
      {form[3]?.map((q: any, index: number) => (
        <button className={"action-button"} key={index} role={"submit"}>{q[0]}</button>
      ))}
    </form>
  </div>
)
}