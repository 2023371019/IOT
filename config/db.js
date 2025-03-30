const mongoose = require('mongoose');
require('dotenv').config();

// Conectar con MongoDB Atlas
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("❌ Error de conexión a MongoDB:", error);
        process.exit(1);
    }
};

module.exports = conectarDB;
