const CryptoJS = require('crypto-js');
const { QR_SECRET } = require('../../../utils/config');
const { applogger } = require('../../../utils/logger');


async function CreateObfuscateQR(datosOriginales) {
    try {
        console.log('datosOriginales: ', datosOriginales);
        const datosJson = JSON.stringify(datosOriginales);

        // Encriptar los datos con AES
        const datosEncriptados = CryptoJS.AES.encrypt(datosJson, QR_SECRET).toString();

        return datosEncriptados;
    } catch (error) {
        console.error('HLP-01: Error al Ofuscar los Datos de business: ', error);
        return {
            ok: false,
            msg: 'HLP-01: Error al Ofuscar los Datos.'
        };
    }
}


async function ResolveObfuscateQR(datosEncriptados) {
    try {
        // Asegúrate de que los datos encriptados sean una cadena válida
        if (typeof datosEncriptados !== 'string') {
            throw new Error('Datos encriptados no son una cadena válida');
        }

        // Decodificar la URL
        // console.log('datosEncriptados: ', datosEncriptados);
        const datosDecodificados = decodeURIComponent(datosEncriptados);
        // console.log('datosDecodificados: ', datosDecodificados);

        // Desencriptar los datos
        const bytesDesencriptados = CryptoJS.AES.decrypt(datosDecodificados, QR_SECRET);
        const datosDesencriptados = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
        // console.log('datosDesencriptados: ', datosDesencriptados);

        // Verificar que los datos desencriptados no estén vacíos
        if (!datosDesencriptados) {
            throw new Error('Datos desencriptados vacíos');
        }

        // Parsear los datos desencriptados como JSON
        const jsonDesencriptado = JSON.parse(datosDesencriptados);
        return jsonDesencriptado;

    } catch (error) {
        console.error('HLP-02: Error al Desofuscar los Datos de business: ', error);
        return {
            ok: false,
            msg: 'HLP-02: Error al Desofuscar los Datos. ' + error.message
        };
    }
}


module.exports = {
    CreateObfuscateQR,
    ResolveObfuscateQR,
}