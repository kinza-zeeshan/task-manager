import sql from "mssql";

const config: sql.config = {
  server: "localhost",
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    instanceName: "SQLEXPRESS",
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

const globalForDb = globalThis as unknown as { pool?: Promise<sql.ConnectionPool> };

export function getPool() {
  if (!globalForDb.pool) {
    globalForDb.pool = new sql.ConnectionPool(config).connect();
  }
  return globalForDb.pool;
}

export { sql };