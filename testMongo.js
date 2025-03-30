require("dotenv").config();  // Cargar variables de entorno desde .env
const mongoose = require("mongoose");

// 📌 Conectar a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// 📌 Definir el esquema y modelo de MongoDB
const registroSchema = new mongoose.Schema({
  bpm: Number,
  spo2: Number,
  estado: String,
  fecha: Date,
  hora: String,
});

const Registro = mongoose.model("registrosignosvitales", registroSchema); // Asegura que el nombre coincida con Compass

// 📌 Consultar los datos de MongoDB
Registro.find()
  .then((data) => {
    console.log("📢 Prueba directa: Datos encontrados en MongoDB:", data);
    process.exit(); // Finalizar ejecución
  })
  .catch((err) => {
    console.error("❌ Error al obtener datos de MongoDB:", err);
    process.exit();
  });
