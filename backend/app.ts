import { Hono, Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { isValidDigest, encrypt, decrypt } from './crypto'
import { CreateAnAccount, SignIn, Get$ } from './sign_in'
import Page from './pages'
import pool from './database'






const app = new Hono()

app.get('/gen_204', (c) => new Response(void 0, { status: 204 }))

app.get('/jsd/:type', async (c) => {
  const script = ``
  
  return c.body(`window.app=window.app||{};(function(Y,W){${script}})(window.app,window);`, 201, {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "private, no-store",
  });
})
  
  
  
app.get('/_/v3/run', async (c) => {
  let { u } = c.req.query();
  try {
    const { create_account, info, create_at } = JSON.parse(await decrypt(u, process.env.pwd!));
    if (Date.now() - create_at > 600_000) return c.html("<a href=/ >You took forever to arrive, start again? ", { status: 408 })
     await (!create_account ? SignIn(c, info[0], info[3]) : CreateAnAccount(c, info[4], info[0], info[3], info[1], new Date(info[2])))
     return c.redirect("/", 308)
  } catch (_) {
    console.error(_)
    return c.redirect("/?err=1", 308)
  }
  return c.html("?¿")
})
app.post('/_/v3/csq', async (c) => {
  let o: any = [], DI: any = null, D: any = {}
  const ab = new Uint8Array(await c.req.arrayBuffer());
  if (ab[0] !== 0 && ab[1] !== 128) return c.notFound()
  let { k, sn, u2, p } = c.req.query();
  if (!k) return c.json([-1, null])
  
  if (!isValidDigest(c)) return new Response('[]', { status: 403 })
  try {
    k = atob(k)
    DI = JSON.parse(k) as [string, string][]
  } catch {}
  
  if (!DI) return c.json([-1, null])
  
  try {
    D = JSON.parse(new Buffer(p, "hex").toString("utf8"));
  } catch {}
  
  if (u2 === "f1" || u2 === "12") {
    return c.json([6, "/_/v3/run?u=" + encodeURIComponent(await encrypt(JSON.stringify({
      create_account: u2 === "f1",
      info: D[1],
      create_at: Date.now()
    }), process.env.pwd!))])
  }
  
  
  try {
    let email = ""
    for await (const [key, value] of DI) {
      const length = value.trim().length
      key === "em" && (email = value)
      if (key === "em" && !(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))) {
        return c.json([-1, "em", "Email invalid"])
      }
      if (key === "n" && length > 128) {
        return c.json([-1, "n", "Max length is 128"])
      }
      if (key === "n" && length < 2) {
        return c.json([-1, "n", "Min length is 2"])
      }
      if (key === "pwd" && length < 8) {
        return c.json([-1, "pwd", "Min 8 caracteries"])
      }
      if (key === "pwd" && length > 1024) {
        return c.json([-1, "pwd", "Max 1024 caracteries"])
      }
    }
    
  if (u2 === "f" || u2 === "4") {
    let info = new Array(5), i = 0
    for (const [key, value] of DI) {
      let oq: number | null = null;
      key === "em" && (oq = 0)
      key === "gn" && (oq = 1)
      key === "bn" && (oq = 2)
      key === "pwd" && (oq = 3)
      key === "n" && (oq = 4)
      
      if (oq == null) {
        return new Response(void 0, { status: 403 })
      }
      info[oq] = value
    }
    
    if (u2 === "4") {
      const { rows } = await pool.query(`select id from acc.users where email = $1 and pass = crypt($2, pass);`, [info[0], info[3]]);
      if (rows.length === 0) return c.json([-1, "pwd", "The password is incorrect."])
    }
    if (!D.createAt || Date.now() - D.createAt > 6_000_000) {
        return new Response(void 0, { status: 403 })
    }
    
    return c.json([2, u2 === "f"? 0xf1 : 0x12, new Buffer(JSON.stringify([+(u2 === "f"), info])).toString("hex") ])
  }
    
    if (!sn && email) {
      const { rows } = await pool.query("select id, name from acc.users where email = $1", [email]);
      const obs: any = {
          auto: {
            email
          },
          createAt: Date.now()
      }
      if (rows.length === 0) {
        o = [2, 0xf, ""]
      } else {
        obs.user = rows
        o = [2, rows.length === 1 ? 4 : 3, ""]
      }
      o[2] = new Buffer(JSON.stringify(obs)).toString("hex")
    }
    return c.json(o)//[0, sn, null])
  } catch (_) {
    console.error(_)
    return c.notFound()
  }
})

app.get('/', Page("home"))
app.get('/about', Page("about"))
app.get('/account', Page("account"))
app.get('/account/security', Page("security_account"))
app.get('/account/change/:type', Page("change_account"))
app.get('/news_update', Page("news_update"))
app.get('/preferences', Page("preferences"))
app.get('/families', Page("families"))
app.get('/apps/services', Page("apps_services"))

app.get('/serviceLogin', (c) => {
  let { continute, source } = c.req.query();
  const sb = new URLSearchParams("")
  
  if (!continute && source == "self") {
    continute = new URL(c.req.url).origin
  }
  sb.set("continute", continute || "/")
  sb.set("source", source || "self")
  return c.redirect(`/v3/challenge/start?` + sb.toString())
})


const sgp = Page("sg", c => c.req.query());

app.get('/v3/challenge/:type', c => {
  
  
  return sgp(c)
})

export default app
