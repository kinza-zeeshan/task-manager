    import sql from "mssql";

​

const config: sql.config = {

server: process.env.DB_SERVER || "localhost",

port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,

database: process.env.DB_NAME || "TaskManagerDB",

user: process.env.DB_USER || "Zaki",

password: process.env.DB_PASSWORD || "Password123!",

options: {

encrypt: process.env.DB_ENCRYPT === "true",

trustServerCertificate: process.env.DB_TRUST_CERT !== "false",

},

pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },

};

​

const globalForDb = globalThis as unknown as { pool?: Promise<sql.ConnectionPool> };

​

export function getPool() {

if (!globalForDb.pool) {

globalForDb.pool = new sql.ConnectionPool(config)

.connect()

.catch((err) => {

globalForDb.pool = undefined;

throw err;

});

}

return globalForDb.pool;

}

​

export { sql };