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
  

module.exports = { 
    getCreateMenuBistroDAO, 
}