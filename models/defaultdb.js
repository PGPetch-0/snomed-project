const mysql = require('mysql2')

const defaultdb = mysql.createConnection({
    host: "db_host",
    user: "db_admin",
    password: "db_password",
    database: "db_database",
    port: "db_port"
})

module.exports = defaultdb