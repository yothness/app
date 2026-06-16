import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { encrypt, decrypt } from "./crypto"
import crypto from "crypto"
import pool from "./database"
const CY_PASS = process.env.CY_PASS!;

export async function CreateAnAccount(c: Context, name: string, email: string, pwd: string, gn: number, date: Date) {
  const { rows } = await pool.query(`
insert into acc.users (
 name,
 pass,
 email,
 gender,
 born
) values ($1,crypt($2, gen_salt('bf')),$3,$4,$5)
returning id
  `, [name, pwd, email, gn, date]);
  
  return $(c, rows[0].id)
}
export async function SignIn(c: Context, email: string, pwd: string) {
  const { rows } = await pool.query(`select id from acc.users where email = $1 and pass = crypt($2, pass);`, [email, pwd]);
  if (!rows[0]) return 0;
  return $(c, rows[0].id)
}

/**
 * @private true
 */
async function $(c: Context, uid: string) {
  const [index, sec] = await Get$(c);
  const id = crypto.randomBytes(46).toString('base64url'); 
  const u = await pool.query(`
WITH new_cookie AS (
  INSERT INTO acc.session (
    user_id,
    cookie
  )
  SELECT $1, $3
  WHERE NOT EXISTS (
    SELECT 1
    FROM acc.session s
    WHERE s.user_id = $1
      AND s.cookie = ANY($2::text[])
  )
  RETURNING cookie
)
SELECT EXISTS (
  SELECT 1 FROM new_cookie
) AS inserted;
 `, [uid, sec, id]);
  if (!u.rows.length) return false
  u.rows[0]?.inserted && sec.push(id)
  
  const cookie = encodeURIComponent(await encrypt(`${index}\u00a6${sec.join("|")}`, CY_PASS));
  
  const isHttps = !process.env.is_dev;

  setCookie(c, "SID", cookie, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "None" : "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true
}


export async function Get$(c: Context): Promise<[number, string[]]> {
  let sessions: string[] = [], index = -1;
  try {
    let cia = getCookie(c, "SID");
    if (!cia) return [0, []];
    
    cia = await decrypt(decodeURIComponent(cia), CY_PASS);
    if (cia) {
      const sep = cia.indexOf("\u00a6");

      index = sep > 0 && !isNaN(+cia.slice(0, sep))
        ? +cia.slice(0, sep)
        : 0;
      
      sessions = sep === -1
        ? []
        : cia.slice(sep + 1).split("|");
    
    }
  } catch {}
  return [index, sessions]
}