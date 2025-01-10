
const bcrypt = require('bcryptjs');
const { applogger } = require('../../../utils/logger');
const { viewBusinessForIDDAO } = require('../../business/dao/business');
const { DataCreateBusinessDTO } = require('../../business/dto/busniness');
const { milisegundos } = require('../../helper/global/times');
const { CreateDataStaffDTO } = require('../dto/staff');
const staff = require('../model/staff');

// Función para crear un nuevo usuario en la base de datos
const createStaffDAO = async (userData) => {

  const { email, name, lastName, pass } = userData;
  
  try {

    const lowerCaseEmail = email.toLowerCase();
    // Convertir name y lastName a formato de Nombre Propio
    const properCaseName = name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    const properCaseLastName = lastName.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

    const businessDB = await viewBusinessForIDDAO(userData.membership)
    
    const DataCreateBusinessDto = new DataCreateBusinessDTO(businessDB.msg,userData.dateCreate);

    // TODO: Hay que Encriptar el Pass antes de enviarlo a la BD.
    console.log(userData.pass);
    const salt = bcrypt.genSaltSync();
    console.log('salt: ', salt);
    userData.pass = bcrypt.hashSync(pass, salt);
    
    const CreateDataStaffDto = new CreateDataStaffDTO(userData,DataCreateBusinessDto, lowerCaseEmail, properCaseName, properCaseLastName)    
    const usuarioDB = new staff( CreateDataStaffDto );
    const createUser = await usuarioDB.save();

    return {      
      ok: true,
      msg: `Se Creo el Usuario: ${userData.name} ${userData.lastName} para el Establecimiento: ${businessDB.msg.nit}: ${businessDB.msg.tradename}`
    };
  } catch (error) {
    applogger.error(`Error en UsersDAO: createUserDAO: usersEmail: ${email} error: ${error}`);
    // Verificar si es un error de clave duplicada y devolver un mensaje específico
    if (error.code === 11000) {
      return {
        ok: false,
        msg: `El correo electrónico ${email} ya está registrado.`
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
  createStaffDAO,
};
