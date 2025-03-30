const express = require("express");
const Registro = require("../models/registroModel");

const router = express.Router();

module.exports = (io) => {
  // 📌 Ruta para guardar datos desde ESP32 y emitir datos en tiempo real
  router.post("/api/datos", async (req, res) => {
    try {
      const { bpm, spo2 } = req.body;

      // 📌 Obtener la hora actual
      const fecha = new Date();
      const hora = fecha.toTimeString().split(" ")[0]; // HH:MM:SS

      // 📌 Determinar estado del paciente (coincide con Arduino)
      let estado = "Normal";
      if (spo2 < 85 && (bpm > 150 || bpm < 40)) {
        estado = "Emergencia: O2 & BPM";
      } else if (spo2 < 85) {
        estado = "Crítico: O2 bajo";
      } else if (bpm > 150) {
        estado = "Crítico: Ritmo alto";
      } else if (bpm < 40) {
        estado = "Precaución: Ritmo bajo";
      }

      // 📌 Guardar en MongoDB
      const nuevoRegistro = new Registro({ bpm, spo2, estado, fecha, hora });
      await nuevoRegistro.save();

      // 🔹 Enviar el nuevo dato a WebSockets para actualización en tiempo real
      io.emit("nueva_medicion", nuevoRegistro);

      res.status(201).json({ mensaje: "✅ Datos guardados correctamente", estado, fecha, hora });
    } catch (error) {
      res.status(500).json({ error: "❌ Error al guardar los datos" });
    }
  });

  // 📌 Ruta para obtener registros (sin filtrar por paciente)
  router.get("/api/datos", async (req, res) => {
    try {
      const registros = await Registro.find().sort({ fecha: -1 }).limit(20);
      res.status(200).json(registros);
    } catch (error) {
      res.status(500).json({ error: "❌ Error al obtener los datos" });
    }
  });

  return router;
};
