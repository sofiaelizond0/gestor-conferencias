const express = require("express");
const cors = require("cors");
const { sql, config } = require("./db");
const QRCode = require("qrcode");

const app = express();

app.use(cors());
app.use(express.json());

sql.connect(config)
.then(() => {
    console.log("Connected to Azure SQL");
})
.catch(err => {
    console.error("Database connection failed:", err);
});

app.get("/api/conferencias", async (req, res) => {
    try {

        const result = await sql.query(`
            SELECT IdConferencia, Name, Date, Location
            FROM Conferencias
        `);

        res.json(result.recordset);

    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Error retrieving conferences" });
    }
});

app.post("/api/registro", async (req, res) => {

    const { nombre, apellido, email, phone, idConferencia } = req.body;

    if (!nombre || !apellido || !email || !idConferencia) {
        return res.status(400).json({
            error: "Datos incompletos"
        });
    }

    try {

        const asistenteExistente = await sql.query`
            SELECT IdAsistente 
            FROM Asistentes 
            WHERE Email = ${email}
        `;

        let attendeeId;

        if (asistenteExistente.recordset.length > 0) {
            attendeeId = asistenteExistente.recordset[0].IdAsistente;
        } else {

            const resultadoAsistente = await sql.query`
                INSERT INTO Asistentes (Name, Apellido, Email, Phone)
                OUTPUT INSERTED.IdAsistente
                VALUES (${nombre}, ${apellido}, ${email}, ${phone})
            `;

            attendeeId = resultadoAsistente.recordset[0].IdAsistente;
        }

        const resultadoRegistro = await sql.query`
            INSERT INTO Registros (IdAsistente, IdConferencia)
            OUTPUT INSERTED.IdRegistro
            VALUES (${attendeeId}, ${idConferencia})
        `;

        const registroId = resultadoRegistro.recordset[0].IdRegistro;

        const qrContent = `registro-${registroId}`;

        const qrImage = await QRCode.toDataURL(qrContent);

        await sql.query`
            UPDATE Registros
            SET CodigoQr = ${qrContent}
            WHERE IdRegistro = ${registroId}
        `;

        res.json({
            success: true,
            registroId: registroId,
            qr: qrImage
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error en el registro"
        });

    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});