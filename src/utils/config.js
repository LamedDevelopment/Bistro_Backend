const path = require('path');
const data = require('dotenv').config({
    path: path.resolve(__dirname, `../../environments/.env.${process.env.NODE_ENV}`)
});

// console.log("Contenido de data:", data.parsed);
module.exports = {
    PORT: data.parsed.PORT,
    API: data.parsed.ROOT_API,
    ENVIROMENT: data.parsed.ENVIROMENT,
    ROOT_API: data.parsed.ROOT_API,
    MONGO_URL: data.parsed.MONGO_URL,
    JWT_SECRET: data.parsed.JWT_SECRET,
    QR_SECRET: data.parsed.QR_SECRET,
    URL_QR: data.parsed.URL_QR,
    // URL_MAIL: data.parsed.URL_MAIL,
    // URL_BACKEND: data.parsed.URL_BACKEND,
    // GIUDLGN: data.parsed.GIUDLGN,
    // GIUDKEY: data.parsed.GIUDKEY,
    // LGNCOLSAD: data.parsed.LGNCOLSAD,
    // BILLCOLSAD: data.parsed.BILLCOLSAD,
    // USERCOLSAD: data.parsed.USERCOLSAD,
    // PASSCOLSAD: data.parsed.PASSCOLSAD,
}