// @ts-ignore
import crypto from "crypto";
import { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import Data from './page.data'

import M from '../lang.json'
const i18nData = M as any;

const version = "AAAAAAA82YYGD8N"

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
      
      
      url.search = ""
      const canonicalUrl = url.toString()
      const LANG_HTML = i18nData[props.client.hl]?.LANG
      const isDark = true
      
      
      const nonce = crypto.randomBytes(16).toString("base64");
      const src = isDev ? `http://${url.hostname}:${8082}/app.js` : `/s/${version}/app.js`
      
      const data = await Data(pageId, props, c.req.header('x-vercel-ip-country-region'))
      
      
      
      
      let HTML:any = `<!DOCTYPE html><html dir="ltr" ${isDark?"dark":""} lang="${LANG_HTML}"><head><title>Yothness</title>${
        (canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}"/>`:"")
      }<meta property="og:site_name" content="Yothness"/><meta property="og:image" content="data:,"/><meta property="og:image:width" content="0"/><meta property="og:image:height" content="0"/><script src="https://cdn.jsdelivr.net/npm/eruda" nonce="${nonce}"></script><script>eruda.init();</script><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="application-title" content="Yothness" /><script>var app=${JSON.stringify(application)};</script></head><body><script>var E=document.createElement("meta");E.name="referrer";E.content="origin-when-cross-origin";document.getElementsByTagName("head")[0].appendChild(E);E=null</script><script>var appData=${JSON.stringify(data)};</script><wf-app id="application"></wf-app><script src="${src}" ${!isDev?"":`crossorigin="anonymous" `}nonce="${nonce}"></script></body></html>`



     
  
      return new Response(HTML, {
        headers
      });
    } catch (err) {
      console.debug(`[WEB:PAGE/${pageId}]`, err)
      return c.html("<pre>error<pre>: 500", { status: 500 })
    }
  }
}