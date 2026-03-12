const sql = require("mssql");

const config = {
    user: "selizond0",
    password: "789456qqq-",
    server: "servidor-conferencias.database.windows.net",
    database: "GestionConferencias",
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

module.exports = { sql, config };