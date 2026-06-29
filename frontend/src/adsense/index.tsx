import "./index.scss";
import { useState, useEffect } from "react";

const Obj = {
  clone: function (t: object = {}) {
    const cl = class {};
    cl.prototype = t
    return new cl
  }
}


function $U({ label, type, data }: { data: any; label: string; type: string }) {
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    if (type) {
      if (url.trim()) {
        setErr("");
      } else setErr("Require Url/Id");
    }
  }, [type, url]);
  let O = ["", ""];
  try {
    const ur = new URL(data.value.destination);
    O[0] = ur.origin
    O[1] = ur.pathname + "..."
  } catch {}
  return (
    <label style={{ margin: "0" }}>
      <span>URL or ID</span>
      <input
        defaultValue={url}
        onInput={(e) => setUrl((e.target as any).value)}
        type="url"
      />
      {err && <span style={{ color: "red" }}>{err}</span>}
      {data.import && <div className="preview">
        <div className="img">
          <img src={data.import.image} />
          <div style={{ backgroundImage: `url(${data.import.image})`}}/>
          {data.import.iframe && <iframe src={data.import.iframe} />}
        </div>
        <div className="info">
          <h2>{data.import.title}</h2>
          <div className="url-link">{O[0]}<pre>{O[1]}</pre></div>
          <div className="label-sponsored">Sponsored</div>
          <button role="button">{data.value.local.cta_type}</button>
        </div>
      </div>}
    </label>
  );
}
export default function $({ data }: { data: any }) {
  const [selected, setSelected] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ADP, setAdp] = useState<Record<string, any>>({
    import: {
      title: "--",
      image: "--"
    },
    value: {
      cta_type: 0,
      local: {
        cta_type: "Learn More"
      },
      
    }
  });
  return (
    <div className="ads-create">
      <h1>{data[0]}</h1>
      <form action="?form=1" className="main">
        <p className="sub-title">{data[1]}</p>
        <section className="card source-card">
          <label>
            <span>{data[2]}</span>
            <select
              onChange={(e) => setSelected(e.target.value)}
              value={selected}
              name="source"
            >
              <option disabled value="">
                {"---"}
              </option>
              {data[4].map((e: any) => (
                <option key={e[1]} value={e[1]}>
                  {e[0]}
                </option>
              ))}
            </select>
            <div className="det">{data[3]}</div>
            {selected &&
              (selected == "U1" ? (
                <input placeholder={data[8]} type="text" name="t" />
              ) : (
                <$U label={data[selected === "PW" ? 6 : 7]} data={ADP} type={selected} />
              ))}
          </label>
        </section>
        {selected && (
          <>
            {selected == "U1" ? (
              <>
                {/*  Image Advertisement  */}
                <h2>{"Select image"}</h2>

                <section className="card image-card">
                  <label>
                    <span>{"Image"}</span>
                    <input type="file" accept="image/*" />
                  </label>

                  <label>
                    <span>{"P.form.headline.label"}</span>
                    <input
                      type="text"
                      placeholder="P.form.headline.placeholder"
                    />
                  </label>

                  <label>
                    <span>{"P.form.description.label"}</span>
                    <textarea
                      rows={5}
                      placeholder="P.form.description.placeholder"
                    ></textarea>
                  </label>

                  <label>
                    <span>{"P.form.alt.label"}</span>
                    <input type="text" placeholder="P.form.alt.placeholder" />
                  </label>
                </section>
              </>
            ) : (
              <>
                {/*  Worflix Advertisement  */}

                <h2>{"P.form.worflix.title"}</h2>
                <section className="card worflix-card">
                  <label>
                    <span>{"P.form.channel.label"}</span>

                    <select>
                      <option>{"P.form.channel.placeholder"}</option>
                    </select>
                  </label>

                  <label>
                    <span>{"P.form.video.label"}</span>

                    <select>
                      <option>{"P.form.video.placeholder"}</option>
                    </select>
                  </label>

                  <label>
                    <input type="checkbox" />
                    <span>{"P.form.useThumbnail.label"}</span>
                  </label>

                  <label>
                    <input type="checkbox" />
                    <span>{"P.form.useTitle.label"}</span>
                  </label>

                  <label>
                    <input type="checkbox" />
                    <span>{"P.form.useDescription.label"}</span>
                  </label>
                </section>
              </>
            )}
            {/*  Campaign  */}

            <h2>{"P.form.campaign.title"}</h2>
            <section className="card campaign-card">
              <label>
                <span>{"P.form.destination.label"}</span>

                <input
                  type="url"
                  onInput={(e: any) => {
                  const I = e.target;
                  setAdp(Y => {
                    Y.value.destination = I.value
                    return Obj.clone(Y)
                  })
                }}
                  placeholder="P.form.destination.placeholder"
                />
              </label>

              <label>
                <span>{"P.form.cta.label"}</span>

                <select onChange={(e: any) => {
                  const I = e.target;
                  setAdp(Y => {
                    Y.value.local.cta_type = I[(Y.value.cta_type = I.selectedIndex)].text
                    return Obj.clone(Y)
                  })
                }}>
                  <option value={0}>Learn More</option>
                  <option value={1}>Watch Now</option>
                  <option value={2}>Visit Website</option>
                  <option value={3}>Install</option>
                  <option value={4}>Download</option>
                  <option value={5}>Subscribe</option>
                </select>
              </label>

              <label>
                <span>{"P.form.budget.label"}</span>

                <input type="number" min="0" step="0.01" />
              </label>

              <label>
                <span>{"P.form.currency.label"}</span>

                <select>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>BRL</option>
                </select>
              </label>

              <label>
                <span>{"P.form.schedule.start"}</span>
                <input type="date" />
              </label>

              <label>
                <span>{"P.form.schedule.end"}</span>
                <input type="date" />
              </label>

              <p>Pay 100$ ........</p>

              <label>
                <span>{"P.form.status.label"}</span>

                <select>
                  <option>{"P.form.status.options.draft"}</option>
                  <option>{"P.form.status.options.active"}</option>
                  <option>{"P.form.status.options.paused"}</option>
                </select>
              </label>
            </section>

            {/*  Preview  */}

            <section className="card preview-card">
              <h2>{"P.preview.title"}</h2>

              <div className="preview-device">
                <div className="preview-image"></div>

                <div className="preview-body">
                  <h3>{"P.preview.headline"}</h3>
                  <p>{"P.preview.description"}</p>
                  <button>{"P.preview.cta"}</button>
                </div>
              </div>
            </section>
          </>
        )}
      </form>
      {selected && (
        <>
          <div className="pyqb">
            <h4>Type Paygmant</h4>
            <span>Select type payments (no selected)</span>
          </div>
          <footer className="sg-ui9">
            <button type="button" className="btn">
              {"P.actions.cancel"}
            </button>

            <button type="button" className="btn">
              {"P.actions.saveDraft"}
            </button>

            <button type="submit" className="btn btn-primary">
              {"P.actions.publish"}
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
