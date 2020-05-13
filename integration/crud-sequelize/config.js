module.exports = {
  "development": {
    "dialect": process.env.DB === "mysql" ? "mysql": "postgres",
    "host": "127.0.0.1",
    "port": process.env.DB === "mysql" ? 3317: 5456,
    "username": process.env.DB === "mysql" ? "nestjsx_crud" : "root",
    "password": process.env.DB === "mysql" ? "nestjsx_crud" : "root",
    "database": "nestjsx_crud_sequelize",
    "logging": false,
    "migrationsPath": `${__dirname}/migrations`
  }
}
