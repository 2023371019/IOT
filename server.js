require("dotenv").config();  // Cargar variables de entorno desde .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 📌 Conectar a MongoDB Atlas usando la variable del .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// 📌 Definir el esquema y modelo de MongoDB
const registroSchema = new mongoose.Schema({
  bpm: { type: Number, required: true },
  spo2: { type: Number, required: true },
  estado: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  hora: { type: String },
});

const Registro = mongoose.model("registrosignosvitales", registroSchema); // 📌 Nombre corregido

// 📌 Ruta para obtener los últimos 20 registros de MongoDB
app.get("/api/datos", async (req, res) => {
  try {
    console.log("📢 Consultando datos en MongoDB...");

    const registros = await Registro.find().sort({ fecha: -1 }).limit(20);

    console.log("📢 Datos obtenidos en la API:", registros);

    if (registros.length === 0) {
      console.warn("⚠️ No hay datos en la colección de MongoDB.");
    }

    res.status(200).json(registros);
  } catch (error) {
    console.error("❌ Error al obtener los datos de MongoDB:", error);
    res.status(500).json({ error: "❌ Error al obtener los datos de MongoDB" });
  }
});

// 📌 Ruta para insertar un nuevo registro (opcional, útil para pruebas)
app.post("/api/datos", async (req, res) => {
  try {
    const { bpm, spo2 } = req.body;
    if (!bpm || !spo2) {
      return res.status(400).json({ error: "❌ Los campos bpm y spo2 son obligatorios" });
    }

    const fecha = new Date();
    const hora = fecha.toLocaleTimeString();
    
    let estado = "Normal";
    if (spo2 < 85) estado = "Crítico: Oxigenación baja";
    else if (bpm < 40 || bpm > 150) estado = "Crítico: Ritmo cardíaco anormal";

    const nuevoRegistro = new Registro({ bpm, spo2, estado, fecha, hora });
    await nuevoRegistro.save();

    console.log("✅ Nuevo registro guardado:", nuevoRegistro);
    res.status(201).json({ mensaje: "✅ Registro guardado correctamente", data: nuevoRegistro });
  } catch (error) {
    console.error("❌ Error al guardar el registro:", error);
    res.status(500).json({ error: "❌ Error al guardar el registro" });
  }
});

// 📌 Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
});
