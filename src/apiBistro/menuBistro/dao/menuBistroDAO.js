const { ObjectId } = require('mongodb');
const { getDateTimeForCountry } = require('../../helper/global/times');
const menuBistro = require('../model/menuBistro');
const { applogger } = require('../../../utils/logger');

const getCreateMenuBistroDAO = async (DataMenuBistroDto) => {
    const { business, menu } = DataMenuBistroDto;
  
    try {
      // Generar la fecha actual según el país
      const dateNow = getDateTimeForCountry(business.countryCod);
  
      // Construir el filtro para buscar el documento
      const filter = {
        'business.nit': business.nit,
        'business.tradename': business.tradename,
      };
  
      // Construir el nuevo documento
      const updatedDocument = {
        business: {
          business: business.business,
          nit: business.nit,
          nameBusiness: business.businessName,
          tradename: business.tradename,
          countryCod: business.countryCod,
        },
        menu: menu.map((category) => ({
          ...category,
          product: category.product.map((product) => ({
            ...product,
            productUnique: category.category + '_' + product.name,
            dateCreate: dateNow, // Añadir fecha de creación a cada producto
          })),
        })),
      };
  
      // Opciones para el método findOneAndUpdate
      const options = {
        new: true, // Devuelve el documento actualizado
        upsert: true, // Crea un nuevo documento si no existe
      };
  
      // Ejecutar la operación en la base de datos
      const result = await menuBistro.findOneAndUpdate(filter, updatedDocument, options);
  
      return result;
    } catch (error) {
        applogger.error(`MNBIS-01: getCreateMenuBistroDAO > Error al Crear el Menu de: ${business.business}, errores ${error}`);
        return {
            ok: false,
            msg: `MNBIS-01: getCreateMenuBistroDAO > Error al Crear el Menu de: ${business.business}, errores ${error}`
        }
    }
  };
  

  const getViewMenuBistroDAO = async (DataViewMenuBistroDto) => {
    
    const { nit, business, tradename, countryCod } = DataViewMenuBistroDto.business;
        
    try {

      const getViewMenuBistro = await menuBistro.findOne(
        { 
          'business.nit': nit,
          'business.tradename': tradename, 
          'business.countryCod': countryCod,
          'menu.status': true,
          'menu.product.status': true
        },
        {
          'menu.product.name': 1,
          "menu.product.description": 1,
          "menu.product.price": 1,
          "menu.product.img": 1,
          "menu.product._id": 1
        }
      );
      
      return {
        ok: true,
        msg: getViewMenuBistro,
      };
    } catch (error) {
      
      applogger.error(`MNBIS-02: getViewMenuBistroDAO > Error al Consultar el Menu de: ${business} ${nit}, errores ${error}`);
        return {
            ok: false,
            msg: `MNBIS-01: getCreateMenuBistroDAO > Error al Crear el Menu de: ${business} ${nit}, errores ${error}`
        }
    }

  }



  module.exports = { 
    getCreateMenuBistroDAO,
    getViewMenuBistroDAO, 
}