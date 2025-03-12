// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "yupiter",
//   password: "963.",
//   port: 5432,
// });

// module.exports = pool;



const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://westik:wYxoygAzN1t60BhfFdNUG9OufvChjBLM@dpg-cv4plivnoe9s73censo0-a.oregon-postgres.render.com/yupiter_ug0u",
  ssl: {
    rejectUnauthorized: false, // Требуется для Render PostgreSQL
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err.stack);
  } else {
    console.log("Подключение к базе данных успешно");
    release();
  }
});

module.exports = pool;