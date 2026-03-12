const sql = require("mssql");

const config = {
    user: "tu_usuario",
    password: "tu_password",
    server: "PRODESK400G7",
    database: "GestionConferencias",
    options: {
        trustServerCertificate: true
    }
};

module.exports = { sql, config };