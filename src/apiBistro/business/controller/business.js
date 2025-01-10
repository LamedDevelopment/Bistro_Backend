const { response } = require("express");
const { CreateDataBusinessDTO } = require("../dto/busniness");
const { createBusinessDAO } = require("../dao/business");
const { applogger } = require("../../../utils/logger");

const viewBusiness = async(req, res = response) => {

    res.json({
        ok: true,
        msg: req.body
    });
};


const createBusiness = async(req, res = response) => {

    const { businessName,tradeName,nit,branchoffices,email,movil,phone,img,address,country,countryCod,regionCountry,
        city,zip,services,typeService,description} = req.body;

    try {

        const CreateDataBusinessDto = new CreateDataBusinessDTO(businessName,tradeName,nit,branchoffices,email,movil,phone,img,
            address,country,countryCod,regionCountry,city,zip,services,typeService,description);  
        
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


module.exports = {
    viewBusiness,
    createBusiness,
}