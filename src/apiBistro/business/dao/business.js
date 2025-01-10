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
        city,zip,services,typeService,description} = CreateDataBusinessDto

    try {
        const dateCreate = getDateTimeForCountry(countryCod);

        const CreateBusinessDto = new CreateBusinessDTO(businessName,tradeName,nit,branchoffices,email,movil,phone,img, address,country,countryCod,regionCountry,
        city,zip,services,typeService,description,dateCreate)

        const businessDB = new business(CreateBusinessDto)
        
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

module.exports = {
    viewBusiness,
    createBusinessDAO,
    viewBusinessForIDDAO,
}

