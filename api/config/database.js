const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

export default {

  client: 'pg',

  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
  },

  migrations: {
    tableName: 'migrations',
    directory: '../migrations'
  }

}
