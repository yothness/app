// @ts-ignore
import crypto from "crypto";

import { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { Get$ } from './sign_in'
import Data from './page.data'

import M from '../lang.json'
const i18nData = M as any;

const version = "AAAAAAAA5Y98NE1"

const allowedCharsets = [
  "utf-8",
  "utf16le",
  "utf-16",
  "iso-8859-1",
  "windows-1252",
  "ascii"
];

  const findLanguage = (lang?: string): string | undefined => {
    if (!lang) return;

    lang = lang.trim();

    if (i18nData[lang]) return lang;

    const shortLang = lang.slice(0, 2);
    if (i18nData[shortLang]) return shortLang;
  };
function resolveLanguage(
  acceptLanguageHeader: string,
  preferredLanguage?: string,
): string {


  const primary = findLanguage(preferredLanguage);
  if (primary) return primary;


  const languages = acceptLanguageHeader
    .split(",")
    .map(lang => lang.split(";")[0].trim());

  for (const lang of languages) {
    const match = findLanguage(lang);
    if (match) return match;
  }

  // Fallback final
  return "en";
}
export default function Page(pageId: string, fn?: (c: Context) => any) {
  return async (c: Context) => {
    try {
      const q = c.req.query("q")
      if (pageId === "search" && !q) return c.redirect("/")
      
      let ei = c.req.query("ie")?.toLowerCase?.();
      if (!ei || !allowedCharsets.includes(ei)) {
        ei = "utf-8"
      }
      
      let headers: any = {
        "Content-Type": `text/html; charset=UTF-8`,
        "Cache-Control":	"private, max-age=0",
        "X-Frame-Options": "SAMEORIGIN",
      }
      
      const pref = getCookie(c, "PREF") || "sfc=1"
      const sq = new URLSearchParams(pref) 
      
      
      const ua = c.req.header("user-agent") || "";
      const isMobile = /Android.+Mobile|iPhone|iPod|Windows Phone|BlackBerry|Opera Mini/i.test(ua);
      const url = new URL(c.req.url)
      const props: any = fn ? fn(c) : {}
      
      const application: any = {}
      const ac = c.req.header('Accept-Language') || "";
      const qhl = c.req.query("hl") || sq.get("hl")!
      
      
      
      
      const sfc = (c.req.query("reload_sfc") === "1" ? c.req.query("sfc") : sq.get("sfc")) ?? "1"
      
      application.client = props.client = {
        hl: (ac || qhl) ? resolveLanguage(ac, qhl) : "en",
        gl: c.req.header('x-vercel-ip-Country') || 'US',
        sfc: sfc === "1",
        timeZone: c.req.header('x-vercel-ip-timezone') || 'UTC'
      }
      
      const isDev = process.env.is_dev === "1"
      
      if (
        c.req.query("reload_lang") === "1" ||
        c.req.query("reload_sfc") === "1" 
      ) {
        sq.set("hl",  props.client.hl)
        sq.set("sfc",  sfc)
        headers["Set-Cookie"] = `PREF=${sq.toString()}; Max-Age=31536000`
      }
      
      // Tablet
      const isTablet = /iPad|Tablet|Nexus 7|Nexus 10|SM-T|Kindle|Silk|PlayBook/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));

      
      const isDasktop = !isTablet && !isMobile
      
      if (props.___404) {
        url.port = '8082'
        
        return c.redirect(url.toString())
      }
      
      const fullUrl = url.toString()
      
      url.search = ""
      const canonicalUrl = url.toString()
      const LANG_HTML = i18nData[props.client.hl]?.LANG
      const isDark = true
      
      
      const nonce = crypto.randomBytes(16).toString("base64");
      const src = isDev ? `http://${url.hostname}:${8082}/app.js` : `/s/${version}/app.js`
      
      const data = await Data(c, pageId, props, c.req.header('x-vercel-ip-country-region'), true)
      if (data[0] === null && typeof data[1] === "string") return c.redirect(data[1])
      
      const JSID = `AA.${LANG_HTML}.EE${pageId == "search" ? ".S=1&" + encodeURIComponent(`P=${new Buffer(q!,"utf8").toString("base64")}`) : ""}`
      
      
      

     const i18n: any = i18nData[props.client.hl]
      
      const _H = await Get$(c)
      
      const is_logd = _H[1]?.length !== 0
      const HTML_BUTTON_USER = `<a hidden class="endpoint${is_logd?" l ":" "}flex signin" menu-user href="${is_logd ? "/account" : "/serviceLogin?source=self"}">${is_logd ? `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1YM3dx3reFLZOUbvkGRZJ5PQDbMo76y6E52Y_aALrXA&s" alt="Profile Picture"/>` : i18n["account.sg.sign_in"]}</a>`;
      const LOGO = `<img src="https://yothness.vercel.app/s/_/img.static/events/AAAAA00.gif" alt="World Cup 2026 | Yothness" class="enent"/>`
      const LOGO_URL = `/search?q=World+Cup+2026&hl=${props.client?.hl}&gl=${props.client?.gl}`
      
      let HTML:any = `<!DOCTYPE html><html ${pageId == "search" ?`itemscope="" itemtype="http://schema.org/SearchResultsPage"` : ""} dir="ltr" ${isDark?"dark":""} lang="${LANG_HTML}"><head><meta name="viewport" content="width=device-width, initial-scale=1.0${!isDasktop ? ", maximum-scale=1.0, user-scalable=no":""}"><title>Yothness</title>${
        (canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}"/>`:"")
      }<meta property="og:site_name" content="Yothness"/><meta property="og:image" content="data:,"/><meta property="og:image:width" content="0"/><meta property="og:image:height" content="0"/><script src="/jsd/${JSID}.js" nonce="${nonce}"></script><script src="https://cdn.jsdelivr.net/npm/eruda" nonce="${nonce}"></script><script>eruda.init();</script><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="application-title" content="Yothness" /><script>var app=${JSON.stringify(application)};</script></head><body><a hidden class="logo endpoint" href="${LOGO_URL}" logo-app id="logo">${LOGO}</a>${HTML_BUTTON_USER}<script>var E=document.createElement("meta");E.name="referrer";E.content="origin-when-cross-origin";document.getElementsByTagName("head")[0].appendChild(E);E=null</script><script>var appData=${JSON.stringify(data)};</script><wf-app id="application"></wf-app><script src="${src}" ${!isDev?"":`crossorigin="anonymous" `}nonce="${nonce}"></script></body></html>`



     
  
      return new Response(HTML, {
        headers
      });
    } catch (err) {
      console.debug(`[WEB:PAGE/${pageId}]`, err)
      return c.html("<pre>error<pre>: 500", { status: 500 })
    }
  }
}