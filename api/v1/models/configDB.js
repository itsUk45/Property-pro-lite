import {Pool, Client} from 'pg';
import dotenv from 'dotenv';
dotenv.config(); //loads the environment variables

/*
const pool1 = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
  }
	);
	*/

// heroku connectin style where database connnection string is supplied to dyno
// const connectionString = 'postgresql://dbuser:secretpassword@dsomehost:3211/mydb'
const pool = new Pool({
	connectionString: process.env.DB_CONNECTION_STRING,
});
export {pool};