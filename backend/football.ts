export interface Fixture {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    status: {
      elapsed: number | null;
      short: string;
      long: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}
const COUNTRY_MAP: Record<string, string> = {
  br: "Brazil",
  us: "United States",
  gb: "England",
  jp: "Japan",
  es: "Spain",
  fr: "France",
  de: "Germany",
  it: "Italy",
};

let y: number | null = null, data$: Fixture[] = []

interface GetFixturesOptions {
  country: string;
  query?: string | null;
  limit?: number;
}

export async function getFixtures({
  country,
  query = null,
  limit = 5,
}: GetFixturesOptions): Promise<Fixture[]> {
  
   if (y && data$ && (Date.now() - y < 5_000)) {
     return data$
   }
   
  

  const params = new URLSearchParams({
    "live":'all'
  });

  if (query) {
    params.set("search", query);
  }

  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?${params}`,
    {
      cache: "force-cache",
      headers: {
        "x-apisports-key": process.env.API_KEY_FOOTBALL!,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data = await res.json();
  y = Date.now()
  data$ = data as any
  console.log(JSON.stringify(data, null, 2))
  const countryCode = country?.toUpperCase();

  return data.response
    .sort((a: any, b: any) => {
      const aMatch = a.league?.country?.toUpperCase() === countryCode ? 1 : 0;
      const bMatch = b.league?.country?.toUpperCase() === countryCode ? 1 : 0;
  
      if (aMatch !== bMatch) {
        return bMatch - aMatch;
      }
  
      const aStart = new Date(a.seasons?.[0]?.start ?? 0).getTime();
      const bStart = new Date(b.seasons?.[0]?.start ?? 0).getTime();
  
      return bStart - aStart;
    }) as Fixture[];
}