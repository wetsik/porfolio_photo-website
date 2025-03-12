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
  connectionString: "postgresql://westik:wYxoygAzN1t60BhfFdNUG9OufvChjBLM@dpg-cv4plivnoe9s73censo0-a.oregon-postgres.render.com/yupiter_ug0u",
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

module.exports = pool;