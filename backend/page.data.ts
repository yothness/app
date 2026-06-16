import { Context } from "hono"
import pool from "./database"
import { getFixtures } from "./football"
import { Get$ } from "./sign_in"
import M from '../lang.json'

const i18nData = M as any;
let topSevices = [
  ["Worflix", "play_circle", "data:text/html,page dont working", "#FF5A5F"],
  ["Work Yothness", "work", "data:text/html,page dont working", "#FF8C42"],
  ["Ad sense", "local_atm", "/adsense", "#FFC400"],
  ["Football Yothness", "sports_and_outdoors", "data:text/html,page dont working", "#2DD36F"],
  ["Families Yothness", "diversity_1", "/families", "#18C6D8"],
  ["Worflix Social", "connect_without_contact", "data:text/html,page dont working", "#2196F3"],
]
let services = [...topSevices]

const mapType: [number, string][] = [
  [0x28ff21, "newness"]
]
let i = 0

export default async function Data(
  c: Context,
  pageId: string,
  props: any,
  countryHttp?: string,
  isPage?: boolean
) {
  let data: any = { _reqIndex: i++ }, userData: string | null = null
  
  const i18n: any = i18nData[props.client?.hl] || {}
  const qHl = `hl=${props.client?.hl}`
  
  
  
  
  
  switch (pageId) {
   case "sg":
     
     const id: number = props.u2 ? parseInt(props.u2 , 16) : 0;
     let inp: any[][] = [], title = i18n["account.sg.sign_in"], description = "", D: any = {};
     if (props.u2) {
       try {
         D = JSON.parse(new Buffer(props.p, "hex").toString("utf8"));
       } catch {}
     }
     
     if (id === 0) {
       title = "Sign In/Up"
       inp = [
         [0, "Email", D.auto?.email, {}, "em", "email"],
      ]
      description = "You can Sign In and Create an account here."
   } else if (id === 0xf) {
       title = "Create an Account" 
       description = "Create an account!"
       inp = [
          [0, "Name", null, { minLength: 128 }, "n", "text"],
          [0, "Email", D.auto?.email, {}, "em", "email"],
          [0, i18n["account.sg.birth"], null, {}, "bn", "date"],
          [
            1,
            "Gender",
            -1,
            [
              [0, "Male"],
              [1, "Female"],
              [2, "Non-binary"],
              [-1, "Prefer not to say"]
            ],
            "gn"
          ],
          [0, "Create Password", null, {}, "pwd", "password"]
       ];
     } else if (id === 4) {
       description = `Login with ${D.user?.[0]?.name || "-"} (${D.auto?.email || "-"})`
       inp = [
          [0, "Email", D.auto?.email, { hidden: true }, "em", "email"],
         [0, "Password", null, {}, "pwd", "password"],
       ]
     } else if (id === 3) {
       inp = []
       description = ``
     } else if (id === 0xf1) {
       title = "Create an Account"
       description = `By creating an account, you agree to our Terms of Service and Privacy Policy. You are responsible for maintaining the security of your account and for all activities that occur under it. We reserve the right to suspend or terminate accounts that violate our policies.`
     } else if (id === 0x12) {
       title = `Welcome back!`
       description = ``
     }
     
     data._ = [
       title,
       description,
       {},
       inp,
       id === 0 ? null : [i18n["account.sg.back"]],
      ]
      
      if (id === 4) {
        data._.push([i18n["account.sg.rue"], null, 0xf],[i18n["account.sg.next"], true])
      } else {
        data._.push([id === 0x12 ? i18n["account.sg.sign_in"] : (id === 0xf1 ? "Create Account" : i18n["account.sg.next"]) , true])
      }
      
     
     break;
   case "home":
    if (props.client?.sfc) {
    const t = await getFixtures({
      limit: 3,
      country: countryHttp || props.client?.gl || "br"
    })
    
    data.sports = {
      list: t.map((q) => ({
        top: q.league ? {
          name: q.league.name + " (" + q.league.country + ")",
          image: q.league.logo,
        } : {},
        id: q.fixture?.id?.toString(),
        primary: {
          goal: q.goals?.["home"],
          name: q.teams?.home?.name,
          image: q.teams?.home?.logo,
        },
        secundary: {
          goal: q.goals?.["away"],
          name: q.teams?.away?.name,
          image: q.teams?.away?.logo,
        },
        timestamp: "Start at " + new Date(q.fixture?.timestamp).toLocaleTimeString("en-US", {
  timeZone: props.client?.timeZone || "UTC"
}) + "\n" + (i18n["sport.status." + q.fixture?.status?.short] || "——"),
      }))
    }
    }
    break;
  case "preferences":
    const keys: any[] = Object.keys(i18nData);
    for (let i = 0; i < keys.length; i++) {
      keys[i] = [keys[i], i18nData[keys[i]].NAME]
    }
    data.page = {
      guide: [
        [i18n["tap.preferences"], "#"],
        [i18n["tap.account"], "#acc"],
        [i18n["tap.privacy"], "#priv"],
      ],
      MAIN: [
        [0, i18n["_linguage"]],
        [2, i18n["_linguage.select"], keys, props.client?.hl, "?hl=$&reload_lang=1"],
        [0, i18n["sport.options"]],
        [1, i18n["sport.options.desc"]],
        [2, " ", [["0", i18n["_off"]], ["1", i18n["_on"]]], String(+props.client?.sfc), "?sfc=$&reload_sfc=1&" + qHl],
        [0, i18n["theme.label"]],
        [2, i18n["theme.select"], [["-1", i18n["theme.device"]]], "-1", ["thm"]],
      ],
      acc: [
        [0, i18n["tap.account"]],
        [3, i18n["tap.account.button"], "/account?" +qHl],
      ],
      priv: [
        [0, "Safe Family"],
        [3, "Family Link", "/families?" +qHl ],
      ],
    }
    
    break;
  case "news_update":
    const updateArticle = (await pool.query(`select * from updates ORDER BY created_at DESC limit 12`)).rows;
    for (let i = 0; i < updateArticle.length; i ++) {
      const t = updateArticle[i]
      updateArticle[i] = {
        description: t.description,
        title: t.title,
        color: mapType[t.type]?.[0] || null,
        details: `${i18n["update.status." + mapType[t.type]?.[1]] || "——"} • ${t.created_at?.toLocaleString(props.client?.hl || "en", {
          dateStyle: "full",
          timeStyle: "medium",
          timeZone: props.client?.timeZone || "UTC"
        }) || "––/––"}`
      }
    }
    data["about"] = {
      title: i18n["update.title"],
      updateArticle
    }
    break;
  case "families":
    data["about"] = {
      title: i18n["families.title"],
      icon: "diversity_1"
    }
    break;
  case "apps_services":
    data["about"] = {
      title: "Apps & Services",
      services: [
        i18n["apps.all_service"],
        services
      ]
    }
    break;
  case "about":
    data["about"] = {
      title: i18n["about.title"],
      services: [
        i18n["about.some_apps"],
        topSevices
      ]
    }
    break;
  }
  
  

  return [
    pageId,
    data,
    null
  ]
}