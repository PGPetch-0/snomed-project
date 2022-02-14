const mysql = require('mysql2')

const defaultdb = mysql.createConnection({
    host: "ice-project-db-cluster-do-user-10821051-0.b.db.ondigitalocean.com",
    user: "doadmin",
    password: "K5eyyFk4Ua36lUsq",
    database: "defaultdb",
    port: "25060"
})

module.exports = defaultdb