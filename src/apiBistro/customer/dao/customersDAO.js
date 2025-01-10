
const { applogger } = require('../../../utils/logger');
const { viewBusinessForIDDAO } = require('../../business/dao/business');
const { DataCreateBusinessDTO } = require('../../business/dto/busniness');
const { milisegundos } = require('../../helper/global/times');
const customer = require('../model/customer');

// Función para crear un nuevo usuario en la base de datos
const createCustomerDAO = async (userData) => {
  try {
    const customerDB = new customer( userData );
    const createCustomer = await customerDB.save();

    return {      
      ok: true,
      msg: `Se Creo el Cliente`
    };
  } catch (error) {
    applogger.error(`Error en UsersDAO: createUserDAO: usersEmail: ${userData.email} error: ${error}`);
    // Verificar si es un error de clave duplicada y devolver un mensaje específico
    if (error.code === 11000) {
      return {
        ok: false,
        msg: `El Cliente ${userData.movil} ya está registrado.`
      };
    }
    return {
      ok: false,
      msg: 'CREUSD4O: createUserDAO ',
      error: error
    }
  }
};





module.exports = {
  createCustomerDAO,
};
