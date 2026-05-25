import "server-only";

import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function hasMysqlConfig() {
  return Boolean(
    process.env.MYSQL_URL ||
      (process.env.MYSQL_HOST &&
        process.env.MYSQL_USER &&
        process.env.MYSQL_DATABASE)
  );
}

export function getMysqlPool() {
  if (!hasMysqlConfig()) {
    throw new Error("MySQL credentials are not configured.");
  }

  if (!pool) {
    if (process.env.MYSQL_URL) {
      pool = mysql.createPool(process.env.MYSQL_URL);
    } else {
      pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
  }

  return pool;
}
