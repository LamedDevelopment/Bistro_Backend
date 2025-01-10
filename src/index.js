const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const cors = require('cors');
const morgan = require('morgan');
const env = require('./utils/config');
const { dbConn } = require('./database/config');

const app = express();
app.set('trust proxy', 1); // Confía en el primer proxy
const server = http.createServer(app);
const io = socketIo(server);

const version = env.ROOT_API;
const port = env.PORT;

// Coneccion a Base de Datos
dbConn();
app.use(cors());

app.use(express.urlencoded({ extended:false}));
app.use(morgan('dev'));
app.use(express.json());

// Rutas
//TODO: Gestion de Login
app.use(`${version}/login`, require('./apiBistro/auth/routes'));

// TODO: Gestion de Staff
app.use(`${version}/staff`, require('./apiBistro/staff/routes'));

// TODO: Gestion de Customer
app.use(`${version}/cust`, require('./apiBistro/customer/routes'));

// TODO: Gestion de Business
app.use(`${version}/buss`, require('./apiBistro/business/routes'));
app.use(`${version}/mnbis`, require('./apiBistro/menuBistro/routes'));



// configuramos el Servidor de express
app.listen(port, () => {
    console.log(`${env.ENVIROMENT} ${env.PORT}`);
});