const bcrypt = require('bcryptjs');
const { response } = require('express');
const { getDateTimeForCountry, getTimeZoneForCountryName } = require('../../helper/global/times');
const { CreateStaffDTO } = require('../dto/staff');
const { createStaffDAO } = require('../dao/CreateStaffDAO');



const createUser = async (req, res) => {

    try {
        const data = req.body;
        console.log('Datos de Entrada: ', data.countryCod);
        const Region = getTimeZoneForCountryName(data.countryCod)
        const dateNow = getDateTimeForCountry(data.countryCod)

        const CreateStaffDto = new CreateStaffDTO(data, data.countryCod, dateNow);

        const createStaffDao = await createStaffDAO(CreateStaffDto);

        console.log('Creacion de Staff: ', createStaffDao );
        
        res.json({
            ok: true,
            msg: createStaffDao.msg
        });
    } catch (error) {
        
    }

}

module.exports = {
    createUser
}