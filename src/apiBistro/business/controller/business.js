const { response } = require("express");
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

const { CreateDataBusinessDTO } = require("../dto/busniness");
const { createBusinessDAO } = require("../dao/business");
const { applogger } = require("../../../utils/logger");
const { URL_QR } = require('../../../utils/config');
const { CreateObfuscateQR } = require("../../helper/obfuscate/obfuscateQR");
const { ShowTokenInComponentsDAO } = require("../../../middleware/globalValidations");

const viewBusiness = async(req, res = response) => {

    res.json({
        ok: true,
        msg: req.body
    });
};


const createBusiness = async(req, res = response) => {

    const { businessName,tradeName,nit,branchoffices,email,movil,phone,img,address,country,countryCod,regionCountry,
        city,zip,billingResolution, tax,services,typeService,description} = req.body;

    try {

        const CreateDataBusinessDto = new CreateDataBusinessDTO(businessName,tradeName,nit,branchoffices,email,movil,phone,img,
            address,country,countryCod,regionCountry,city,zip,billingResolution, tax,services,typeService,description);  
        
        const createBusinessDao = await createBusinessDAO(CreateDataBusinessDto);

        if(createBusinessDao.ok === false) {
            applogger.error(`Error en createBusiness: Error al Crear el Establecimiento, Bus: ${nit}, error: ${error}`);
            return {
                ok: false,
                msg: 'BUSCLL-02: Error al Crear el Establecimiento'
            }
        }

        res.json({
            ok: true,
            msg: createBusinessDao.msg
        });
    } catch (error) {
        applogger.error(`Error en createBusiness: Error al Crear el Establecimiento, Bus: ${nit}, error: ${error}`);
        return {
            ok: false,
            msg: 'BUSCLL-02: Error al Crear el Establecimiento' + error
        }
    }
};

const getCreateTableBusiness = async (req, res = response) => {
    try {
        // LEER EL TOKEN
        const token = req.header('x-token');
        // LEER EL BODY
        const orderData = req.body;
        const { business, preFijoTable, numIniTable, numEndTable } = orderData;

        // VALIDAR EL TOKEN
        const decodedToken = await ShowTokenInComponentsDAO(token);
        const { role, establishments } = decodedToken.msg;

        // Validar permisos
        if (role === 'Administrador' && establishments === business.businessID) {

            // Array para almacenar los QR generados
            let qrCodes = [];

            // Iterar desde numIniTable hasta numEndTable para generar cada QR
            for (let table = numIniTable; table <= numEndTable; table++) {
                const tableID = `${preFijoTable}-${table}`;

                // Datos originales para ofuscar la información
                const datosOriginales = {
                    d1: business.businessID,
                    d2: business.nit,
                    d3: business.tradename,
                    d4: business.countryCod,
                    d5: tableID,
                    d6: business.deliveryMethod
                };

                // Crear el código QR ofuscado
                const ofuscado = await CreateObfuscateQR(datosOriginales);
                const encodeData = encodeURIComponent(ofuscado);
                const url = `${URL_QR}?d=${encodeData}`;

                // Generar el QR en formato DataURL
                const qrCodeURL = await new Promise((resolve, reject) => {
                    QRCode.toDataURL(url, (err, url) => {
                        if (err) return reject(err);
                        resolve(url);
                    });
                });

                qrCodes.push({ tableID, qrCodeURL, tableNumber: table });
            }

            // Crear el PDF
            const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            const pdfPromise = new Promise((resolve, reject) => {
                doc.on('end', () => {
                    let pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });
                doc.on('error', reject);
            });

            // Configuración de layout: 6 QR por página en una grilla de 3 columnas x 2 filas.
            const qrWidth = 150;
            const qrHeight = 150;

            // Posiciones X para las 3 columnas
            const xOffsets = [50, 250, 450]; 
            // Posiciones Y para las 2 filas
            const yOffsets = [50, 300];

            let count = 0; // Contador de QR en la página

            // Iterar sobre cada QR generado y colocarlo en el PDF
            for (let i = 0; i < qrCodes.length; i++) {
                // col será 0, 1 o 2
                const col = count % 3;
                // row será 0 o 1
                const row = Math.floor(count / 3) % 2;
                const x = xOffsets[col];
                const y = yOffsets[row];

                // Extraer la parte base64 del DataURL (removiendo "data:image/png;base64,")
                const base64Data = qrCodes[i].qrCodeURL.replace(/^data:image\/png;base64,/, '');
                const imgBuffer = Buffer.from(base64Data, 'base64');

                // Agregar la imagen del QR
                doc.image(imgBuffer, x, y, { width: qrWidth, height: qrHeight });

                // Agregar el texto "Mesa_" + número de la mesa debajo del QR
                doc.fontSize(14)
                   .text(`Mesa_${preFijoTable}${qrCodes[i].tableNumber}`, x, y + qrHeight + 2, { 
                       width: qrWidth, 
                       align: 'center' 
                   });

                count++;

                // Si ya se han colocado 6 QR en la página y aún quedan más, agregar una nueva página
                if (count === 6 && i < qrCodes.length - 1) {
                    doc.addPage();
                    count = 0;
                }
            }

            doc.end();
            const pdfBuffer = await pdfPromise;

            // Convertir el PDF a base64 para retornarlo
            const pdfBase64 = pdfBuffer.toString('base64');
            return res.status(200).json({
                ok: true,
                msg: pdfBase64
            });
        } else {
            applogger.error(`Error en getCreateTableBusiness: Error al Crear el QR de Mesas, Bus: ${business.nit}`);
            return res.status(403).json({
                ok: false,
                msg: 'BUSCLL-03: Error al Crear el QR de Mesas'
            });
        }
    } catch (error) {
        applogger.error(`Error en getCreateTableBusiness: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno al crear los QR de Mesas',
            error: error.message
        });
    }
};

const getQRServiceBusiness = async (req, res = response) => {

    const token = req.header('x-token');
    const { business, tradename } = req.body;

    const decodedToken = await ShowTokenInComponentsDAO(token)
    const { uid, bus, role } = decodedToken.msg

    try {
        const ServiceQRBusinessDB = await getServiceQRBusinessDAO(uid, bus, role, business, tradename)    
    
        res.status(200).json({
            ok: true,
            msg: ServiceQRBusinessDB.msg
        })
                
    } catch (error) {
        
    }

}


module.exports = {
    viewBusiness,
    createBusiness,
    getCreateTableBusiness,
}