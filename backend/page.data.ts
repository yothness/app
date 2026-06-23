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
  
  const { u } = c.req.query()
  const { type } = c.req.param()
  
  if (
    pageId === "account" ||
    pageId === "change_account" ||
    pageId === "families_account" ||
    pageId === "security_account"
  ) {
    let [i, Ac] = await Get$(c);
    if (u) {
      const j = Number(u);
      i = isNaN(j) ? i : j
    }
    i = Ac.length - 1 < i ? Ac.length - 1 : Math.max(0, i); 
    const k = Ac[i];
    const userData = k ? (await pool.query(`
      with logg as (
        select
          u.name,
          u.email,
          u.born,
          s.cookie
        from acc.session s
        left join acc.users u on u.id = s.user_id
        where s.cookie = ANY($2::text[])
      )
      select
        name,
        email,
        born
      from logg
      where cookie = $1
      `, [k, Ac])).rows[0] : null;
    if (userData) {
      const qInfo = `?u=${i}`
      console.log(userData)
      data.actions = pageId === "account" ?  [
        ["person", i18n["account.name"], userData.name, 0x3B82F6, "/account/change/name" + qInfo],
        ["mail", "Email", userData.email, 0x2563EB, "/account/change/email" + qInfo],
        ["calendar_month", "Birthday", userData.born ? userData.born.toLocaleDateString(props.client?.hl || "en-US") : "Not set", 0x6366F1, "/account/change/birthday" + qInfo],
        null,
        ["fingerprint", "Password", "••••••••", 0x8B5CF6, "/account/change/pwd" + qInfo],
        ["lock", "Security", "Manage account settings and security", 0xEF4444, "/account/security" + qInfo],
        null,
        ["home", "Home location", "Location not set", 0xF59E0B, "/account/change/homelocal" + qInfo],
        ["public", "Country", "Country not selected", 0x10B981, "/account/change/country" + qInfo],
        null,
        ["family_restroom", "Family Link", "No family links", 0x22C55E, "/account/families" + qInfo],
        ["devices", "Devices", "Manage your devices", 0x64748B, "/account/devices" + qInfo]
      ] : (
        pageId === "security_account" ? [
          ["graph_2", "Connections", "No connections", 0x18B92E, "/account/connections" + qInfo],
          null,
          ['delete', "Delete account", "Delete your account permanent", 0xd71717, "/account/request_delete" + qInfo]
        ]: null
      )
      if (pageId === "change_account") {
        let entries: any[] = null!, title = ""
        switch (type) {
           case "name":
             title = i18n["account.change.name"]
             entries = [
               [0, i18n["account.name"], userData.name, "text", "n"]
             ]
             break
           case "email":
             title = "Change Your email"
             entries = [
               [0, "Email", userData.email, "email", "em"]
             ]
             break
           case "birthday":
             const date = userData.born

              const value =
                date.getFullYear() + "-" +
                String(date.getMonth() + 1).padStart(2, "0") + "-" +
                String(date.getDate()).padStart(2, "0");
              
             title = "Birthday"
             entries = [
               [0, "Birthday", value, "date", "bn"],
               [3, "Show animation and event on my profile when you have a birthday", false, null, "bn"]
             ]
             break
           case "pwd":
             title = "Change Your password"
             entries = [
               [0, "Currently Password", '', "password", "pwd"],
               [0, "Password", '', "password", "pwd_0"],
               [0, "Confirm Password", '', "password", "pwd_1"]
             ]
             break
        }
  
        data.form = [
          title,
          entries,
          "/_/v3/c_update?e=1&of=" + type,
           [
            ["Confirm"]
          ]
        ]
      }
      if (pageId === "families_account") {
        data.preferences = {
          _extends: {
            next: ["Link a account", "add", ";openLinkedAccount:family"]
          },
          guide: [
            ["All account", "#", "recent_actors"],
            ["Your children's online account", "#children", "child_care"]
          ],
          MAIN: [[0, "No account linked"]],
          children: [[0, "No account linked"]],
        }
      }
    } else {
      return [null, "/serviceLogin?seurce=self&next=" + encodeURIComponent(c.req.method === "POST" ? "/" : c.req.url)]
    }
  }
  
  
  
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
          [0, i18n["account.name"], null, { minLength: 128 }, "n", "text"],
          [0, "Email", D.auto?.email, {}, "em", "email"],
          [0, i18n["account.sg.birth"], null, {}, "bn", "date"],
          [
            1,
            "Gender",
            -1,
            i18n["gander.values"]?.split("|").map((e: string, i: number) => ([i === 3 ? -1 : i, e])),
            "gn"
          ],
          [0, "Create Password", null, {}, "pwd", "password"]
       ];
     } else if (id === 4) {
       description = i18n["account.lgw.email"]?.replace("$NAME", D.user?.[0]?.name || "-").replace("$EMAIL", D.auto?.email || "-")
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
     
    if (props.client?.sfc && false) {
    const t = await getFixtures({
      limit: 3,
      country: countryHttp || props.client?.gl || "br"
    })
    
    data.sports = {
      title: "----",
      list: t?.map((q) => ({
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
        [i18n["tap.preferences"], "#", "settings"],
        [i18n["tap.account"], "#acc", "person"],
        [i18n["tap.privacy"], "#priv", "lock"],
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
        [3, "Family Link", "/account/families?" +qHl ],
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
      icon: "diversity_1",
      buttons: [{
        title: "Get starting",
        href: "/account/families"
      }]
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