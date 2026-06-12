import dotenv from "dotenv";
// @ts-ignore
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
}) as {
  query<T = any>(query: string, data?: any[]): Promise<{ rows: T[] }>
}
export default pool