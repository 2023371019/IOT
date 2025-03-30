# Usa una imagen base oficial de Node.js
FROM node:18

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Expón el puerto que usará la app (Cloud Run usará este)
EXPOSE 8080

# Define el comando para iniciar la app
CMD ["node", "servidor.js"]
