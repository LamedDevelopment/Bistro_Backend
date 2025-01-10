const bcrypt = require('bcryptjs');
const { response } = require('express');
const { getDateTimeForCountry, getTimeZoneForCountryName } = require('../../helper/global/times');
const { CreateDataCustomerDTO } = require('../dto/customerDTO');
const { createCustomerDAO } = require('../dao/customersDAO');
const { applogger } = require('../../../utils/logger');



const createCustomer = async (req, res) => {

    try {
        const data = req.body;
        const CreateDataCustomerDto = new CreateDataCustomerDTO(data);

        const createCustomerDao = await createCustomerDAO(CreateDataCustomerDto); 
        
        res.json({
            ok: true,
            msg: createCustomerDao.msg
        });
    } catch (error) {
        applogger.error(`Error en UsersDAO: createCustomer`);
        return {
            ok: false,
            msg: 'CRECUSCLL: createCustomer ' + error
          }
    }

}

module.exports = {
    createCustomer
}