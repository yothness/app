import pool from "./database";
const BIG_QUERY = `
WITH start_sql AS (
  SELECT clock_timestamp() AS start_time
),

search_query AS (
  SELECT plainto_tsquery('simple', $1) AS q
),

sql_rows AS (

  SELECT
    s.site_name,
    p.path,
    s.domain,
    s.description,
    p.description AS d2,
    p.title,

    ts_rank(
      to_tsvector(
        'simple',
        coalesce(s.site_name,'') || ' ' ||
        coalesce(p.title,'') || ' ' ||
        coalesce(p.description,'') || ' ' ||
        coalesce(s.description,'') || ' ' ||
        coalesce(s.domain,'')
      ),
      search_query.q
    ) AS score

  FROM public.pages p
  JOIN public.sites s
    ON s.id = p.site_id

  CROSS JOIN search_query

  UNION ALL

  SELECT
    s.site_name,
    '',
    s.domain,
    s.description,
    '',
    s.site_name,

    ts_rank(
      to_tsvector(
        'simple',
        coalesce(s.site_name,'') || ' ' ||
        coalesce(s.description,'') || ' ' ||
        coalesce(s.domain,'')
      ),
      search_query.q
    ) AS score

  FROM public.sites s

  CROSS JOIN search_query
)

SELECT

  EXTRACT(
    EPOCH FROM (clock_timestamp() - start_sql.start_time)
  ) * 1000 AS time_resp,

  (
    SELECT COUNT(*)
    FROM sql_rows
    WHERE score > 0
  ) AS total,

  (
    SELECT json_agg(row_to_json(r))
    FROM (
      SELECT *
      FROM sql_rows
      WHERE score > 0
      ORDER BY score DESC
      LIMIT 8
    ) r
  ) AS results

FROM start_sql;
`

interface BIG_QUERY_TYPE {
  time_resp: number
  total: number
  results: any[]
}


export default async function $$(
  query: string,
  gl: string
) {
  return (await pool.query<BIG_QUERY_TYPE>(BIG_QUERY, [query])).rows
}
export async function $$$(
  query: string
) {
  return (
    await pool.query<{ value: string }>(`
      WITH words AS (

        SELECT lower(word) AS value
        FROM public.pages p
        JOIN public.sites s
          ON s.id = p.site_id

        CROSS JOIN LATERAL regexp_split_to_table(
          concat_ws(
            ' ',
            s.site_name,
            p.title,
            p.path,
            s.domain
          ),
          E'[^[:alnum:]]+'
        ) AS word

      )

      SELECT
        value

      FROM words

      WHERE
        value LIKE lower($1) || '%'
        AND length(value) > 2

      GROUP BY value

      ORDER BY
        count(*) DESC,
        length(value)

      LIMIT 10;
    `, [query])
  ).rows;
}