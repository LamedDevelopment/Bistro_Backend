const { response } = require("express");
const business = require("../model/business");
const { getDateTimeForCountry } = require("../../helper/global/times");
const { CreateBusinessDTO } = require("../dto/busniness");
const { applogger } = require("../../../utils/logger");

const viewBusiness = async() => {

    res.json({
        ok: true,
        msg: req.body
    });
};


const createBusinessDAO = async(CreateDataBusinessDto) => {

    const {businessName,tradeName,nit,branchoffices,email,movil,phone,img, address,country,countryCod,regionCountry,
        city,zip, billingResolution, tax, services,typeService,description} = CreateDataBusinessDto

    try {
        const dateCreate = getDateTimeForCountry(countryCod);

        
        const CreateBusinessDto = new CreateBusinessDTO(businessName,tradeName,nit,branchoffices,email,movil,phone,img, address,country,countryCod,regionCountry,
            city,zip,billingResolution,tax,services,typeService,description,dateCreate)
            
            const businessDB = new business(CreateBusinessDto)
            
            console.log('Datos del DAO: ', businessDB);
            const getBusiness = await businessDB.save();
    
        if(!getBusiness){
            applogger.error(`Error en createBusinessDAO: Error al Crear el Business: Nit: ${nit}`);
            return {
                ok: false,
                msg: 'Error al crear el Business'
            }
        }
    
        return {
            ok: true,
            msg: `Se Creo el Business: ${nit}: ${tradeName}`
        }
        
    } catch (error) {
        applogger.error(`Error en createBusinessDAO: Error al Crear el Establecimiento, Bus: ${nit}, error: ${error}`);
        return {
            ok: false,
            msg: 'BUSDAO-02: Error al Crear el Establecimiento' + error
        }
    }  
};

const viewBusinessForIDDAO = async(bussID) => {

    try {

        const businessDB = await business.findById(bussID,
            {
                _dir: 1,
                nit: 1,
                businessName: 1,
                tradeName: 1,
                branchoffices: 1,
                email: 1,
                movil: 1,
                phone: 1,
                img: 1,
                tax: 1,
                billingResolution: 1,
                address: 1,
                country: 1,
                countryCod: 1,
                regionCountry: 1,
                city: 1,
                zip: 1,
            }
        );

        return {
            ok: true,
            msg: businessDB
        }
        
    } catch (error) {
        return {
            ok: false,
            msg: 'Error al Consulta el Establecimiento'
        }
        
    }
}

const getServiceQRBusinessDAO = async (uid, bus, role, businessID, tradename) => {
    try {
        // Buscar el negocio por NIT y estado activo
        const businessDB = await business.findOne({
            nit: bus,
            status: true
        }, {
            _id: 1
        });

        if (!businessDB) {
            throw new Error('No se encontró el negocio con el NIT proporcionado');
        }

        const userID = uid;
        const bus1 = businessDB._id;

        // Datos originales para ofuscar
        const datosOriginales = {
            d1: bus1,
            d2: userID,
            d3: role.profile,
            d4: bus1,
            d5: tradename
        };
        

        // Crear el código QR ofuscado
        const ofuscado = await CreateObfuscateQR(datosOriginales);
        const encodeData = await encodeURIComponent(ofuscado)

        // Construir la URL con los parámetros ofuscados
        // const url = `${URL_QR}?d=${encodeURIComponent(ofuscado)}`;
        const url = `${URL_QR}?d=${encodeData}`;

        // Datos adicionales que se incluirán en el QR
        const data = `${url}`;

        // Cargar el logo
        const logoPath = path.join(__dirname, '../../../assets/img/icon/kalos.png');
        let logo;
        try {
            logo = fs.readFileSync(logoPath);
        } catch (error) {
            console.error('Error al cargar el logo:', error);
            throw new Error('No se pudo cargar el logo');
        }

        // Opciones de personalización del QR
        const options = {
            errorCorrectionLevel: 'M', // Nivel de corrección de errores
            type: 'png',
            margin: 4,
            color: {
                dark: '#453062', // Color del código QR
                light: '#ffffff' // Color de fondo
            },
            parse_url: false,
            logo: logo, // Logo
            logo_width: 80, // Ancho del logo
            logo_height: 80, // Alto del logo
            title: 'Registro a Kalos', // Título del QR
            body: {
                type: 'circle'
            } // Patrón de cuerpo
        };

        // Generar el QR
        const qrCodeURL = await new Promise((resolve, reject) => {
            QRCode.toDataURL(data, (err, url) => {
                if (err) reject(err);
                resolve(url);
            });
        });

        console.log('URL del QR: ', qrCodeURL);
        return {
            ok: true,
            msg: qrCodeURL
        };

    } catch (error) {
        console.error('Error al generar el QR:', error);
        return {
            ok: false,
            msg: 'Error al generar el QR'
        };
    }
}


/**
 * Actualiza el parámetro currentNumbering de la resolución de facturación del Business.
 * @param {String} businessID - ID del negocio a actualizar.
 * @param {String} newInvoiceNumber - Nuevo número de factura generado, e.g.: "SETP990000001".
 * @returns {Object} Resultado de la operación: { ok: true, msg: updatedBusiness } o { ok: false, msg: error }.
 */
const getUpdateinvoiceNumberByIDDAO = async (businessID, newInvoiceNumber) => {
    try {
      // Suponiendo que el prefijo tiene 4 caracteres (por ejemplo, "SETP"),
      // removemos el prefijo para obtener solo el número.
      const updatedNumber = Number(newInvoiceNumber.substring(4)); // Ej: "SETP990000001" -> 990000001
  
      console.log('businessID: ', businessID);
      console.log('updatedNumber: ', updatedNumber);
      
      const updatedBusiness = await business.findByIdAndUpdate(
        businessID,
        { $set: { 'billingResolution.currentNumbering': updatedNumber } },
        { new: true }
      );

      console.log('updatedBusiness: ', updatedBusiness);
  
      return {
        ok: true,
        msg: 'Se Actualizo el Numero de Factura'
      };
    } catch (error) {
      console.error("Error updating invoice number:", error);
      return {
        ok: false,
        msg: "Error updating invoice number",
        error,
      };
    }
  };

module.exports = {
    viewBusiness,
    createBusinessDAO,
    viewBusinessForIDDAO,
    getUpdateinvoiceNumberByIDDAO,
}

