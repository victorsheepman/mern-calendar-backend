const express = require('express');
require('dotenv').config()

const { dbConnection }=require('./database/config')

const cors = require('cors')

//crear el servidor
const app = express();

//base de datos
dbConnection();

//cors
app.use(cors())

//directorio publico
app.use( express.static('public') )

//Lectura y parseo de body
app.use(express.json())

//rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

//escuchar peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
})



