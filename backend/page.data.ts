import pool from "./database"
import { getFixtures } from "./football"
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

export default async function Data(
  pageId: string,
  props: any,
  countryHttp?: string
) {
  let data: any = {}, userData: string | null = null
  
  const i18n: any = i18nData[props.client?.hl] || {}
  const qHl = `hl=${props.client?.hl}`
  
  switch (pageId) {
  case "home":
    if (props.client?.slc) {
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
    data = {
      page: {
        guide: [
          ["Preferences", "#"],
          ["Account", "#acc"],
          ["Privacy", "#priv"],
        ],
        MAIN: [
          [0, i18n["_linguage"]],
          [2, i18n["_linguage.select"], keys, props.client?.hl, "?hl=$&reload_lang=1"],
          [0, "Soccer / Football"],
          [1, "Choose whether football matches and scores are displayed on the home page."],
          [2, "Show", [["0", i18n["_off"]], ["1", i18n["_on"]]], String(+props.client?.slc), "?sfc=$&reload_sfc=1&" + qHl],
          [0, "Theme"],
          [2, "Select Theme", [["-1", "Device theme"]], "-1", ["thm"]],
        ],
        acc: [
          [0, "Account"],
          [3, "Manager or Signin Account", "/account?" +qHl],
        ],
        priv: [
          [0, "Safe Family"],
          [3, "Family Link", "/families?" +qHl ],
        ],
      }
    }
    break;
  case "news_update":
    const updateArticle = (await pool.query(`select * from updates`)).rows;
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
      title: i18n["update.title"] || "News & Updates",
      updateArticle
    }
    break;
  case "families":
    data["about"] = {
      title: i18n["families.title"] || "Help keep your family safer online",
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