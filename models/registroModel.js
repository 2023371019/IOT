const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },       // Fecha completa del registro
    hora: { type: String, required: true },        // Hora en formato HH:MM:SS
    bpm: { type: Number, required: true },         // Ritmo cardíaco
    spo2: { type: Number, required: true },        // Nivel de oxigenación
    estado: { type: String, required: true }       // Estado basado en alertas del código de Arduino
}, { versionKey: false });  // Desactiva el campo __v de Mongoose

const RegistroSignosVitales = mongoose.model('RegistroSignosVitales', registroSchema);

module.exports = RegistroSignosVitales;
